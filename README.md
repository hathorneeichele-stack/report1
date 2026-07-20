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
