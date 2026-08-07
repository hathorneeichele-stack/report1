(function () {
  const ASSISTANT_VERSION = "20260807_assistant_exact_open_date";
  const DEFAULT_PROMPT = "你可以说：帮我搜索近一周收益增幅超过3%、今年以来增幅超10%、8月开放持营的、在私享持营池的产品";
  const MASCOT_IDLE_SRC = "assets/assistant-rocky-idle.png";
  const MASCOT_AWAKE_SRC = "assets/assistant-rocky-awake.png";
  const MASCOT_WORKING_SRC = "assets/assistant-rocky-working.png";

  const styleText = `
    @keyframes productAiFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes productAiPetNod {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      28% { transform: translateY(-4px) rotate(-2deg); }
      58% { transform: translateY(1px) rotate(2deg); }
    }

    @keyframes productAiPop {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }

    .product-ai-button {
      position: fixed;
      right: 22px;
      top: 52%;
      z-index: 5200;
      width: 92px;
      height: 92px;
      border: 0;
      border-radius: 0;
      padding: 0;
      cursor: pointer;
      background: transparent;
      box-shadow: none;
      display: grid;
      place-items: center;
      overflow: visible;
      transition: filter .18s ease;
    }

    .product-ai-button:hover {
      filter: saturate(1.1);
    }

    .product-ai-button.is-active {
      animation: productAiPop .72s ease-out 1;
    }

    .product-ai-button img {
      width: 86px;
      height: 88px;
      object-fit: contain;
      image-rendering: pixelated;
      filter: drop-shadow(0 10px 16px rgba(15, 23, 42, .28));
      animation: productAiPetNod 2.8s steps(2, end) infinite;
      pointer-events: none;
    }

    .product-ai-panel {
      position: fixed;
      right: 112px;
      top: calc(52% - 190px);
      z-index: 5190;
      width: min(430px, calc(100vw - 138px));
      max-height: min(650px, calc(100vh - 56px));
      border: 1px solid #d8e2f3;
      border-radius: 14px;
      background: rgba(255,255,255,.98);
      box-shadow: 0 24px 70px rgba(15, 23, 42, .24);
      overflow: hidden;
      display: grid;
      grid-template-rows: auto auto minmax(0, 1fr);
    }

    .product-ai-panel[hidden] {
      display: none;
    }

    .product-ai-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px 12px;
      border-bottom: 1px solid #eef2f8;
      background: linear-gradient(135deg, #fff8ee 0%, #f3f6ff 58%, #f9edff 100%);
    }

    .product-ai-mini {
      width: 38px;
      height: 38px;
      border-radius: 9px;
      overflow: visible;
      flex: 0 0 38px;
      background: rgba(255,255,255,.86);
      box-shadow: inset 0 0 0 1px rgba(66,104,214,.16);
      display: grid;
      place-items: center;
    }

    .product-ai-mini img {
      width: 42px;
      height: 42px;
      object-fit: contain;
      image-rendering: pixelated;
    }

    .product-ai-title {
      min-width: 0;
      flex: 1 1 auto;
    }

    .product-ai-title strong {
      display: block;
      color: #182238;
      font-size: 15px;
      line-height: 1.25;
      font-weight: 850;
    }

    .product-ai-title span {
      display: block;
      margin-top: 2px;
      color: #6b7588;
      font-size: 12px;
    }

    .product-ai-close {
      width: 30px;
      height: 30px;
      border: 1px solid #d7e1f1;
      border-radius: 8px;
      background: #fff;
      color: #65728a;
      cursor: pointer;
      font-size: 19px;
      line-height: 1;
    }

    .product-ai-query {
      padding: 14px 16px;
      border-bottom: 1px solid #eef2f8;
      background: #fff;
    }

    .product-ai-hint {
      margin: 0 0 10px;
      color: #4c5870;
      font-size: 13px;
      line-height: 1.55;
    }

    .product-ai-input-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
    }

    .product-ai-input {
      min-width: 0;
      height: 86px;
      border: 1px solid #cfd9eb;
      border-radius: 8px;
      padding: 9px 11px;
      outline: 0;
      color: #1f2a3d;
      background: #fff;
      font: inherit;
      line-height: 1.45;
      resize: vertical;
    }

    .product-ai-input:focus {
      border-color: #6e8dff;
      box-shadow: 0 0 0 3px rgba(66,104,214,.14);
    }

    .product-ai-search {
      min-height: 86px;
      border: 0;
      border-radius: 8px;
      padding: 0 14px;
      background: #4268d6;
      color: #fff;
      cursor: pointer;
      font-weight: 800;
    }

    .product-ai-results {
      min-height: 0;
      overflow: auto;
      padding: 12px 12px 14px;
      background: #f7f9fd;
    }

    .product-ai-summary {
      margin: 0 4px 10px;
      color: #667085;
      font-size: 12px;
    }

    .product-ai-card {
      width: 100%;
      border: 1px solid #e4eaf4;
      border-radius: 10px;
      background: #fff;
      padding: 11px 12px;
      margin-bottom: 9px;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 5px 14px rgba(25, 35, 68, .05);
    }

    .product-ai-card:hover {
      border-color: #b9c9ed;
      box-shadow: 0 8px 20px rgba(25, 35, 68, .09);
    }

    .product-ai-card-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: flex-start;
    }

    .product-ai-name {
      color: #182238;
      font-weight: 850;
      line-height: 1.35;
    }

    .product-ai-code {
      color: #7a8496;
      font-size: 12px;
      white-space: nowrap;
      padding-top: 1px;
    }

    .product-ai-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
      color: #536079;
      font-size: 12px;
    }

    .product-ai-meta span {
      padding: 3px 7px;
      border-radius: 999px;
      background: #eef3ff;
    }

    .product-ai-meta .gain {
      color: #b7202e;
      background: #fff1f2;
    }

    .product-ai-meta .loss {
      color: #1f7a4d;
      background: #edf8f1;
    }

    .product-ai-reason {
      margin-top: 8px;
      color: #65728a;
      font-size: 12px;
      line-height: 1.45;
    }

    .product-ai-empty {
      margin: 20px 6px;
      padding: 18px;
      border: 1px dashed #cfd9eb;
      border-radius: 10px;
      color: #65728a;
      background: #fff;
      text-align: center;
      font-size: 13px;
    }

    @media (max-width: 760px) {
      .product-ai-button {
        right: 16px;
        top: auto;
        bottom: 24px;
        width: 80px;
        height: 80px;
      }

      .product-ai-button img {
        width: 74px;
        height: 76px;
      }

      .product-ai-panel {
        left: 14px;
        right: 14px;
        top: auto;
        bottom: 98px;
        width: auto;
        max-height: min(620px, calc(100vh - 124px));
      }
    }
  `;

  function injectStyle() {
    if (document.getElementById("productAssistantStyle")) return;
    const style = document.createElement("style");
    style.id = "productAssistantStyle";
    style.textContent = styleText;
    document.head.appendChild(style);
  }

  function cleanText(value, fallback = "") {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text || fallback;
  }

  function normalizeQueryText(value) {
    return cleanText(value)
      .replace(/近\s*一\s*个\s*周/g, "近一周")
      .replace(/近\s*1\s*个\s*周/g, "近一周")
      .replace(/近\s*一\s*周\s*(?:收益增幅|收益|增幅)/g, "近一周增幅")
      .replace(/近\s*1\s*周\s*(?:收益增幅|收益|增幅)/g, "近一周增幅")
      .replace(/一\s*个\s*周/g, "一周")
      .replace(/1\s*个\s*周/g, "一周")
      .replace(/周度收益|一周收益/g, "近一周")
      .replace(/(^|[^近一])周收益/g, "$1近一周")
      .replace(/年内|今年(?!以来)/g, "今年以来")
      .replace(/收益率/g, "收益")
      .replace(/\s+/g, "");
  }

  function parsePercent(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const text = cleanText(value);
    if (!text || text === "-" || text === "--") return null;
    const match = text.match(/([+-]?\d+(?:\.\d+)?)\s*%/);
    return match ? Number(match[1]) / 100 : null;
  }

  function parseNumeric(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const match = cleanText(value).match(/([+-]?\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : null;
  }

  function normalizeDatePart(value) {
    const number = Number(value);
    return Number.isInteger(number) ? number : null;
  }

  function isValidMonthDay(month, day) {
    return Number.isInteger(month) && month >= 1 && month <= 12
      && Number.isInteger(day) && day >= 1 && day <= 31;
  }

  function makeMonthDay(month, day) {
    if (!isValidMonthDay(month, day)) return null;
    return {
      month,
      day,
      key: `${month}-${day}`,
      label: `${month}月${day}日`
    };
  }

  function uniqueMonthDays(dates) {
    const seen = new Set();
    return dates.filter(date => {
      if (!date || seen.has(date.key)) return false;
      seen.add(date.key);
      return true;
    });
  }

  function parseMonthDaysFromText(value, { allowNumericShort = false } = {}) {
    const text = cleanText(value);
    if (!text) return [];
    const dates = [];
    text.replace(/20\d{2}[-/年](\d{1,2})[-/月](\d{1,2})日?/g, (_, month, day) => {
      dates.push(makeMonthDay(normalizeDatePart(month), normalizeDatePart(day)));
      return _;
    });
    text.replace(/(^|[^0-9])(\d{1,2})\s*月\s*(\d{1,2})\s*(?:日|号)?/g, (_, prefix, month, day) => {
      dates.push(makeMonthDay(normalizeDatePart(month), normalizeDatePart(day)));
      return _;
    });
    if (allowNumericShort) {
      text.replace(/(^|[^0-9])(\d{1,2})[./-](\d{1,2})(?=$|[^0-9%])/g, (_, prefix, month, day) => {
        dates.push(makeMonthDay(normalizeDatePart(month), normalizeDatePart(day)));
        return _;
      });
    }
    return uniqueMonthDays(dates);
  }

  function parseOpenDates(text) {
    const normalized = cleanText(text);
    const hasOpenIntent = /开放|申购|持营/.test(normalized);
    return parseMonthDaysFromText(normalized, { allowNumericShort: hasOpenIntent });
  }

  function parseRatioLike(value) {
    const raw = parseNumeric(value);
    if (raw === null) return null;
    return Math.abs(raw) > 1 ? raw / 100 : raw;
  }

  function formatPercent(raw, fallback) {
    if (typeof raw !== "number" || !Number.isFinite(raw)) return cleanText(fallback, "--");
    const sign = raw > 0 ? "+" : "";
    return `${sign}${(raw * 100).toFixed(2)}%`;
  }

  const TRACKING_SEARCH_FIELDS = [
    {
      key: "rank",
      label: "排名",
      aliases: ["排名", "策略排名", "子策略排名"],
      value: item => [item.strategyRank, item.subStrategyRank].filter(value => cleanText(value) && cleanText(value) !== "-").join(" / ")
    },
    { key: "established", label: "成立时间", aliases: ["成立时间", "成立日期"], value: item => item.established },
    { key: "manager", label: "管理人", aliases: ["管理人", "管理方", "基金管理人"], value: item => item.manager },
    {
      key: "subscriptionDay",
      label: "申购日",
      aliases: ["申购日", "开放日", "开放", "申购"],
      value: item => Array.from(new Set([item.subscriptionDay, item.openText, ...(item.openTexts || [])]
        .map(value => cleanText(value))
        .filter(Boolean))).join(" / ")
    },
    {
      key: "privatePool",
      label: "私享持营池",
      aliases: ["私享持营池", "私享池", "持营池", "私享"],
      value: item => item.isPrivatePool ? cleanText(item.lockup, "私享持营池") : ""
    },
    { key: "nav", label: "累计净值", aliases: ["累计净值", "净值"], value: item => item.nav },
    { key: "week", label: "近一周增幅", aliases: ["近一周增幅", "近一周收益", "一周增幅", "一周收益", "周收益"], value: item => item.weekReturn },
    { key: "month", label: "近一月增幅", aliases: ["近一月增幅", "近一月收益", "一月增幅", "一月收益", "月收益"], value: item => item.monthReturn },
    { key: "ytd", label: "今年以来增幅", aliases: ["今年以来增幅", "今年以来收益", "年初以来", "年内收益"], value: item => item.ytdReturn },
    { key: "return2025", label: "2025年增幅", aliases: ["2025年增幅", "2025年收益", "去年收益"], value: item => item.return2025 },
    { key: "maxDrawdown", label: "成立最大回撤", aliases: ["成立最大回撤", "最大回撤", "回撤"], value: item => item.maxDrawdown },
    { key: "sharpe", label: "成立Sharpe", aliases: ["成立sharpe", "sharpe", "夏普", "成立夏普"], value: item => item.sharpe }
  ];

  const TRACKING_FIELD_ALIAS_PATTERN = new RegExp(
    TRACKING_SEARCH_FIELDS
      .flatMap(field => field.aliases)
      .sort((a, b) => b.length - a.length)
      .map(alias => alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|"),
    "gi"
  );

  function detectRequestedFields(text) {
    const lowerText = cleanText(text).toLowerCase();
    const keys = [];
    TRACKING_SEARCH_FIELDS.forEach(field => {
      if (field.aliases.some(alias => lowerText.includes(alias.toLowerCase()))) keys.push(field.key);
    });
    return Array.from(new Set(keys));
  }

  function trackingFieldValue(item, key) {
    const field = TRACKING_SEARCH_FIELDS.find(entry => entry.key === key);
    return field ? cleanText(field.value(item)) : "";
  }

  function trackingFieldLabel(key) {
    return TRACKING_SEARCH_FIELDS.find(entry => entry.key === key)?.label || key;
  }

  function parseChineseNumber(value) {
    const text = cleanText(value);
    if (!text) return null;
    if (/^\d+$/.test(text)) return Number(text);
    const digits = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
    if (text === "十") return 10;
    if (text.startsWith("十")) return 10 + (digits[text.slice(1)] || 0);
    if (text.endsWith("十")) return (digits[text[0]] || 1) * 10;
    if (text.includes("十")) {
      const [tens, ones] = text.split("十");
      return (digits[tens] || 1) * 10 + (digits[ones] || 0);
    }
    return digits[text] || null;
  }

  function parseTopLimit(text) {
    const match = cleanText(text).match(/(?:排名|排行|排|top|TOP)?前\s*([一二两三四五六七八九十]|\d{1,2})/) || cleanText(text).match(/top\s*([1-9]\d?)/i);
    const value = match ? parseChineseNumber(match[1]) : null;
    return value ? Math.max(1, Math.min(40, value)) : 0;
  }

  function productKey(item) {
    const code = cleanText(item.productCode || item.code);
    return code ? `code:${code}` : `name:${cleanText(item.productName || item.name)}`;
  }

  function normalizeSourceSet(item) {
    if (!item.sources) item.sources = new Set();
    if (Array.isArray(item.sourceLabels)) item.sourceLabels.forEach(source => item.sources.add(source));
    return item.sources;
  }

  function mergeItem(map, raw) {
    const key = productKey(raw);
    if (!key || key === "name:") return;
    const existing = map.get(key) || {};
    const sources = normalizeSourceSet(existing);
    cleanText(raw.sourceLabel) && sources.add(raw.sourceLabel);
    const merged = {
      ...existing,
      ...Object.fromEntries(Object.entries(raw).filter(([, value]) => value !== undefined && value !== null && value !== "")),
      productName: cleanText(existing.productName || raw.productName || raw.name),
      productCode: cleanText(existing.productCode || raw.productCode || raw.code),
      manager: cleanText(existing.manager || raw.manager),
      strategy: cleanText(existing.strategy || raw.strategy),
      subStrategy: cleanText(existing.subStrategy || raw.subStrategy),
      sourceLabels: Array.from(sources),
      sources
    };
    merged.weekRaw = typeof existing.weekRaw === "number" ? existing.weekRaw : parsePercent(raw.weekRaw ?? raw.weekReturn ?? raw.week);
    merged.monthRaw = typeof existing.monthRaw === "number" ? existing.monthRaw : parsePercent(raw.monthRaw ?? raw.monthReturn);
    merged.ytdRaw = typeof existing.ytdRaw === "number" ? existing.ytdRaw : parsePercent(raw.ytdRaw ?? raw.ytdReturn ?? raw.ytd);
    merged.weekReturn = existing.weekReturn || raw.weekReturn || raw.week || formatPercent(merged.weekRaw);
    merged.monthReturn = existing.monthReturn || raw.monthReturn || formatPercent(merged.monthRaw);
    merged.ytdReturn = existing.ytdReturn || raw.ytdReturn || raw.ytd || formatPercent(merged.ytdRaw);
    merged.isPrivatePool = Boolean(existing.isPrivatePool || raw.isPrivatePool || raw.type === "pool" || raw.typeLabel === "私享持营池");
    merged.openMonths = Array.from(new Set([...(existing.openMonths || []), ...(raw.openMonths || [])]));
    merged.openTexts = Array.from(new Set([...(existing.openTexts || []), cleanText(raw.subscriptionDay), cleanText(raw.openText)].filter(Boolean)));
    map.set(key, merged);
  }

  function collectPrivateTracking(map) {
    const privateTracking = window.productReportData?.privateTracking;
    if (!privateTracking?.strategies) return;
    privateTracking.strategies.forEach(strategy => {
      (strategy.rows || []).forEach(row => {
        mergeItem(map, {
          ...row,
          strategy: strategy.title,
          sourceLabel: "私募数据跟踪"
        });
      });
    });
  }

  function collectPrivateCalendar(map) {
    const privateData = window.productCalendarData?.private;
    (privateData?.EVENTS || []).forEach(event => {
      if (event.strategy === "规模不足500万") return;
      mergeItem(map, {
        ...event,
        productName: event.name,
        productCode: event.code,
        sourceLabel: "私募日历",
        isPrivatePool: event.type === "pool" || event.typeLabel === "私享持营池",
        openMonths: event.month ? [Number(event.month)] : [],
        openText: event.openText
      });
    });
  }

  function collectPublicCalendar(map) {
    const publicData = window.productCalendarData?.public;
    (publicData?.PRODUCTS || []).forEach(product => {
      mergeItem(map, {
        productName: product.name,
        productCode: product.code,
        manager: product.manager || product.company || "",
        strategy: product.category || product.section,
        subStrategy: product.style,
        sourceLabel: "公募日历",
        openText: product.period,
        sourceText: [product.policy, product.intro, product.status, product.custody].filter(Boolean).join(" ")
      });
    });
  }

  function collectSalesBroadcast(map) {
    const products = window.productReportData?.salesBroadcast?.products || [];
    products.forEach(product => {
      mergeItem(map, {
        productName: product.name,
        sourceLabel: "产品销售",
        sourceText: JSON.stringify(product)
      });
    });
  }

  function buildSearchIndex() {
    const map = new Map();
    collectPrivateTracking(map);
    collectPrivateCalendar(map);
    collectPublicCalendar(map);
    collectSalesBroadcast(map);
    return Array.from(map.values()).map(item => {
      const sourceLabels = Array.from(item.sources || item.sourceLabels || []);
      const trackingFieldText = TRACKING_SEARCH_FIELDS
        .map(field => {
          const value = cleanText(field.value(item));
          return value ? `${field.label} ${field.aliases.join(" ")} ${value}` : "";
        })
        .filter(Boolean)
        .join(" ");
      const haystack = [
        item.productName,
        item.productCode,
        item.manager,
        item.strategy,
        item.subStrategy,
        item.subscriptionDay,
        item.openText,
        item.openTexts?.join(" "),
        item.lockup,
        item.weekReturn,
        item.monthReturn,
        item.ytdReturn,
        item.return2025,
        item.maxDrawdown,
        item.sharpe,
        item.typeLabel,
        item.priorityLevel,
        item.standardSales,
        item.standardHolding,
        item.sourceText,
        trackingFieldText,
        sourceLabels.join(" ")
      ].filter(Boolean).join(" ");
      return { ...item, sourceLabels, haystack: haystack.toLowerCase() };
    });
  }

  function parseQuery(query) {
    const text = normalizeQueryText(query);
    const week = text.match(/(?:近一周|一周|周)[^，,、。；;]*(?:超过|超|大于|>=|不低于|不少于|高于|过)\s*([+-]?\d+(?:\.\d+)?)\s*%?/);
    const monthReturn = text.match(/(?:近一月|一月|月)[^，,、。；;]*(?:超过|超|大于|>=|不低于|不少于|高于|过)\s*([+-]?\d+(?:\.\d+)?)\s*%?/);
    const ytd = text.match(/(?:今年以来|年初以来)[^，,、。；;]*(?:超过|超|大于|>=|不低于|不少于|高于|过)\s*([+-]?\d+(?:\.\d+)?)\s*%?/);
    const month = text.match(/(\d{1,2})\s*月[^，,、。；;]*(?:开放|申购|持营)/);
    const openDates = parseOpenDates(text);
    const standardSales = text.match(/(?:标准销量|标准销售|销量标准|销售标准|销量)(?:为|是|=|等于)?\s*(\d+(?:\.\d+)?)/);
    const sharpe = parseNumericCondition(text, /(?:成立)?sharpe|夏普|成立夏普/i);
    const maxDrawdown = parseNumericCondition(text, /成立最大回撤|最大回撤|回撤/);
    const pool = /私享持营池|持营池|私享/.test(text);
    const strategyIntent = detectStrategyIntent(text);
    const rankFirst = /(?:近一周|周)[^，,、。；;]*(?:第一|最高|最佳|最大)|(?:第一|最高|最佳|最大)[^，,、。；;]*(?:近一周|周|增幅|收益)/.test(text);
    const groupTop = parseGroupTop(text);
    const topLimit = parseTopLimit(text);
    const sortMetric = detectSortMetric(text);
    const privateScope = /私募/.test(text) || !/(?:公募|销售)/.test(text);
    const metricSigns = detectMetricSigns(text);
    const requestedFields = detectRequestedFields(text);
    const codeTokens = (text.match(/[A-Za-z0-9]{4,}/g) || [])
      .map(token => token.toLowerCase())
      .filter(token => /\d/.test(token) && !(openDates.length && /^20\d{2}$/.test(token)));
    const displayMetrics = detectDisplayMetrics(text, {
      weekMin: week,
      monthMin: monthReturn,
      ytdMin: ytd,
      sharpe,
      maxDrawdown,
      metricSigns
    });
    const tokens = text
      .replace(/量化股票多头策略|量化股票多头|量化多头|主观股票多头策略|主观股票多头|主观多头|组合基金|FOF|fof|基金组合|套利策略|债券策略|市场中性策略|市场中性|宏观策略|宏观对冲|复合策略|CTA策略|量化择时|灵活多空|全市场选股|小市值|中证全指指增|中证500|500指增|中证1000|1000指增|中证A500|A500指增|沪深300|300指增/g, " ")
      .replace(TRACKING_FIELD_ALIAS_PATTERN, " ")
      .replace(/(?:排名|排行|排|top|TOP)?前\s*(?:[一二两三四五六七八九十]|\d{1,2})|top\s*[1-9]\d?/gi, " ")
      .replace(/帮我|搜索|查找|找一下|找|产品|近一周|一周|周|近一月|一月|月|收益|增幅|超过|超|大于|高于|过|为正|正收益|正增幅|正|为负|负收益|负增幅|负|今年以来|年初以来|开放|申购|持营|私享持营池|私享|持营池|标准销量|标准销售|销量标准|销售标准|成立最大回撤|最大回撤|回撤|成立sharpe|sharpe|夏普|成立夏普|第一|最高|最佳|最大|排名|私募|几个策略|各选|每个策略|每类|每组|个|的|在|且|并且|同时|、|，|。|；|%|\d+(?:\.\d+)?/g, " ")
      .split(/\s+/)
      .map(token => token.trim().toLowerCase())
      .filter(token => token.length >= 2);
    return {
      raw: text,
      weekMin: week ? Number(week[1]) / 100 : null,
      monthMin: monthReturn ? Number(monthReturn[1]) / 100 : null,
      ytdMin: ytd ? Number(ytd[1]) / 100 : null,
      sharpe,
      maxDrawdown,
      openMonth: month ? Number(month[1]) : null,
      openDates,
      standardSales: standardSales ? Number(standardSales[1]) : null,
      privatePool: pool,
      strategyIntent,
      rankFirst,
      groupTop,
      topLimit,
      sortMetric,
      privateScope,
      metricSigns,
      requestedFields,
      displayMetrics,
      codeTokens,
      tokens
    };
  }

  function parseNumericCondition(text, labelPattern) {
    const label = labelPattern.source;
    const pattern = new RegExp(`(?:${label})[^，,、。；;且并]*?(不超过|不高于|不低于|不少于|大于等于|小于等于|超过|高于|低于|大于|小于|>=|<=|>|<|为|是|=|等于)?\\s*([+-]?\\d+(?:\\.\\d+)?)\\s*%?`, labelPattern.flags || "");
    const match = text.match(pattern);
    if (!match) return null;
    const opText = match[1] || "=";
    const op = /不超过|不高于|小于等于|低于|小于|<=|</.test(opText)
      ? "<="
      : /不低于|不少于|大于等于|超过|高于|大于|>=|>/.test(opText)
        ? ">="
        : "=";
    return { op, value: Number(match[2]) };
  }

  function detectDisplayMetrics(text, context) {
    const metrics = new Set();
    if (/(?:近一周|一周|周)/.test(text) || context.weekMin || context.metricSigns.week) metrics.add("week");
    if (/(?:近一月|一月|月增幅|近一月增幅)/.test(text) || context.monthMin || context.metricSigns.month) metrics.add("month");
    if (/(?:今年以来|年初以来)/.test(text) || context.ytdMin || context.metricSigns.ytd) metrics.add("ytd");
    if (/(?:sharpe|夏普)/i.test(text) || context.sharpe) metrics.add("sharpe");
    if (/(?:成立最大回撤|最大回撤|回撤)/.test(text) || context.maxDrawdown) metrics.add("maxDrawdown");
    return Array.from(metrics);
  }

  function detectMetricSigns(text) {
    return {
      week: detectSignForMetric(text, /(?:近一周|一周|周)(?:收益|增幅)?/),
      month: detectSignForMetric(text, /(?:近一月|一月|月)(?:收益|增幅)?/),
      ytd: detectSignForMetric(text, /(?:今年以来|年初以来)(?:收益|增幅)?/)
    };
  }

  function detectSignForMetric(text, metricPattern) {
    const source = metricPattern.source;
    const positive = new RegExp(`${source}[^，,、。；;且并]{0,12}(?:为正|正收益|正增幅|收益为正|增幅为正|大于0|高于0|>0|正)`).test(text);
    const negative = new RegExp(`${source}[^，,、。；;且并]{0,12}(?:为负|负收益|负增幅|收益为负|增幅为负|小于0|低于0|<0|负)`).test(text);
    if (positive) return "positive";
    if (negative) return "negative";
    return "";
  }

  function parseGroupTop(text) {
    if (!/(?:几个策略|各策略|每个策略|每类|每组|各选)/.test(text)) return 0;
    const match = text.match(/(?:各选|每个策略|每类|每组)\s*(\d+)\s*个?/) || text.match(/(\d+)\s*个/);
    return match ? Math.max(1, Math.min(10, Number(match[1]))) : 2;
  }

  function detectSortMetric(text) {
    if (/(?:今年以来|年初以来)/.test(text)) return "ytd";
    if (/近一月|一个月|月增幅|近一月增幅/.test(text)) return "month";
    if (/近一周|一周|周增幅|近一周增幅/.test(text)) return "week";
    return "";
  }

  function detectStrategyIntent(text) {
    const rules = [
      ["量化多头", /量化股票多头策略|量化股票多头|量化多头|中证500|500指增|中证1000|1000指增|中证A500|A500指增|沪深300|300指增|中证全指指增|小市值|全市场选股|量化择时/],
      ["主观股票多头", /主观股票多头策略|主观股票多头|主观多头/],
      ["组合基金", /组合基金|FOF|fof|基金组合/],
      ["套利策略", /套利策略|套利/],
      ["债券策略", /债券策略|债券/],
      ["市场中性策略", /市场中性策略|市场中性/],
      ["宏观策略", /宏观策略|宏观对冲|宏观/],
      ["复合策略", /复合策略|复合/],
      ["CTA策略", /CTA策略|cta策略|CTA|cta/],
      ["灵活多空", /灵活多空/]
    ];
    const found = rules.find(([, pattern]) => pattern.test(text));
    return found ? found[0] : "";
  }

  function strategyText(item) {
    return [item.strategy, item.subStrategy, item.category, item.typeLabel]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function matchesStrategyIntent(item, intent) {
    if (!intent) return true;
    const text = strategyText(item);
    if (!text) return false;
    if (intent === "量化多头") {
      if (/组合|fof|基金组合/.test(text)) return false;
      return /量化|指增|中证|沪深|a500|500|1000|300|小市值|全市场选股|择时|多头/.test(text);
    }
    if (intent === "组合基金") return /组合|fof|基金组合/.test(text);
    if (intent === "主观股票多头") return /主观|股票多头/.test(text) && !/量化|组合|fof/.test(text);
    return text.includes(intent.toLowerCase().replace(/策略$/, "")) || text.includes(intent.toLowerCase());
  }

  function hasOpenMonth(item, month) {
    if (!month) return true;
    if ((item.openMonths || []).includes(month)) return true;
    const texts = [item.subscriptionDay, item.openText, ...(item.openTexts || [])].filter(Boolean).join(" ");
    const padded = String(month).padStart(2, "0");
    return new RegExp(`(^|[^0-9])${month}\\s*[月\\.]`).test(texts)
      || texts.includes(`2026-${padded}`)
      || texts.includes(`2026/${padded}`)
      || texts.includes(`${month}月`);
  }

  function hasOpenDate(item, openDate) {
    if (!openDate) return true;
    if (Number(item.month) === openDate.month && Number(item.day) === openDate.day) return true;
    const texts = [item.subscriptionDay, item.openText, ...(item.openTexts || [])].filter(Boolean).join(" ");
    return parseMonthDaysFromText(texts, { allowNumericShort: true }).some(date => date.key === openDate.key);
  }

  function hasPrivateSource(item) {
    return (item.sourceLabels || []).some(source => source === "私募数据跟踪" || source === "私募日历");
  }

  function matchesMetricSign(item, metric, sign) {
    if (!sign) return true;
    const raw = metricRaw(item, metric);
    if (typeof raw !== "number" || !Number.isFinite(raw)) return false;
    return sign === "positive" ? raw > 0 : raw < 0;
  }

  function addMetricSignReason(item, metric, sign, reasons) {
    if (!sign) return;
    reasons.push(`${metricLabel(metric)}${sign === "positive" ? "为正" : "为负"} ${formatPercent(metricRaw(item, metric), metricReturn(item, metric))}`);
  }

  function compareNumber(value, condition, transform = value => value) {
    if (!condition) return true;
    if (typeof value !== "number" || !Number.isFinite(value)) return false;
    const actual = transform(value);
    const target = transform(condition.value);
    if (condition.op === ">=") return actual >= target;
    if (condition.op === "<=") return actual <= target;
    return Math.abs(actual - target) < 0.0001;
  }

  function addRequestedFieldReasons(item, query, reasons) {
    if (!query.requestedFields?.length) return true;
    for (const key of query.requestedFields) {
      const value = trackingFieldValue(item, key);
      if (!value || value === "-" || value === "--") return false;
      reasons?.push(`${trackingFieldLabel(key)} ${value}`);
    }
    return true;
  }

  function tokenMatchScore(item, tokens, reasons, { relaxed = false } = {}) {
    if (!tokens.length) return 0;
    let score = 0;
    const matched = [];
    const fields = [
      ["管理人", item.manager, 28],
      ["产品名称", item.productName || item.name, 18],
      ["产品代码", item.productCode || item.code, 16],
      ["策略", item.strategy, 10],
      ["子策略", item.subStrategy, 10],
      ["申购日", item.subscriptionDay || item.openText || (item.openTexts || []).join(" "), 8]
    ];
    tokens.forEach(token => {
      const hit = fields.find(([, value]) => cleanText(value).toLowerCase().includes(token));
      if (hit) {
        score += hit[2];
        matched.push(`${hit[0]}含“${token}”`);
        return;
      }
      if (item.haystack.includes(token)) {
        score += 5;
        matched.push(`含“${token}”`);
      }
    });
    if (!matched.length) return null;
    if (relaxed) {
      matched.slice(0, 4).forEach(reason => reasons.push(reason));
    } else if (!reasons.length || matched.some(reason => reason.startsWith("管理人") || reason.startsWith("产品"))) {
      reasons.push(`匹配关键词：${matched.slice(0, 4).join("、")}`);
    }
    return score;
  }

  function passesHardFilters(item, query, reasons) {
    if (query.privateScope && !hasPrivateSource(item)) return false;
    if (query.standardSales !== null) {
      const sales = parseNumeric(item.standardSales);
      if (sales === null || Math.abs(sales - query.standardSales) > 0.0001) return false;
      reasons?.push(`标准销量 ${query.standardSales}`);
    }
    if (query.sharpe) {
      const sharpe = parseNumeric(item.sharpe);
      if (!compareNumber(sharpe, query.sharpe)) return false;
      reasons?.push(`成立Sharpe ${cleanText(item.sharpe, String(sharpe))}`);
    }
    if (query.maxDrawdown) {
      const drawdown = parseRatioLike(item.maxDrawdown);
      const condition = { ...query.maxDrawdown, value: parseRatioLike(query.maxDrawdown.value) };
      if (!compareNumber(drawdown, condition, Math.abs)) return false;
      reasons?.push(`成立最大回撤 ${cleanText(item.maxDrawdown, formatPercent(drawdown))}`);
    }
    if (query.openMonth) {
      if (!hasOpenMonth(item, query.openMonth)) return false;
      reasons?.push(`${query.openMonth}月开放/申购`);
    }
    if (query.openDates?.length) {
      const matchedDates = query.openDates.filter(date => hasOpenDate(item, date));
      if (!matchedDates.length) return false;
      reasons?.push(`开放/申购日 ${matchedDates.map(date => date.label).join("、")}`);
    }
    if (query.privatePool) {
      if (!item.isPrivatePool) return false;
      reasons?.push("私享持营池");
    }
    for (const metric of ["week", "month", "ytd"]) {
      const sign = query.metricSigns?.[metric];
      if (!matchesMetricSign(item, metric, sign)) return false;
      addMetricSignReason(item, metric, sign, reasons);
    }
    if (!addRequestedFieldReasons(item, query, reasons)) return false;
    return true;
  }

  function scoreItem(item, query) {
    let score = 0;
    const reasons = [];
    if (!passesHardFilters(item, query, reasons)) return null;
    if (query.codeTokens.length) {
      const code = cleanText(item.productCode || item.code).toLowerCase();
      if (!query.codeTokens.some(token => code.includes(token))) return null;
      score += 30;
      reasons.push(`产品代码 ${cleanText(item.productCode || item.code)}`);
    }
    if (query.strategyIntent) {
      if (!matchesStrategyIntent(item, query.strategyIntent)) return null;
      score += 14;
      reasons.push(`策略：${query.strategyIntent}`);
    }
    if (query.weekMin !== null) {
      if (!(typeof item.weekRaw === "number" && item.weekRaw >= query.weekMin)) return null;
      score += 20 + item.weekRaw * 100;
      reasons.push(`近一周 ${formatPercent(item.weekRaw, item.weekReturn)}`);
    }
    if (query.monthMin !== null) {
      if (!(typeof item.monthRaw === "number" && item.monthRaw >= query.monthMin)) return null;
      score += 18 + item.monthRaw * 60;
      reasons.push(`近一月 ${formatPercent(item.monthRaw, item.monthReturn)}`);
    }
    if (query.ytdMin !== null) {
      if (!(typeof item.ytdRaw === "number" && item.ytdRaw >= query.ytdMin)) return null;
      score += 18 + item.ytdRaw * 40;
      reasons.push(`今年以来 ${formatPercent(item.ytdRaw, item.ytdReturn)}`);
    }
    if (query.openMonth) score += 9;
    if (query.openDates?.length) score += 18;
    if (query.privatePool) score += 12;
    if (query.standardSales !== null) score += 12;
    if (query.sharpe) score += 12;
    if (query.maxDrawdown) score += 12;
    Object.values(query.metricSigns || {}).forEach(sign => {
      if (sign) score += 10;
    });
    const tokenScore = tokenMatchScore(item, query.tokens, reasons);
    if (tokenScore === null) return null;
    score += tokenScore;
    if (query.requestedFields?.length) score += query.requestedFields.length * 6;
    if (query.rankFirst && typeof item.weekRaw === "number") {
      score += 8 + item.weekRaw * 120;
      if (!reasons.some(reason => reason.startsWith("近一周"))) reasons.push(`近一周 ${formatPercent(item.weekRaw, item.weekReturn)}`);
    }
    if (!reasons.length && query.tokens.length) {
      const matched = query.tokens.filter(token => item.haystack.includes(token));
      if (!matched.length) return null;
      reasons.push(`匹配关键词：${matched.slice(0, 3).join("、")}`);
    }
    if (!reasons.length && !query.raw) return null;
    return { ...item, score, reasons };
  }

  function relaxedScoreItem(item, query) {
    let score = 0;
    const reasons = [];
    if (!passesHardFilters(item, query, reasons)) return null;
    if (query.codeTokens.length) {
      const code = cleanText(item.productCode || item.code).toLowerCase();
      if (!query.codeTokens.some(token => code.includes(token))) return null;
      score += 30;
      reasons.push(`产品代码 ${cleanText(item.productCode || item.code)}`);
    }
    if (query.strategyIntent) {
      if (!matchesStrategyIntent(item, query.strategyIntent)) return null;
      score += 14;
      reasons.push(`策略：${query.strategyIntent}`);
    }
    if (query.weekMin !== null && typeof item.weekRaw === "number" && item.weekRaw >= query.weekMin) {
      score += 20 + item.weekRaw * 100;
      reasons.push(`近一周 ${formatPercent(item.weekRaw, item.weekReturn)}`);
    }
    if (query.monthMin !== null && typeof item.monthRaw === "number" && item.monthRaw >= query.monthMin) {
      score += 18 + item.monthRaw * 60;
      reasons.push(`近一月 ${formatPercent(item.monthRaw, item.monthReturn)}`);
    }
    if (query.ytdMin !== null && typeof item.ytdRaw === "number" && item.ytdRaw >= query.ytdMin) {
      score += 18 + item.ytdRaw * 40;
      reasons.push(`今年以来 ${formatPercent(item.ytdRaw, item.ytdReturn)}`);
    }
    if (query.openMonth) score += 9;
    if (query.openDates?.length) score += 18;
    if (query.privatePool) score += 12;
    if (query.standardSales !== null) score += 12;
    if (query.sharpe) score += 12;
    if (query.maxDrawdown) score += 12;
    Object.values(query.metricSigns || {}).forEach(sign => {
      if (sign) score += 10;
    });
    const tokenScore = tokenMatchScore(item, query.tokens, reasons, { relaxed: true });
    if (tokenScore === null) return null;
    score += tokenScore;
    if (query.requestedFields?.length) score += query.requestedFields.length * 6;
    if (query.rankFirst && typeof item.weekRaw === "number") {
      score += 8 + item.weekRaw * 120;
      if (reasons.length < 4) reasons.push(`近一周 ${formatPercent(item.weekRaw, item.weekReturn)}`);
    }
    if (score <= 0) return null;
    return { ...item, score, reasons: [`相近匹配：${reasons.join("；")}`], relaxed: true };
  }

  function metricRaw(item, metric) {
    if (metric === "sharpe") return parseNumeric(item.sharpe);
    if (metric === "maxDrawdown") return parseRatioLike(item.maxDrawdown);
    if (metric === "ytd") return item.ytdRaw;
    if (metric === "month") return item.monthRaw;
    return item.weekRaw;
  }

  function metricLabel(metric) {
    if (metric === "sharpe") return "成立Sharpe";
    if (metric === "maxDrawdown") return "成立最大回撤";
    if (metric === "ytd") return "今年以来";
    if (metric === "month") return "近一月";
    return "近一周";
  }

  function metricReturn(item, metric) {
    if (metric === "sharpe") return item.sharpe;
    if (metric === "maxDrawdown") return item.maxDrawdown;
    if (metric === "ytd") return item.ytdReturn;
    if (metric === "month") return item.monthReturn;
    return item.weekReturn;
  }

  function canonicalStrategyGroup(value) {
    const text = cleanText(value);
    if (/量化股票多头|量化多头/.test(text)) return "量化股票多头策略";
    if (/cta/i.test(text)) return "CTA策略";
    return text;
  }

  function groupTopResults(items, query) {
    const metric = query.sortMetric || "ytd";
    const groupMap = new Map();
    items.forEach(item => {
      const reasons = [];
      if (!passesHardFilters(item, query, reasons)) return;
      if (query.strategyIntent && !matchesStrategyIntent(item, query.strategyIntent)) return;
      const raw = metricRaw(item, metric);
      if (typeof raw !== "number" || !Number.isFinite(raw)) return;
      const group = canonicalStrategyGroup(item.strategy || item.subStrategy || "未分类");
      if (!group || group === "未分类") return;
      if (!groupMap.has(group)) groupMap.set(group, []);
      groupMap.get(group).push({
        ...item,
        groupName: group,
        score: raw,
        reasons: [...reasons, `${group} 各选${query.groupTop}个`, `${metricLabel(metric)} ${formatPercent(raw, metricReturn(item, metric))}`]
      });
    });
    return Array.from(groupMap.entries())
      .flatMap(([, rows]) => rows
        .sort((a, b) => metricRaw(b, metric) - metricRaw(a, metric))
        .slice(0, query.groupTop))
      .sort((a, b) => a.groupName.localeCompare(b.groupName, "zh-Hans-CN") || metricRaw(b, metric) - metricRaw(a, metric))
      .slice(0, 60);
  }

  function compareSearchResults(a, b, query) {
    const metric = query.sortMetric || (query.topLimit ? "week" : "");
    if (metric) {
      const aValue = metricRaw(a, metric);
      const bValue = metricRaw(b, metric);
      const aOk = typeof aValue === "number" && Number.isFinite(aValue);
      const bOk = typeof bValue === "number" && Number.isFinite(bValue);
      if (aOk && bOk && bValue !== aValue) return bValue - aValue;
      if (aOk !== bOk) return aOk ? -1 : 1;
    }
    return b.score - a.score || (b.weekRaw || -Infinity) - (a.weekRaw || -Infinity);
  }

  function searchProducts(queryText) {
    const query = parseQuery(queryText);
    const items = buildSearchIndex();
    if (query.groupTop) return groupTopResults(items, query);
    const limit = query.topLimit || 40;
    const strict = items
      .map(item => scoreItem(item, query))
      .filter(Boolean)
      .sort((a, b) => compareSearchResults(a, b, query))
      .slice(0, limit);
    if (strict.length) return strict;
    return items
      .map(item => relaxedScoreItem(item, query))
      .filter(Boolean)
      .sort((a, b) => compareSearchResults(a, b, query))
      .slice(0, limit);
  }

  function escapeHtml(value) {
    return cleanText(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function valueClass(raw) {
    if (typeof raw !== "number") return "";
    return raw >= 0 ? "gain" : "loss";
  }

  function metricTag(item, metric) {
    const raw = metricRaw(item, metric);
    const value = metricReturn(item, metric);
    if (!cleanText(value) || value === "--") return "";
    const cls = metric === "sharpe" ? "" : valueClass(raw);
    const label = metricLabel(metric);
    const shown = metric === "sharpe" ? cleanText(value) : formatPercent(raw, value);
    return `<span class="${cls}">${escapeHtml(label)} ${escapeHtml(shown)}</span>`;
  }

  function resultTags(item, query) {
    const tags = [];
    if (item.manager) tags.push(`<span>${escapeHtml(item.manager)}</span>`);
    if (item.strategy) tags.push(`<span>${escapeHtml(item.strategy)}</span>`);
    if (query.standardSales !== null && item.standardSales) tags.push(`<span>标准销量 ${escapeHtml(item.standardSales)}</span>`);
    if (query.openMonth) tags.push(`<span>${query.openMonth}月开放/申购</span>`);
    if (query.openDates?.length) tags.push(`<span>${escapeHtml(query.openDates.map(date => date.label).join("、"))}开放/申购</span>`);
    (query.displayMetrics || []).forEach(metric => {
      const tag = metricTag(item, metric);
      if (tag) tags.push(tag);
    });
    (query.requestedFields || []).forEach(key => {
      if (key === "manager" || key === "privatePool") return;
      const value = trackingFieldValue(item, key);
      if (value && value !== "-" && value !== "--") tags.push(`<span>${escapeHtml(trackingFieldLabel(key))} ${escapeHtml(value)}</span>`);
    });
    if (item.isPrivatePool) tags.push(`<span>私享持营池</span>`);
    return tags.join("");
  }

  function renderResults(container, queryText) {
    const query = parseQuery(queryText);
    const results = searchProducts(queryText);
    if (!results.length) {
      container.innerHTML = `<div class="product-ai-empty">没有找到符合条件的产品。可以放宽收益阈值，或只输入产品/管理人/策略关键词。</div>`;
      return;
    }
    const relaxed = results.some(item => item.relaxed);
    container.innerHTML = `
      <p class="product-ai-summary">${relaxed ? "未找到全部满足条件的产品，以下为相近匹配" : `找到 ${results.length} 个匹配产品`}，点击结果可切到相关模块。</p>
      ${results.map((item, index) => `
        <button class="product-ai-card" type="button" data-ai-result="${index}">
          <div class="product-ai-card-head">
            <div class="product-ai-name">${escapeHtml(item.productName || item.name)}</div>
            <div class="product-ai-code">${escapeHtml(item.productCode || item.code || "")}</div>
          </div>
          <div class="product-ai-meta">
            ${resultTags(item, query)}
          </div>
          <div class="product-ai-reason">${escapeHtml(item.reasons.join("；"))} · ${escapeHtml((item.sourceLabels || []).join(" / "))}</div>
        </button>
      `).join("")}
    `;
    container.querySelectorAll("[data-ai-result]").forEach(button => {
      button.addEventListener("click", () => openResult(results[Number(button.dataset.aiResult)]));
    });
  }

  function openResult(item) {
    const sources = item.sourceLabels || [];
    const isLaunch = item.type === "launch" || item.typeLabel === "首发" || item.typeLabel === "首发产品";
    if (isLaunch && sources.includes("私募日历")) {
      document.querySelector('[data-calendar-entry="private"]')?.click();
      return;
    }
    if (sources.includes("私募数据跟踪")) {
      document.querySelector('[data-module="tracking"]')?.click();
      focusTrackingProduct(item);
      return;
    }
    if (sources.includes("私募日历")) {
      document.querySelector('[data-calendar-entry="private"]')?.click();
      return;
    }
    if (sources.includes("公募日历")) {
      document.querySelector('[data-calendar-entry="public"]')?.click();
      return;
    }
    if (sources.includes("产品销售")) {
      document.querySelector('[data-sales-entry="products"]')?.click();
    }
  }

  function focusTrackingProduct(item) {
    const frame = document.getElementById("trackingFrame");
    if (!frame) return;
    const message = {
      type: "focus-tracking-product",
      code: cleanText(item.productCode || item.code),
      name: cleanText(item.productName || item.name)
    };
    const post = () => frame.contentWindow?.postMessage(message, "*");
    window.setTimeout(post, 160);
    window.setTimeout(post, 520);
    window.setTimeout(post, 1000);
  }

  function createAssistant() {
    if (document.getElementById("productAiButton")) return;
    injectStyle();
    const button = document.createElement("button");
    button.className = "product-ai-button";
    button.id = "productAiButton";
    button.type = "button";
    button.title = "产品搜索助手";
    button.innerHTML = `<img src="${MASCOT_IDLE_SRC}" alt="产品搜索助手">`;

    const panel = document.createElement("section");
    panel.className = "product-ai-panel";
    panel.id = "productAiPanel";
    panel.hidden = true;
    panel.setAttribute("aria-label", "产品搜索助手");
    panel.innerHTML = `
      <div class="product-ai-head">
        <div class="product-ai-mini"><img src="${MASCOT_WORKING_SRC}" alt=""></div>
        <div class="product-ai-title">
          <strong>产品搜索助手</strong>
          <span>跨私募数据跟踪、日历、销售数据做本地匹配</span>
        </div>
        <button class="product-ai-close" type="button" aria-label="关闭">×</button>
      </div>
      <div class="product-ai-query">
        <p class="product-ai-hint">${DEFAULT_PROMPT}</p>
        <div class="product-ai-input-row">
          <textarea class="product-ai-input" id="productAiInput" rows="3" placeholder="${DEFAULT_PROMPT.replace("你可以说：", "")}"></textarea>
          <button class="product-ai-search" type="button">搜索</button>
        </div>
      </div>
      <div class="product-ai-results" id="productAiResults">
        <div class="product-ai-empty">输入条件后开始搜索。支持收益阈值、开放月份、私享持营池、产品名、管理人和策略关键词。</div>
      </div>
    `;

    document.body.append(button, panel);
    const input = panel.querySelector(".product-ai-input");
    const results = panel.querySelector(".product-ai-results");
    const buttonImg = button.querySelector("img");
    const setMascotState = state => {
      if (state === "working") {
        buttonImg.src = MASCOT_WORKING_SRC;
      } else if (state === "awake") {
        buttonImg.src = MASCOT_AWAKE_SRC;
      } else {
        buttonImg.src = MASCOT_IDLE_SRC;
      }
    };
    const runSearch = () => renderResults(results, input.value);

    button.addEventListener("mouseenter", () => {
      if (panel.hidden) setMascotState("awake");
    });
    button.addEventListener("mouseleave", () => {
      setMascotState(panel.hidden ? "idle" : "working");
    });
    button.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      button.classList.toggle("is-active", !panel.hidden);
      setMascotState(panel.hidden ? (button.matches(":hover") ? "awake" : "idle") : "working");
      if (!panel.hidden) {
        window.setTimeout(() => input.focus(), 80);
      }
    });
    panel.querySelector(".product-ai-close").addEventListener("click", () => {
      panel.hidden = true;
      button.classList.remove("is-active");
      setMascotState(button.matches(":hover") ? "awake" : "idle");
    });
    panel.querySelector(".product-ai-search").addEventListener("click", runSearch);
    input.addEventListener("keydown", event => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) runSearch();
      if (event.key === "Escape") {
        panel.hidden = true;
        button.classList.remove("is-active");
        setMascotState(button.matches(":hover") ? "awake" : "idle");
      }
    });
  }

  window.ProductAssistant = { version: ASSISTANT_VERSION, searchProducts, buildSearchIndex };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createAssistant);
  } else {
    createAssistant();
  }
})();
