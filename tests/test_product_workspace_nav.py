from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
ENTRY_PAGES = ["index.html", "产品相关.html"]


def read(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


class ProductWorkspaceNavTest(unittest.TestCase):
    def test_entry_pages_use_product_workspace_nav(self):
        expected_labels = [
            "产品运营工作台",
            "产品日历",
            "私募",
            "公募",
            "固收/结构化/QDII",
            "私募数据跟踪",
            "FOF产品运作情况",
            "销售播报",
            "公私募标准销量",
            "重点产品首发播报",
        ]
        forbidden_labels = ["中台管理系统", "一级页面", "当前模块", "客户运营", "投顾服务", "数据看板", "产品相关"]

        for page in ENTRY_PAGES:
            with self.subTest(page=page):
                html = read(page)
                for label in expected_labels:
                    self.assertIn(label, html)
                for label in forbidden_labels:
                    self.assertNotIn(label, html)
                self.assertNotIn("left:calc(100% + 10px)", html)
                self.assertIn("left:100%", html)

    def test_entry_pages_have_the_same_shell(self):
        index = read("index.html")
        product = read("产品相关.html")
        self.assertEqual(index, product)

    def test_sales_broadcast_is_split_into_two_modules(self):
        html = read("销售播报.html")
        for label in ["公私募标准销量", "重点产品首发播报"]:
            self.assertIn(label, html)
        self.assertRegex(html, re.compile(r'data-sales-module="standard"'))
        self.assertRegex(html, re.compile(r'data-sales-module="products"'))
        self.assertRegex(read("index.html"), re.compile(r'data-sales-entry="standard"'))
        self.assertRegex(read("index.html"), re.compile(r'data-sales-entry="products"'))
        self.assertIn("let pendingSalesModule = 'standard';", read("index.html"))
        self.assertIn("openSalesBroadcast(pendingSalesModule || 'standard')", read("index.html"))
        self.assertIn("type: 'set-sales-module'", read("index.html"))
        self.assertIn("data.type !== 'set-sales-module'", html)
        self.assertNotIn("数据来源：", html)
        self.assertNotIn("便于按工作场景快速查看", html)
        self.assertIn('id="asOfLabel"', html)
        self.assertIn('id="asOf"', html)
        self.assertIn("updateSalesDate(moduleName)", html)
        self.assertIn("grid-template-columns:repeat(2,minmax(0,1fr))", html)
        self.assertNotIn('title="${item.name}">${item.name}</div>\\n          <div class="metric-pair"', html)

    def test_product_config_workbench_label_is_updated(self):
        old_patterns = [
            "产品配置｜",
            "产品配置 /",
            ">产品配置<",
            "产品配置模块",
        ]

        for html_file in ROOT.glob("**/*.html"):
            with self.subTest(page=html_file.relative_to(ROOT)):
                html = html_file.read_text(encoding="utf-8")
                for pattern in old_patterns:
                    self.assertNotIn(pattern, html)


if __name__ == "__main__":
    unittest.main()
