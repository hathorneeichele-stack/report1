# 数据维护说明

【维护规则】
1. 数据更新只改 `/data/` 目录下对应的数据文件；
2. 页面样式修改只改 `index.html`、`产品相关.html` 或对应 CSS；
3. 不要把数据重新写死进 `index.html`；
4. 不要把最终页面重新拆回多个孤立页面；
5. 后续继续修改最终界面时，必须保留共享数据源机制。

## 数据文件对应关系

- `/data/productCalendarData.js`：公募日历、私募日历、固收结构化日历的日历与产品基础数据。
- `/data/productReportData.js`：私募数据跟踪、销售播报等报表数据。
- `/data/productMaterialData.js`：产品下钻材料、实盘业绩报告、PDF/图片/HTML 材料入口。
- `/data/customerOperationData.js`：客户运营模块后续数据预留。
- `/data/investmentServiceData.js`：投顾服务模块后续数据预留。

## 页面关系

- `index.html`：最终整合页面入口。
- `产品相关.html`：当前仍在使用的最终整合页面入口，与 `index.html` 保持同一套数据源引用。
- `/pages/`：保留原来的单独页面副本，单独打开时也读取 `/data/` 下同一份数据。

## 后续怎么更新

更新产品日历数据时，改 `/data/productCalendarData.js`。
更新私募数据跟踪或销售播报数据时，改 `/data/productReportData.js`。
更新产品材料、实盘业绩报告、PDF 或图片材料入口时，改 `/data/productMaterialData.js`。
页面样式和交互继续在最终页面或对应 HTML/CSS 中调整，不要把业务数据重新复制回页面。

## 对外分享 / 上传发布

每次改完底稿或 data 后，不需要手动挑文件上传。运行：

```bash
python3 tools/build_publish_artifacts.py
```

脚本会生成：

- `dist/share-package/`：完整网页文件夹，适合直接整体拖到 GitHub 仓库或部署目录；
- `dist/share-package.zip`：完整压缩包，适合发给别人、归档，或上传到 Release/网盘；
- `dist/single-html/index_单文件版.html`、`dist/single-html/产品相关_单文件版.html`：把本地 JS、图片、PDF 等尽量内嵌后的单 HTML，适合直接发给别人打开。

建议日常维护仍然只改根目录、`data/`、`assets/`；需要分享时再重新运行脚本生成发布产物。
