from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


MAIN_PAGES = [
    "index.html",
    "产品相关.html",
]

EMBEDDED_PAGES = [
    "嵌入-私募日历.html",
    "嵌入-公募日历.html",
    "嵌入-固收结构化日历.html",
    "嵌入-私募数据跟踪.html",
    "嵌入-FOF产品运行情况.html",
    "销售播报.html",
]


def read(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


class FrameSyncContractTest(unittest.TestCase):
    def test_shared_sync_scripts_exist(self):
        self.assertTrue((ROOT / "data/frameSync.js").exists())
        self.assertTrue((ROOT / "data/embeddedFrameSync.js").exists())

    def test_main_pages_use_frame_sync(self):
        for page in MAIN_PAGES:
            with self.subTest(page=page):
                html = read(page)
                self.assertIn('src="data/frameSync.js', html)
                self.assertIn("window.FrameSync?.initMain", html)

    def test_embedded_pages_use_child_sync(self):
        for page in EMBEDDED_PAGES:
            with self.subTest(page=page):
                html = read(page)
                self.assertIn('src="data/embeddedFrameSync.js', html)
                self.assertIn("window.EmbeddedFrameSync?.init", html)

    def test_fixed_structured_calendar_content_is_synced(self):
        data = read("data/productCalendarData.js")
        for text in ["招利511号", "招利554号", "龙腾鑫享554号", "明上增利系列"]:
            self.assertIn(text, data)

        for page in ["4、固收结构化日历.html", "嵌入-固收结构化日历.html", "pages/4、固收结构化日历.html"]:
            with self.subTest(page=page):
                html = read(page)
                self.assertIn("聊TA平台（PC端）-私募专区-私募产品白名单申报", html)
                self.assertIn("<strong>结构化产品</strong>", html)
                self.assertNotIn("<strong>自动敲入敲出</strong>", html)
                self.assertIn("1000万起投系列", html)
                self.assertIn("100万起投系列", html)
                self.assertIn("招利555号", html)
                self.assertIn("招利516号", html)
                self.assertIn("外部结构化产品首次配置激励：", html)
                self.assertIn("data-structured-pdf", html)
                self.assertIn("mingshang-zengli3-onepage.pdf", html)
                self.assertIn("mingshang-zengli3-full.pdf", html)
                self.assertNotIn("mingshang-zengli.jpg", html)
                self.assertIn("<strong>固收+产品</strong>", html)
                self.assertIn("固收+产品常态化发行", html)
                self.assertIn("华泰期货金元宝6号", html)
                self.assertIn("vertical-align:middle;text-align:center", html)
                self.assertIn("data-structured-image", html)
                self.assertIn("assets/structured-auto-ki/zhaoli-auto-ki.jpg", html)
                self.assertIn("object-fit:contain", html)
                self.assertNotIn("<th>资料图</th>", html)
                self.assertIn("100万元≤认购额/申购额&lt;300万元：2000分/户", html)
                self.assertIn("所有产品要素以实际销售通知为准", html)

        for page in MAIN_PAGES:
            with self.subTest(page=page):
                html = read(page)
                self.assertIn("嵌入-固收结构化日历.html?v=20260716_structured_auto_ki_v6", html)


if __name__ == "__main__":
    unittest.main()
