import importlib.util
from pathlib import Path
import unittest

import pandas as pd


MODULE_PATH = Path(__file__).resolve().parents[1] / "tools" / "build_sales_report.py"
spec = importlib.util.spec_from_file_location("build_sales_report", MODULE_PATH)
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class SalesReportBuilderTest(unittest.TestCase):
    def test_parse_key_product_sheet_ignores_blank_and_total_rows(self):
        df = pd.DataFrame(
            [
                ["营业部名称", "求和项:购买金额", None, "服务经理姓名", "求和项:购买金额", None, "营业部", "金额", "客户数", "服务经理姓名", "计数项:服务经理姓名"],
                ["(空白)", "", None, "(空白)", "", None, "(空白)", "", "", "(空白)", ""],
                ["济南解放东路", 10080000, None, "张磊", 2020000, None, "济南解放东路", 2020000, 2, "张磊", 2],
                ["总计", 16120000, None, "总计", 16120000, None, "总计", "", "", "总计", 14],
            ]
        )

        parsed = builder.parse_key_product_sheet("龙旗灵动", df)

        self.assertEqual(parsed["total_amount"], 16120000)
        self.assertEqual(parsed["total_clients"], 14)
        self.assertEqual(parsed["branches"], [{"name": "济南解放东路", "amount": 10080000}])
        self.assertEqual(parsed["managers"], [{"name": "张磊", "amount": 2020000}])
        self.assertEqual(
            parsed["deals"],
            [{"branch": "济南解放东路", "manager": "张磊", "amount": 2020000, "clients": 2}],
        )
        self.assertEqual(
            parsed["branch_stats"],
            [
                {
                    "name": "济南解放东路",
                    "amount": 10080000,
                    "people": 1,
                    "clients": 2,
                }
            ],
        )

    def test_branch_stats_group_people_and_clients_by_branch(self):
        df = pd.DataFrame(
            [
                ["营业部名称", "求和项:购买金额", None, "服务经理姓名", "求和项:购买金额", None, "营业部", "金额", "客户数", "服务经理姓名", "计数项:服务经理姓名"],
                ["青岛香港西路", 3520000, None, "张晶晶", 2020000, None, "青岛香港西路", 2020000, 2, "张晶晶", 2],
                ["", "", None, "王帅", 1500000, None, "青岛香港西路", 1500000, 1, "王帅", 1],
                ["总计", 3520000, None, "总计", 3520000, None, "总计", "", "", "总计", 3],
            ]
        )

        parsed = builder.parse_key_product_sheet("进化论1000", df)

        self.assertEqual(
            parsed["branch_stats"],
            [
                {
                    "name": "青岛香港西路",
                    "amount": 3520000,
                    "people": 2,
                    "clients": 3,
                }
            ],
        )


    def test_parse_standard_sales_totals_and_real_branches_only(self):
        df = pd.DataFrame(
            [
                ["", "7月营业部公私募标准销量情况\n（20260703）"] + [None] * 32,
                [None, "营业部"] + [None] * 32,
                [None, "", "公募目标值", "公募销量", "折算后", "省心投上浮", "配置笔记上浮", "公募标准销量", "完成率", "其中统计日新增", "当日提升", "私募目标值", "私募销量", "私募标准销量", "完成率", "其中统计日新增", "当日提升", "公私募目标值", "公私募汇总", "完成率", "其中统计日新增⬇", "当日提升"] + [None] * 12,
                [None, "济南解放路", 5720, 305.7, 376, 84.1, 0, 460.1, 0.08, 148, 0.02, 8600, 331, 1309, 0.15, 1204, 0.14, 14320, 1769.1, 0.12, 1352, 0.09] + [None] * 12,
                [None, "山东分公司业务部", 0, 0, 0, 0, 0, 0, "", 0, "", 0, 0, 0, "", 0, "", 0, 0, "", 0, ""] + [None] * 12,
                [None, "总计", 21360, 1534, 2236, 145.76, 0.16, 2381.92, 0.1115, 790, 0.0369, 31970, 2188, 5189.5, 0.1623, 2972, 0.0929, 53330, 7571.42, 0.1419, 3762, 0.0705] + [None] * 12,
            ]
        )

        parsed = builder.parse_standard_sales(df)

        self.assertEqual(parsed["as_of"], "20260703")
        self.assertEqual(parsed["totals"]["combined_target"], 53330)
        self.assertEqual(parsed["totals"]["combined_amount"], 7571.42)
        self.assertEqual(parsed["branches"][0]["branch"], "济南解放路")
        self.assertTrue(all(row["branch"] != "山东分公司业务部" for row in parsed["branches"]))

    def test_parse_standard_sales_sorts_by_combined_daily_lift(self):
        df = pd.DataFrame(
            [
                ["", "7月营业部公私募标准销量情况\n（20260706）"] + [None] * 32,
                [None, "营业部"] + [None] * 32,
                [None, "", "公募目标值", "公募销量", "折算后", "省心投上浮", "配置笔记上浮", "公募标准销量", "完成率", "其中统计日新增", "当日提升", "私募目标值", "私募销量", "私募标准销量", "完成率", "其中统计日新增", "当日提升", "公私募目标值", "公私募汇总", "完成率", "其中统计日新增⬇", "当日提升"] + [None] * 12,
                [None, "A营业部", 100, 0, 0, 0, 0, 10, 0.1, 1, 0.01, 100, 0, 20, 0.2, 2, 0.02, 200, 30, 0.15, 3, 0.015] + [None] * 12,
                [None, "B营业部", 100, 0, 0, 0, 0, 40, 0.4, 4, 0.04, 100, 0, 50, 0.5, 5, 0.05, 200, 90, 0.45, 9, 0.045] + [None] * 12,
                [None, "总计", 200, 0, 0, 0, 0, 50, 0.25, 5, 0.025, 200, 0, 70, 0.35, 7, 0.035, 400, 120, 0.3, 12, 0.03] + [None] * 12,
            ]
        )

        parsed = builder.parse_standard_sales(df)

        self.assertEqual([row["branch"] for row in parsed["branches"]], ["B营业部", "A营业部"])

    def test_employee_top_lists_and_buckets(self):
        records = [
            {"name": "甲", "branch": "A", "public_amount": 600, "private_amount": 0, "combined_amount": 600},
            {"name": "乙", "branch": "A", "public_amount": 300, "private_amount": 900, "combined_amount": 1200},
            {"name": "丙", "branch": "B", "public_amount": 120, "private_amount": 200, "combined_amount": 320},
            {"name": "丁", "branch": "B", "public_amount": 20, "private_amount": 40, "combined_amount": 60},
            {"name": "戊", "branch": "C", "public_amount": 0, "private_amount": 5, "combined_amount": 5},
            {"name": "己", "branch": "C", "public_amount": 900, "private_amount": 1000, "combined_amount": 1900},
            {"name": "庚", "branch": "D", "public_amount": 0, "private_amount": 0, "combined_amount": 0},
        ]

        top_lists = builder.employee_top_lists(records, limit=3)
        buckets = builder.bucket_employee_sales(records)

        self.assertEqual([row["name"] for row in top_lists["public"]], ["己", "甲", "乙"])
        self.assertEqual([row["name"] for row in top_lists["private"]], ["己", "乙", "丙"])
        self.assertEqual([row["name"] for row in top_lists["combined"]], ["己", "乙", "甲"])
        self.assertEqual(buckets["combined"][0]["label"], "1000万以上")
        self.assertEqual(buckets["combined"][0]["people"], 2)
        self.assertEqual(buckets["combined"][0]["amount"], 3100)
        self.assertEqual(buckets["public"][-1]["people"], 2)
        self.assertEqual(buckets["private"][-1]["people"], 3)
        self.assertEqual(buckets["combined"][-1]["people"], 2)
        self.assertEqual(
            {sum(row["people"] for row in bucket_rows) for bucket_rows in buckets.values()},
            {len(records)},
        )

    def test_build_report_uses_updated_evolution_product_file(self):
        data = builder.build_report_data()
        evolution = next(product for product in data["products"] if product["name"] == "进化论1000")

        self.assertEqual(evolution["total_amount"], 11570000)
        self.assertEqual(evolution["total_clients"], 9)
        self.assertEqual(evolution["branches"][0], {"name": "济南解放路", "amount": 4010000})


if __name__ == "__main__":
    unittest.main()
