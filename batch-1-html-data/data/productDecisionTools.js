(function(){
  const STYLE_ID = 'productDecisionToolsStyle';
  const DEFAULT_FACTOR = 1;
  let coefficientCache = null;

  function injectStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .decision-tool-btn{height:36px;border:1px solid #cfd8e8;background:#fff;color:#26395f;border-radius:7px;padding:0 12px;font:inherit;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:7px;white-space:nowrap}
      .decision-tool-btn:hover{background:#eef3ff;border-color:#b8c7ff}
      .decision-tool-btn.primary{background:#24385f;color:#fff;border-color:#24385f}
      .decision-drawer-mask{position:fixed;inset:0;background:rgba(16,24,40,.22);z-index:2600;display:flex;justify-content:flex-end}
      .decision-drawer-mask[hidden]{display:none}
      .decision-drawer{width:min(1120px,96vw);height:100%;background:#fff;box-shadow:-18px 0 60px rgba(16,24,40,.22);display:flex;flex-direction:column}
      .decision-head{height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 18px;border-bottom:1px solid #e8edf5;background:#fbfcff}
      .decision-head strong{font-size:17px}
      .decision-close{width:34px;height:34px;border:1px solid #cfd8e8;border-radius:50%;background:#fff;color:#26395f;font-size:22px;line-height:1;cursor:pointer}
      .decision-body{padding:18px;overflow:auto;display:grid;gap:14px}
      .decision-query{display:grid;grid-template-columns:repeat(4,minmax(0,1fr)) auto;gap:10px;align-items:end}
      .decision-field label{display:block;color:#6d7788;font-size:12px;font-weight:800;margin-bottom:6px}
      .decision-input,.decision-select{width:100%;height:38px;border:1px solid #d7e0f0;border-radius:7px;background:#fff;padding:0 10px;font:inherit;outline:none}
      .decision-input:focus,.decision-select:focus{border-color:#7e95ef;box-shadow:0 0 0 3px rgba(66,104,214,.12)}
      .decision-card{border:1px solid #e3e9f4;border-radius:8px;background:#fff;overflow:hidden}
      .decision-card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;border-bottom:1px solid #edf1f7;background:#fbfcff}
      .decision-card-head h3{margin:0;font-size:15px}
      .decision-card-body{padding:14px 15px}
      .decision-grid{display:grid;grid-template-columns:150px repeat(var(--compare-cols,2),minmax(150px,1fr));border:1px solid #e6ebf4;border-radius:8px;overflow:auto}
      .decision-grid div{padding:10px 12px;border-bottom:1px solid #edf1f7;min-width:0}
      .decision-grid .dimension-cell{background:#f8faff;color:#536176;font-weight:800}
      .decision-grid .grid-head{background:#fff;color:#1f2a3d;font-weight:800}
      .decision-grid strong{display:block;overflow-wrap:anywhere}
      .decision-win{display:inline-flex;align-items:center;gap:5px;margin-top:6px;border-radius:999px;padding:3px 8px;background:#fff6d8;color:#8a6505;font-size:12px;font-weight:850}
      .decision-summary{display:grid;gap:8px;margin:0;padding:0;list-style:none}
      .decision-summary li{padding:10px 12px;border:1px solid #e6ebf4;border-radius:8px;background:#fbfcff;color:#41506a}
      .decision-muted{color:#6d7788;font-size:12px;line-height:1.55}
      .decision-empty{padding:20px;border:1px dashed #cfd8e8;border-radius:8px;text-align:center;color:#6d7788;background:#fbfcff}
      .sales-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
      .sales-action-grid.with-employee{grid-template-columns:minmax(0,1.08fr) minmax(360px,.92fr)}
      .sales-action-stack{display:grid;gap:14px;min-width:0}
      .sales-action-full{padding-top:0!important}
      .sales-action-panel{border:1px solid var(--line,#e6ecf5);border-radius:8px;background:#fff;box-shadow:var(--shadow,0 10px 24px rgba(28,41,70,.08));overflow:hidden}
      .sales-action-panel h3{margin:0;padding:13px 15px;border-bottom:1px solid var(--line,#e6ecf5);font-size:15px;background:#fbfcff}
      .sales-action-body{padding:14px 15px;display:grid;gap:10px}
      .sales-action-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .sales-result{display:grid;gap:8px;padding:12px;border:1px solid #e6ebf4;border-radius:8px;background:#fbfcff}
      .sales-result strong{font-size:20px;color:#1f2a3d}
      .sales-result span{color:#536176}
      .employee-calc-layout{display:grid;grid-template-columns:minmax(0,1fr) 178px;gap:12px;align-items:start}
      .employee-calc-table-wrap{overflow:auto;border:1px solid #e6ebf4;border-radius:8px}
      .employee-calc-table{min-width:860px;width:100%;border-collapse:collapse;font-size:12px}
      .employee-calc-table th{background:#f4f7fc;color:#536176}
      .employee-calc-table th,.employee-calc-table td{padding:8px;border-bottom:1px solid #edf1f7;text-align:center;white-space:nowrap}
      .employee-calc-table td:first-child,.employee-calc-table th:first-child{text-align:left}
      .employee-calc-table input{width:100%;height:30px;border:1px solid #d7e0f0;border-radius:6px;padding:0 8px;font:inherit}
      .employee-lift-card{border:1px solid #e6ebf4;border-radius:8px;background:#fbfcff;padding:12px;display:grid;gap:8px;position:sticky;top:8px}
      .employee-lift-card strong{font-size:24px;line-height:1.1}
      .candidate-list{display:grid;gap:8px}
      .candidate-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid #e6ebf4;border-radius:8px;padding:9px 10px;background:#fff}
      .candidate-item b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      @media(max-width:900px){.decision-query,.sales-action-grid,.sales-action-grid.with-employee,.sales-action-row,.employee-calc-layout{grid-template-columns:1fr}.decision-grid{grid-template-columns:118px repeat(var(--compare-cols,2),minmax(150px,1fr))}.employee-lift-card{position:static}}
    `;
    document.head.appendChild(style);
  }

  function text(value, fallback='-'){
    if(value === undefined || value === null || value === '') return fallback;
    return String(value);
  }

  function numberFrom(value){
    const n = Number(String(value || '').replace(/[^\d.-]/g,''));
    return Number.isFinite(n) ? n : null;
  }

  function rateFrom(value){
    if(typeof value === 'number') return value;
    const raw = String(value || '').replace('%','');
    const n = Number(raw);
    return Number.isFinite(n) ? n / 100 : null;
  }

  function factorFrom(value){
    const n = numberFrom(value);
    return n && n > 0 ? n : DEFAULT_FACTOR;
  }

  function isLaunchProduct(item){
    return String(item && item.section || '').includes('首发') || String(item && item.raw && item.raw.type || '').includes('launch');
  }

  function isPrivateLike(item){
    return ['private', 'privateTracking'].includes(item && item.category) || ['private', 'privateTracking'].includes(item && item.source);
  }

  function isKeyPrivateLaunch(item){
    const joined = [item?.name, item?.strategy, item?.subStrategy, item?.section, item?.policy, item?.raw?.level, item?.raw?.tag].join(' ');
    return isPrivateLike(item) && isLaunchProduct(item) && /重点|兴泰|九坤|理成|才誉/.test(joined);
  }

  function splitCodes(code){
    return String(code || '').split(/[\/,，、\s]+/).map(item => item.trim()).filter(Boolean);
  }

  function compactText(value){
    return String(value || '').replace(/\s+/g,'').toLowerCase();
  }

  function hasValue(value){
    const s = String(value === undefined || value === null ? '' : value).trim();
    return !!s && s !== '-' && s !== '--' && s !== '---' && s !== '/' && s.toLowerCase() !== 'nan';
  }

  function coefficientMaps(){
    if(coefficientCache) return coefficientCache;
    const data = window.productCoefficientData || {};
    const rows = data.rows || Object.entries(data.byCode || {}).map(([code, value]) => ({code, ...value}));
    const byCode = new Map();
    const byName = new Map();
    rows.forEach(row => {
      splitCodes(row.code).concat(row.code ? [row.code] : []).filter(Boolean).forEach(code => byCode.set(String(code).toLowerCase(), row));
      if(row.name) byName.set(compactText(row.name), row);
    });
    coefficientCache = {rows, byCode, byName};
    return coefficientCache;
  }

  function findCoefficient(item){
    const {byCode, byName} = coefficientMaps();
    const codes = splitCodes(item.code);
    for(const code of codes){
      const hit = byCode.get(String(code).toLowerCase());
      if(hit) return hit;
    }
    const itemName = compactText(item.name);
    if(!itemName) return null;
    return byName.get(itemName) || null;
  }

  function coefficientOnlyProduct(query){
    const q = String(query || '').trim();
    if(!q) return null;
    const {byCode, byName} = coefficientMaps();
    const row = byCode.get(q.toLowerCase()) || byName.get(compactText(q));
    if(!row) return null;
    return {
      source: 'coefficient',
      category: 'coefficient',
      section: '系数表',
      name: row.name || q,
      code: row.code || q,
      manager: '',
      strategy: '系数表产品',
      subStrategy: '',
      participation: '',
      minAmount: '',
      raisePeriod: '',
      openText: '',
      lockup: '',
      salesCoef: row.salesCoef,
      holdingCoef: row.holdingCoef,
      policy: '',
      weekReturn: '',
      monthReturn: '',
      ytdReturn: '',
      oneYear: '',
      maxDrawdown: '',
      raw: row
    };
  }

  function enrichWithCoefficient(item){
    const coef = findCoefficient(item);
    if(!coef && isKeyPrivateLaunch(item)){
      return {
        ...item,
        salesCoef: hasValue(item.salesCoef) ? item.salesCoef : 4,
        holdingCoef: hasValue(item.holdingCoef) ? item.holdingCoef : 3.5,
        coefficientFallback: '首发重点级私募兜底'
      };
    }
    if(!coef) return item;
    return {
      ...item,
      coefficient: coef,
      salesCoef: hasValue(coef.salesCoef) ? coef.salesCoef : item.salesCoef,
      holdingCoef: hasValue(coef.holdingCoef) ? coef.holdingCoef : item.holdingCoef,
      investmentCategory: [coef.investmentCategory2, coef.investmentCategory3, coef.investmentCategory4].filter(hasValue).join(' / '),
      businessCategory: [coef.primaryCategory, coef.secondaryCategory].filter(hasValue).join(' / ')
    };
  }

  function extractMinAmount(...values){
    const joined = values.map(value => String(value || '')).join('，');
    const match = joined.match(/(\d+(?:\.\d+)?)\s*万\s*起投/);
    return match ? `${match[1]}万起投` : '';
  }

  function extractParticipation(...values){
    const joined = values.map(value => String(value || '')).join('，');
    const fragments = [];
    if(joined.includes('白名单')) fragments.push(joined.includes('机构') ? '机构客户白名单参与' : '白名单参与');
    if(joined.includes('无需白名单')) fragments.push('无需白名单');
    if(joined.includes('额度')) fragments.push(joined.match(/[^。；;，,]*额度[^。；;，,]*/)?.[0] || '额度以通知为准');
    const min = extractMinAmount(joined);
    if(min) fragments.push(min);
    return Array.from(new Set(fragments)).join('，');
  }

  function upsert(map, item){
    const keys = [item.code, ...splitCodes(item.code), item.name].filter(Boolean);
    keys.forEach(key => {
      const normalized = String(key).toLowerCase();
      if(!map.has(normalized)) map.set(normalized, item);
    });
  }

  function normalizeCalendarEvent(event, source){
    const participation = event.participation || extractParticipation(event.openText, event.lockup, event.subStrategy, event.strategy);
    return {
      source,
      category: source,
      section: event.type === 'launch' ? '首发' : '持营',
      name: event.name,
      code: event.code || event.productCode || '',
      manager: event.manager || '-',
      strategy: event.strategy || event.category || '-',
      subStrategy: event.subStrategy || event.style || '',
      participation,
      minAmount: event.minAmount || extractMinAmount(event.openText, event.lockup, event.subStrategy),
      raisePeriod: event.raisePeriod || event.period || '',
      openText: event.openText || event.subscriptionDay || '',
      lockup: event.lockup || '',
      salesCoef: event.salesCoef || event.factor || '',
      holdingCoef: event.holdingCoef || '',
      policy: event.policy || event.incomePolicy || '',
      weekReturn: event.week || event.weekReturn || '-',
      monthReturn: event.monthReturn || '-',
      ytdReturn: event.ytd || event.ytdReturn || '-',
      oneYear: event.oneYear || event.return2025 || '-',
      maxDrawdown: event.maxDrawdown || '-',
      raw: event
    };
  }

  function normalizePublicProduct(product, metrics){
    const m = metrics && metrics[product.name] ? metrics[product.name] : {};
    return {
      source: 'public',
      category: 'public',
      section: product.section || '公募',
      name: product.name,
      code: product.code || m.code || '',
      manager: product.custody || '-',
      strategy: product.category || '-',
      subStrategy: product.style || '',
      participation: product.participation || extractParticipation(product.period, product.policy, product.intro),
      minAmount: product.minAmount || extractMinAmount(product.period, product.policy, product.intro),
      raisePeriod: product.period || '',
      openText: product.openText || '',
      lockup: product.lockup || '',
      salesCoef: product.salesCoef || '',
      holdingCoef: product.holdingCoef || '',
      policy: product.policy || '',
      weekReturn: '-',
      monthReturn: m.oneMonth || '-',
      ytdReturn: m.ytd || '-',
      oneYear: m.oneYear || '-',
      maxDrawdown: '-',
      raw: product
    };
  }

  function normalizeTrackingRow(row){
    return {
      source: 'privateTracking',
      category: 'private',
      section: '持营',
      name: row.productName,
      code: row.productCode || '',
      manager: row.manager || '-',
      strategy: row.strategy || row.strategyName || '-',
      subStrategy: row.subStrategy || '',
      participation: row.participation || extractParticipation(row.subscriptionDay, row.lockup),
      minAmount: row.minAmount || extractMinAmount(row.subscriptionDay, row.lockup),
      raisePeriod: row.raisePeriod || '',
      openText: row.subscriptionDay || '',
      lockup: row.lockup || '-',
      salesCoef: row.salesCoef || '',
      holdingCoef: row.holdingCoef || '',
      policy: row.policy || '',
      weekReturn: row.weekReturn || '-',
      monthReturn: row.monthReturn || '-',
      ytdReturn: row.ytdReturn || '-',
      oneYear: row.return2025 || row.oneYear || '-',
      maxDrawdown: row.maxDrawdown || '-',
      raw: row
    };
  }

  function collectProducts(scope){
    const items = [];
    const calendar = window.productCalendarData || {};
    if(calendar.private && Array.isArray(calendar.private.EVENTS)){
      calendar.private.EVENTS.forEach(event => items.push(normalizeCalendarEvent(event, 'private')));
    }
    if(calendar.fixed){
      (calendar.fixed.EVENTS || []).forEach(event => items.push(normalizeCalendarEvent(event, 'fixed')));
      (calendar.fixed.POOL_PRODUCTS || []).forEach(product => items.push(normalizeCalendarEvent(product, 'fixed')));
    }
    if(calendar.public && Array.isArray(calendar.public.PRODUCTS)){
      calendar.public.PRODUCTS.forEach(product => items.push(normalizePublicProduct(product, calendar.public.METRICS_BY_NAME || {})));
    }
    const tracking = window.productReportData && window.productReportData.privateTracking;
    if(tracking && Array.isArray(tracking.strategies)){
      tracking.strategies.forEach(strategy => {
        const groups = strategy.children && strategy.children.length ? strategy.children : [strategy];
        groups.forEach(group => (group.rows || []).forEach(row => items.push(normalizeTrackingRow({...row, strategy: group.title || strategy.title}))));
      });
    }
    const filtered = scope ? items.filter(item => item.category === scope || item.source === scope) : items;
    const map = new Map();
    filtered.map(enrichWithCoefficient).forEach(item => upsert(map, item));
    return { items: Array.from(new Set(map.values())), map };
  }

  function findProduct(query, map){
    const q = String(query || '').trim().toLowerCase();
    if(!q) return null;
    if(map.has(q)) return map.get(q);
    const found = Array.from(map.values()).find(item => {
      return [item.name, item.code, item.manager, item.strategy, item.subStrategy].join(' ').toLowerCase().includes(q);
    }) || null;
    return found || coefficientOnlyProduct(query);
  }

  function parseDateToken(token, fallbackYear){
    const raw = String(token || '').trim();
    const full = raw.match(/(20\d{2})[./-](\d{1,2})[./-](\d{1,2})/);
    if(full) return new Date(Number(full[1]), Number(full[2]) - 1, Number(full[3]));
    const short = raw.match(/(\d{1,2})[./-](\d{1,2})/);
    if(short) return new Date(fallbackYear, Number(short[1]) - 1, Number(short[2]));
    return null;
  }

  function inSalesWindow(item){
    const now = new Date();
    now.setHours(0,0,0,0);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const year = now.getFullYear();
    const rawMonth = Number(item?.raw?.month);
    const rawDay = Number(item?.raw?.day);
    if(rawMonth && rawDay){
      const eventDate = new Date(year, rawMonth - 1, rawDay);
      eventDate.setHours(0,0,0,0);
      return eventDate >= now && eventDate <= monthEnd;
    }
    const raw = [item?.raisePeriod, item?.openText, item?.raw?.date, item?.raw?.period].filter(Boolean).join(' ');
    const range = raw.match(/((?:20\d{2}[./-])?\d{1,2}[./-]\d{1,2})\s*[-至~—]\s*((?:20\d{2}[./-])?\d{1,2}[./-]\d{1,2})/);
    if(range){
      const start = parseDateToken(range[1], year);
      const end = parseDateToken(range[2], year);
      if(start && end){
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return end >= now && start <= monthEnd;
      }
    }
    const single = parseDateToken(raw, year);
    if(single){
      single.setHours(0,0,0,0);
      return single >= now && single <= monthEnd;
    }
    if(/每日|每个交易日|每周|周[一二三四五六日天]/.test(raw)) return true;
    return false;
  }

  function metricWinners(items, getter, mode='max'){
    const values = items.map(getter);
    const numeric = values.map(value => mode === 'duration' ? numberFrom(value) : rateFrom(value));
    const valid = numeric.map((value, index) => ({value, index})).filter(item => item.value !== null);
    if(valid.length < 2) return new Set();
    const target = mode === 'min' || mode === 'duration'
      ? Math.min(...valid.map(item => item.value))
      : Math.max(...valid.map(item => item.value));
    return new Set(valid.filter(item => item.value === target).map(item => item.index));
  }

  function factorWinners(items, key){
    const values = items.map(item => factorFrom(item[key]));
    if(values.filter(value => value > 0).length < 2) return new Set();
    const max = Math.max(...values);
    const min = Math.min(...values);
    if(max === min) return new Set();
    return new Set(values.map((value, index) => value === max ? index : -1).filter(index => index >= 0));
  }

  function row(label, getter, options={}){
    return {label, getter, winners: options.winners || new Set(), required: options.required || false};
  }

  function hasAny(items, getter){
    return items.some(item => hasValue(getter(item)));
  }

  function positioning(item){
    return `${text(item.section)} / ${text(item.strategy)}${hasValue(item.subStrategy) ? ' / ' + item.subStrategy : ''}`;
  }

  function scheduleText(item){
    const parts = [];
    if(hasValue(item.participation)) parts.push(item.participation);
    if(hasValue(item.minAmount) && !parts.join('').includes(item.minAmount)) parts.push(item.minAmount);
    return parts.join('，');
  }

  function comparisonRows(items){
    const base = [
      row('产品定位', positioning, {required:true}),
      row('管理人/发行方', item => item.manager, {required:true}),
      row('投发分类', item => item.investmentCategory || item.businessCategory),
      row('参与方式/门槛', scheduleText),
      row('募集期/档期', item => item.raisePeriod),
      row('开放/申赎安排', item => item.openText),
      row('封闭期/锁定期', item => item.lockup, {winners: metricWinners(items, item => item.lockup, 'duration')}),
      row('标准销量系数', item => hasValue(item.salesCoef) ? item.salesCoef : '按1倍测算', {winners: factorWinners(items, 'salesCoef'), required:true}),
      row('标准保有系数', item => hasValue(item.holdingCoef) ? item.holdingCoef : '待补充', {winners: factorWinners(items, 'holdingCoef'), required:true}),
      row('近一周', item => item.weekReturn, {winners: metricWinners(items, item => item.weekReturn, 'max')}),
      row('近一月', item => item.monthReturn, {winners: metricWinners(items, item => item.monthReturn, 'max')}),
      row('今年以来', item => item.ytdReturn, {winners: metricWinners(items, item => item.ytdReturn, 'max')}),
      row('近一年/2025年以来', item => item.oneYear, {winners: metricWinners(items, item => item.oneYear, 'max')}),
      row('最大回撤', item => item.maxDrawdown, {winners: metricWinners(items, item => item.maxDrawdown, 'max')}),
      row('销售/收入政策', item => item.policy)
    ];
    return base.filter(item => item.required || hasAny(items, item.getter));
  }

  function badge(winners, index){
    return winners && winners.has(index) ? '<span class="decision-win">优势</span>' : '';
  }

  function conclusion(items){
    const lines = [];
    const strategies = Array.from(new Set(items.map(item => text(item.strategy)).filter(hasValue)));
    if(strategies.length === 1){
      lines.push(`这 ${items.length} 只产品均属于 ${strategies[0]}，适合在同一策略货架内重点比较收益、回撤、开放安排和系数贡献。`);
    } else {
      lines.push(`本次包含 ${strategies.length} 类策略/产品定位，不宜只按收益排序；建议先按客户期限、风险偏好、额度与配置角色分组，再比较同组产品。`);
    }
    const salesWinners = Array.from(factorWinners(items, 'salesCoef')).map(index => items[index].name);
    if(salesWinners.length) lines.push(`从标准销量贡献看，${salesWinners.join('、')} 的销量系数更高，更适合用于标销冲刺测算。`);
    const holdingWinners = Array.from(factorWinners(items, 'holdingCoef')).map(index => items[index].name);
    if(holdingWinners.length) lines.push(`从标准保有贡献看，${holdingWinners.join('、')} 的保有系数更高，可用于持续保有考核场景。`);
    const lockWinners = Array.from(metricWinners(items, item => item.lockup, 'duration')).map(index => items[index].name);
    if(lockWinners.length) lines.push(`从流动性看，${lockWinners.join('、')} 的封闭/锁定期相对更短。`);
    const monthWinners = Array.from(metricWinners(items, item => item.monthReturn, 'max')).map(index => items[index].name);
    if(monthWinners.length) lines.push(`从近一月表现看，${monthWinners.join('、')} 当前更占优，但需结合策略波动和回撤解释。`);
    if(lines.length === 1) lines.push('当前已接入字段更多偏产品要素，建议补充封闭期、销售政策和业绩数据后再输出更细结论。');
    return lines;
  }

  function renderComparison(target, items){
    const selected = items.filter(Boolean).slice(0,4);
    if(selected.length < 2){
      target.innerHTML = '<div class="decision-empty">请至少输入 2 只、最多 4 只产品代码或名称后点击对比。</div>';
      return;
    }
    const rows = comparisonRows(selected);
    target.innerHTML = `
      <div class="decision-card">
        <div class="decision-card-head"><h3>${selected.map(item => text(item.name)).join(' vs ')}</h3><span class="decision-muted">优势标识按当前已接入字段自动生成</span></div>
        <div class="decision-card-body">
          <div class="decision-grid" style="--compare-cols:${selected.length}">
            <div class="dimension-cell">维度</div>${selected.map(item => `<div class="grid-head"><strong>${text(item.name)}</strong><span class="decision-muted">${text(item.code)}</span></div>`).join('')}
            ${rows.map(rowItem => `<div class="dimension-cell">${rowItem.label}</div>${selected.map((item,index) => `<div><strong>${text(rowItem.getter(item))}</strong>${badge(rowItem.winners,index)}</div>`).join('')}`).join('')}
          </div>
        </div>
      </div>
      <div class="decision-card">
        <div class="decision-card-head"><h3>角度化结论</h3><span class="decision-muted">用于内部销售辅助，不构成投资建议</span></div>
        <div class="decision-card-body"><ul class="decision-summary">${conclusion(selected).map(line => `<li>${line}</li>`).join('')}</ul></div>
      </div>
    `;
  }

  function mountProductCompare(options={}){
    injectStyle();
    const scope = options.scope || '';
    const {items, map} = collectProducts(scope);
    const mount = options.mount || document.querySelector('.toolbar') || document.querySelector('.section-head') || document.body;
    if(!mount || document.getElementById(options.id || 'productCompareDrawer')) return;
    const button = document.createElement('button');
    button.className = 'decision-tool-btn';
    button.type = 'button';
    button.innerHTML = '<span aria-hidden="true">⇄</span>对比';
    mount.appendChild(button);
    annotateCoefficientTables(scope);
    const drawer = document.createElement('div');
    drawer.className = 'decision-drawer-mask';
    drawer.id = options.id || 'productCompareDrawer';
    drawer.hidden = true;
    drawer.innerHTML = `
      <div class="decision-drawer" role="dialog" aria-modal="true">
        <div class="decision-head"><strong>${options.title || '产品对比'}</strong><button class="decision-close" type="button" aria-label="关闭">×</button></div>
        <div class="decision-body">
          <div class="decision-query">
            <div class="decision-field"><label>产品 A 代码/名称</label><input class="decision-input" data-compare-a list="compareProductsList" placeholder="例如 027592 或 进化论"></div>
            <div class="decision-field"><label>产品 B 代码/名称</label><input class="decision-input" data-compare-b list="compareProductsList" placeholder="例如 561633 或 衍复"></div>
            <div class="decision-field"><label>产品 C 代码/名称</label><input class="decision-input" data-compare-c list="compareProductsList" placeholder="可选"></div>
            <div class="decision-field"><label>产品 D 代码/名称</label><input class="decision-input" data-compare-d list="compareProductsList" placeholder="可选"></div>
            <button class="decision-tool-btn primary" type="button" data-run-compare>生成对比</button>
          </div>
          <datalist id="compareProductsList">${items.slice(0,800).map(item => `<option value="${text(item.code || item.name)}">${text(item.name)} ${text(item.strategy)}</option>`).join('')}</datalist>
          <div class="decision-muted">支持产品代码、名称、管理人模糊搜索。至少 2 只，最多 4 只；当前可搜索产品 ${items.length} 个。</div>
          <div data-compare-output><div class="decision-empty">点击“生成对比”后展示动态维度、销量/保有系数、优势标识和角度化结论。</div></div>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);
    button.addEventListener('click', () => { drawer.hidden = false; });
    drawer.querySelector('.decision-close').addEventListener('click', () => { drawer.hidden = true; });
    drawer.addEventListener('click', event => { if(event.target === drawer) drawer.hidden = true; });
    drawer.querySelector('[data-run-compare]').addEventListener('click', () => {
      const selected = ['a','b','c','d']
        .map(key => drawer.querySelector(`[data-compare-${key}]`).value)
        .filter(value => String(value || '').trim())
        .map(value => findProduct(value, map));
      renderComparison(drawer.querySelector('[data-compare-output]'), selected);
    });
  }

  function annotateCoefficientTables(scope=''){
    const getData = () => collectProducts(scope);
    function updateTable(table){
      if(table.closest('.decision-card')) return;
      const headerRow = table.querySelector('thead tr');
      if(!headerRow) return;
      const headers = Array.from(headerRow.children);
      const headerText = headers.map(th => th.textContent.trim());
      const productIndex = headerText.findIndex(label => /产品名称|产品|名称/.test(label));
      const codeIndex = headerText.findIndex(label => /代码/.test(label));
      if(productIndex < 0 && codeIndex < 0) return;
      let salesIndex = headerText.findIndex(label => /标准销量|销量系数/.test(label));
      let holdingIndex = headerText.findIndex(label => /标准保有|保有系数/.test(label));
      if(salesIndex >= 0 && headerRow.children[salesIndex].textContent !== '标准销量系数') headerRow.children[salesIndex].textContent = '标准销量系数';
      if(holdingIndex >= 0 && headerRow.children[holdingIndex].textContent !== '标准保有系数') headerRow.children[holdingIndex].textContent = '标准保有系数';
      if(salesIndex < 0){
        const th = document.createElement('th');
        th.textContent = '标准销量系数';
        headerRow.appendChild(th);
        salesIndex = headerRow.children.length - 1;
      }
      if(holdingIndex < 0){
        const th = document.createElement('th');
        th.textContent = '标准保有系数';
        headerRow.appendChild(th);
        holdingIndex = headerRow.children.length - 1;
      }
      const data = getData();
      table.querySelectorAll('tbody tr').forEach(tr => {
        const cells = Array.from(tr.children);
        const code = codeIndex >= 0 && cells[codeIndex] ? cells[codeIndex].textContent.trim() : '';
        const name = productIndex >= 0 && cells[productIndex] ? cells[productIndex].textContent.trim() : '';
        const product = findProduct(code, data.map) || findProduct(name, data.map);
        while(tr.children.length <= Math.max(salesIndex, holdingIndex)){
          const td = document.createElement('td');
          td.className = 'num';
          tr.appendChild(td);
        }
        if(product){
          const nextSales = hasValue(product.salesCoef) ? product.salesCoef : '1';
          const nextHolding = hasValue(product.holdingCoef) ? product.holdingCoef : '待补充';
          if(tr.children[salesIndex].textContent !== nextSales) tr.children[salesIndex].textContent = nextSales;
          if(tr.children[holdingIndex].textContent !== nextHolding) tr.children[holdingIndex].textContent = nextHolding;
        }
      });
    }
    let scheduled = false;
    function run(){
      scheduled = false;
      document.querySelectorAll('table.detail-table, table.data-table').forEach(updateTable);
    }
    function scheduleRun(){
      if(scheduled) return;
      scheduled = true;
      window.setTimeout(run, 120);
    }
    run();
    if(!document.body.dataset.coefficientObserver){
      document.body.dataset.coefficientObserver = '1';
      const observer = new MutationObserver(scheduleRun);
      observer.observe(document.body, {childList:true, subtree:true});
    }
  }

  function calcStandardAmount(amountWan, factor){
    return Number(amountWan || 0) * factorFrom(factor);
  }

  function candidateProducts(limit=5){
    const sorted = collectProducts('').items
      .filter(item => item.source !== 'coefficient')
      .filter(item => factorFrom(item.salesCoef) > 1 || item.section === '首发')
      .filter(inSalesWindow)
      .sort((a,b) => {
        const launchDiff = Number(isLaunchProduct(b)) - Number(isLaunchProduct(a));
        if(launchDiff) return launchDiff;
        const factorDiff = factorFrom(b.salesCoef) - factorFrom(a.salesCoef);
        if(factorDiff) return factorDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'zh-CN');
      });
    const publicItems = sorted.filter(item => item.category === 'public');
    const privateItems = sorted.filter(item => item.category !== 'public');
    const mixed = [];
    const publicQuota = Math.min(publicItems.length, Math.max(1, Math.ceil(limit / 3)));
    publicItems.slice(0, publicQuota).forEach(item => mixed.push(item));
    privateItems.forEach(item => {
      if(mixed.length < limit && !mixed.includes(item)) mixed.push(item);
    });
    publicItems.forEach(item => {
      if(mixed.length < limit && !mixed.includes(item)) mixed.push(item);
    });
    return mixed.slice(0, limit);
  }

  window.ProductDecisionTools = {
    injectStyle,
    collectProducts,
    findProduct,
    factorFrom,
    calcStandardAmount,
    candidateProducts,
    annotateCoefficientTables,
    mountProductCompare
  };
})();
