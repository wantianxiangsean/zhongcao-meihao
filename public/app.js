/* =========================================================
   种草美好 · 美食与远方
   纯前端 + 本地 Node 存储（data/data.json、data/images）
   ========================================================= */

/* ---------- 小工具 ---------- */
const $ = (sel, root = document) => root.querySelector(sel);

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function el(tag, attrs = {}, children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  if (children != null) {
    (Array.isArray(children) ? children : [children]).forEach((child) => {
      if (child == null) return;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    });
  }
  return node;
}

/* ---------- 图标 ---------- */
const ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevron: '<path d="M9 5.5l6.5 6.5L9 18.5"/>',
  check: '<path d="M4.5 12.5l5 5L19.5 6.5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M14.5 5.5l4 4"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4.8h6V7"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v5.5M14 11v5.5"/>',
  pin: '<path d="M12 21s6-5.1 6-10a6 6 0 10-12 0c0 4.9 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/>',
  tag: '<path d="M4 4h7l9 9-7 7-9-9V4z"/><circle cx="8.5" cy="8.5" r="1.3"/>',
  bowl: '<path d="M3.5 11.5h17a8.5 8.5 0 01-17 0z"/><path d="M8.5 11.5c0-4 1-5.5 1-5.5M13 11.5c0-4.8.8-7 .8-7M17 11.5c0-3 .8-4.2.8-4.2"/><path d="M3 20.5h18"/>',
  mountain: '<path d="M2.5 20l6.5-12 4.2 7.3 2-3.1 6.3 7.8z"/><path d="M7.6 10.4l1.4-2.4 1.5 2.6"/>',
  film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14M16 5v14"/><path d="M3 9.5h5M3 14.5h5M16 9.5h5M16 14.5h5"/>',
  bulb: '<path d="M9.5 18h5"/><path d="M10.5 21h3"/><path d="M12 3a6.2 6.2 0 00-3.6 11.3c.6.5 1 1.2 1 2v.7h5.2v-.7c0-.8.4-1.5 1-2A6.2 6.2 0 0012 3z"/>',
  person: '<circle cx="12" cy="8" r="3.6"/><path d="M5.5 20.5c0-3.7 2.9-6.2 6.5-6.2s6.5 2.5 6.5 6.2"/>',
  book: '<path d="M5 5.2A2.2 2.2 0 017.2 3H19v15.4H7.2A2.2 2.2 0 005 20.6z"/><path d="M5 20.6A2.2 2.2 0 017.2 18.4H19"/>',
  gift: '<path d="M4 9.5h16v3.2H4z"/><path d="M5.6 12.7v7.3h12.8v-7.3"/><path d="M12 9.5v10.5"/><path d="M12 9.5C12 6.7 10.7 4.4 8.7 4.4a2.05 2.05 0 000 5.1h3.3z"/><path d="M12 9.5c0-2.8 1.3-5.1 3.3-5.1a2.05 2.05 0 010 5.1H12z"/>',
  inbox: '<path d="M4 13.5l2-8.5h12l2 8.5v4A1.5 1.5 0 0118.5 19h-13A1.5 1.5 0 014 17.5v-4z"/><path d="M4 13.5h4.2l1 2h5.6l1-2H20"/>',
  image: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15.5l-5-5-7.5 7.5"/>',
  upload: '<path d="M12 16V4.5"/><path d="M7 9.5l5-5 5 5"/><path d="M5 20h14"/>',
  download: '<path d="M12 4.5V16"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  star: 'M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z',
};

function icon(name) {
  return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
}

/* ---------- 类型定义 ---------- */
const TYPES = {
  food: {
    label: '美食',
    icon: 'bowl',
    place: true,
    titleLabel: '名称',
    titlePlaceholder: '菜品或店铺名称',
    checkLabel: '打卡',
    checkDone: '已打卡',
    checkHint: '去过就勾上',
    dateLabel: '到访日期',
    fields: [
      { key: 'restaurant', label: '餐馆名称', ph: '如：巷口老王牛肉面', span: true },
      { key: 'price', label: '价位', ph: '如 ¥80/人' },
      { key: 'address', label: '地点 / 地址', ph: '街道、商场、楼层' },
      { key: 'mustOrder', label: '必点推荐', ph: '值得再点一次的菜', span: true },
      { key: 'notes', label: '备注', type: 'textarea', ph: '口味、排队、小贴士…', span: true },
    ],
    cardFields: ['restaurant', 'price'],
  },
  spot: {
    label: '美景',
    icon: 'mountain',
    place: true,
    titleLabel: '美景名称',
    titlePlaceholder: '地方、景区或路线名',
    checkLabel: '打卡',
    checkDone: '已打卡',
    checkHint: '去过就勾上',
    dateLabel: '到访日期',
    fields: [
      { key: 'spotAddress', label: '打卡地点', ph: '景区入口 / 观景台 / 具体位置', span: true },
      { key: 'story', label: '故事 / 印象', type: 'textarea', ph: '为什么值得来，当时发生了什么…', span: true },
      { key: 'stay', label: '住宿', ph: '住哪里、体验如何' },
      { key: 'food', label: '饮食', ph: '附近好吃的' },
      { key: 'fun', label: '好玩的', type: 'textarea', ph: '项目、路线、最佳时段…', span: true },
      { key: 'notes', label: '备注', type: 'textarea', ph: '交通、门票、提醒…', span: true },
    ],
    cardFields: ['spotAddress'],
  },
  media: {
    label: '好剧',
    icon: 'film',
    place: false,
    titleLabel: '片名 / 剧名',
    titlePlaceholder: '电视剧、纪录片、电影…',
    checkLabel: '看过',
    checkDone: '已看过',
    checkHint: '看完就勾上',
    dateLabel: '观看日期',
    fields: [
      { key: 'kind', label: '类型', type: 'select', options: ['电影', '电视剧', '纪录片', '综艺', '动画', '其他'] },
      { key: 'year', label: '年份', ph: '如 2024' },
      { key: 'where', label: '在哪看', ph: '平台 / 影院 / 资源', span: true },
      { key: 'story', label: '简介 / 印象', type: 'textarea', ph: '它讲了什么，为什么推荐…', span: true },
      { key: 'notes', label: '备注', type: 'textarea', ph: '想看的理由、想重看的段落…', span: true },
    ],
    cardFields: ['kind', 'year', 'where'],
  },
  topic: {
    label: '主题',
    icon: 'bulb',
    place: false,
    titleLabel: '主题',
    titlePlaceholder: '想研究、想弄明白的事',
    checkLabel: '完成',
    checkDone: '已完成',
    checkHint: '研究告一段落就勾上',
    dateLabel: '记录日期',
    fields: [
      { key: 'field', label: '所属领域', ph: '如：城市史、海洋生物' },
      { key: 'progress', label: '进度 / 状态', ph: '如：刚起步、资料收集中' },
      { key: 'why', label: '为什么想研究', type: 'textarea', ph: '好奇心从哪里来…', span: true },
      { key: 'sources', label: '资料 / 线索', type: 'textarea', ph: '书、论文、纪录片、网站…', span: true },
      { key: 'notes', label: '想法 / 备注', type: 'textarea', ph: '想弄明白的问题…', span: true },
    ],
    cardFields: ['field', 'progress'],
  },
  people: {
    label: '人物',
    icon: 'person',
    place: false,
    titleLabel: '人物名称',
    titlePlaceholder: '名字或称呼',
    checkLabel: '了解',
    checkDone: '已了解',
    checkHint: '了解过就勾上',
    dateLabel: '记录日期',
    fields: [
      { key: 'role', label: '身份 / 领域', ph: '如：作家、导演、运动员' },
      { key: 'relation', label: '如何知道', ph: '通过作品、朋友推荐…' },
      { key: 'works', label: '作品 / 事迹', type: 'textarea', ph: '代表作、印象深的事…', span: true },
      { key: 'why', label: '为什么想记住', type: 'textarea', ph: '哪一点打动了你…', span: true },
      { key: 'notes', label: '备注', type: 'textarea', ph: '想说的话、相关链接…', span: true },
    ],
    cardFields: ['role', 'relation'],
  },
  book: {
    label: '好书',
    icon: 'book',
    place: false,
    titleLabel: '书名',
    titlePlaceholder: '书名',
    checkLabel: '读完',
    checkDone: '已读完',
    checkHint: '读完就勾上',
    dateLabel: '阅读日期',
    fields: [
      { key: 'author', label: '作者 / 译者', ph: '如：余华 / 林少华' },
      { key: 'kind', label: '类型', ph: '手动填写，如：小说、非虚构、散文…' },
      { key: 'why', label: '种草来源', type: 'textarea', ph: '从哪里知道这本书…', span: true },
      { key: 'insights', label: '核心观点 · 我的理解', type: 'pairs' },
      { key: 'quote', label: '摘抄 / 印象', type: 'list', ph: '想记住的句子、读完的感受…' },
      { key: 'notes', label: '备注', type: 'textarea', ph: '想推荐给谁、版本提醒…', span: true },
      { key: 'summary', label: '一句话总结', ph: '用一句话总结这本书…', common: true },
    ],
    cardFields: ['author', 'kind'],
  },
  goods: {
    label: '好物',
    icon: 'gift',
    place: false,
    titleLabel: '物品名称',
    titlePlaceholder: '物品或品牌名称',
    checkLabel: '入手',
    checkDone: '已入手',
    checkHint: '入手了就勾上',
    dateLabel: '记录日期',
    fields: [
      { key: 'brand', label: '品牌 / 来源', ph: '品牌、店铺或朋友推荐' },
      { key: 'kind', label: '类别', ph: '手动填写，如：厨具、数码…' },
      { key: 'price', label: '价格', ph: '如 ¥199' },
      { key: 'why', label: '为什么推荐 / 使用感受', type: 'textarea', ph: '用起来怎么样、值不值得…', span: true },
      { key: 'notes', label: '备注', type: 'textarea', ph: '购买渠道、型号、替代品…', span: true },
    ],
    cardFields: ['brand', 'price'],
  },
};

const TYPE_ORDER = ['food', 'spot', 'media', 'book', 'goods', 'people', 'topic'];
const TYPE_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'food', label: '美食' },
  { value: 'spot', label: '美景' },
  { value: 'media', label: '好剧' },
  { value: 'book', label: '好书' },
  { value: 'goods', label: '好物' },
  { value: 'people', label: '人物' },
  { value: 'topic', label: '主题' },
];
const STATUS_FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待打卡' },
  { value: 'done', label: '已打卡' },
];

const REGIONS = [
  { id: 'cn', name: '中国' },
  { id: 'asia', name: '亚洲' },
  { id: 'europe', name: '欧洲' },
  { id: 'namerica', name: '北美洲' },
  { id: 'samerica', name: '南美洲' },
  { id: 'africa', name: '非洲' },
  { id: 'oceania', name: '大洋洲' },
];
const REGION_IDS = new Set(REGIONS.map((r) => r.id));
const UNPLACED = { id: 'unplaced', name: '无地点收藏', level: 'extra', parentId: null, fixed: true };

const STAR_PATH = ICON_PATHS.star;

/* ---------- 状态 ---------- */
const state = {
  data: { version: 1, entries: [], locations: [] },
  view: { nodeId: 'all', type: 'all', status: 'all', q: '' },
  open: new Set(),
};

/* ---------- GitHub 私有数据仓库 ---------- */
const GH_CONFIG_KEY = 'interests.github';
const GH_IMAGE_PREFIX = 'gh:';
const GH = { config: null, imageCache: new Map() };

function readGithubConfig() {
  try {
    const raw = localStorage.getItem(GH_CONFIG_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (!c || !c.owner || !c.repo || !c.token) return null;
    return {
      owner: String(c.owner),
      repo: String(c.repo),
      branch: c.branch || 'main',
      path: c.path || 'data/data.json',
      token: String(c.token),
    };
  } catch {
    return null;
  }
}

function writeGithubConfig(cfg) {
  if (cfg) localStorage.setItem(GH_CONFIG_KEY, JSON.stringify(cfg));
  else localStorage.removeItem(GH_CONFIG_KEY);
}

function isGithubMode() {
  return !!(GH.config && GH.config.owner && GH.config.repo && GH.config.token);
}

function isLocalHost() {
  const host = location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '';
}

function ghContentsUrl(path) {
  const encoded = String(path)
    .split('/')
    .filter(Boolean)
    .map(encodeURIComponent)
    .join('/');
  return `https://api.github.com/repos/${encodeURIComponent(GH.config.owner)}/${encodeURIComponent(
    GH.config.repo
  )}/contents/${encoded}`;
}

function ghHeaders(extra) {
  return {
    Authorization: `Bearer ${GH.config.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(extra || {}),
  };
}

async function ghRequest(url, options = {}) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    const err = new Error('网络连接失败，请稍后重试');
    err.network = true;
    throw err;
  }
  if (res.status === 401) {
    throw Object.assign(new Error('Token 无效或已过期，请重新填写'), { status: 401 });
  }
  if (res.status === 403) {
    const info = await res.clone().json().catch(() => null);
    const msg = (info && info.message) || '';
    const err = new Error(
      /rate limit/i.test(msg)
        ? 'GitHub API 触发限流，请稍后再试'
        : 'Token 权限不足：需要该私有仓库的 Contents 读写权限'
    );
    err.status = 403;
    throw err;
  }
  if (res.status === 404) return res;
  if (!res.ok) {
    const info = await res.json().catch(() => null);
    const err = new Error((info && info.message) || `GitHub 返回 ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res;
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(b64) {
  const bin = atob(String(b64).replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function base64ToUtf8(b64) {
  return new TextDecoder().decode(base64ToBytes(b64));
}

async function ghLoad() {
  const url = ghContentsUrl(GH.config.path) + `?ref=${encodeURIComponent(GH.config.branch)}`;
  const res = await ghRequest(url, { headers: ghHeaders() });
  if (res.status === 404) return null;
  const info = await res.json();
  if (info.content && info.encoding === 'base64') {
    const text = base64ToUtf8(info.content);
    return parseRemoteData(text);
  }
  const raw = await ghRequest(url, { headers: ghHeaders({ Accept: 'application/vnd.github.raw' }) });
  return parseRemoteData(await raw.text());
}

function parseRemoteData(text) {
  if (!text || !text.trim()) return { version: 1, entries: [], locations: [] };
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.entries) || !Array.isArray(data.locations)) {
    throw new Error('私有仓库里的数据文件格式不正确');
  }
  return data;
}

let ghWriteChain = Promise.resolve();

function ghSave(data) {
  const content = utf8ToBase64(JSON.stringify(data, null, 2));
  const count = data.entries.length;
  const task = ghWriteChain.catch(() => {}).then(() => ghSaveContent(content, count, 0));
  ghWriteChain = task;
  return task;
}

async function ghSaveContent(content, count, attempt) {
  const url = ghContentsUrl(GH.config.path);
  try {
    const meta = await ghRequest(url + `?ref=${encodeURIComponent(GH.config.branch)}`, {
      headers: ghHeaders(),
    });
    let sha = null;
    if (meta.status === 200) {
      const info = await meta.json();
      sha = info.sha;
    }
    await ghRequest(url, {
      method: 'PUT',
      headers: ghHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        message: `更新收藏 · ${count} 条`,
        content,
        branch: GH.config.branch,
        ...(sha ? { sha } : {}),
      }),
    });
  } catch (err) {
    const transient = err.network || err.status === 409 || (err.status && err.status >= 500);
    if (attempt < 1 && transient) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return ghSaveContent(content, count, attempt + 1);
    }
    throw err;
  }
}

function isGhImage(src) {
  return typeof src === 'string' && src.startsWith(GH_IMAGE_PREFIX);
}

async function ghImageUrl(path) {
  if (GH.imageCache.has(path)) return GH.imageCache.get(path);
  const promise = (async () => {
    const res = await ghRequest(
      ghContentsUrl(path) + `?ref=${encodeURIComponent(GH.config.branch)}`,
      { headers: ghHeaders() }
    );
    if (res.status === 404) throw new Error('图片不存在');
    const info = await res.json();
    if (!info.content || info.encoding !== 'base64') throw new Error('图片过大，无法读取');
    const ext = path.split('.').pop().toLowerCase();
    const mime =
      ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
    return URL.createObjectURL(new Blob([base64ToBytes(info.content)], { type: mime }));
  })();
  GH.imageCache.set(path, promise);
  promise.catch(() => GH.imageCache.delete(path));
  return promise;
}

function applyImage(img, src, onError) {
  if (!src) return;
  if (isGhImage(src)) {
    ghImageUrl(src.slice(GH_IMAGE_PREFIX.length))
      .then((url) => {
        img.src = url;
      })
      .catch((err) => {
        if (onError) onError(err);
        else img.remove();
      });
  } else {
    img.src = src;
  }
}

let treeEdit = null; // { mode:'add', parentId } | { mode:'rename', id }
let draft = null;
let searchTimer = null;
let toastTimer = null;

/* ---------- 数据访问 ---------- */
function getNode(id) {
  if (!id) return null;
  if (id === 'all') return { id: 'all', name: '全部收藏', level: 'root', parentId: null, fixed: true };
  if (id === 'unplaced') return UNPLACED;
  const region = REGIONS.find((r) => r.id === id);
  if (region) return { ...region, level: 'region', parentId: null, fixed: true };
  return state.data.locations.find((l) => l.id === id) || null;
}

function entryById(id) {
  return state.data.entries.find((e) => e.id === id) || null;
}

function childrenOf(parentId) {
  return state.data.locations
    .filter((l) => l.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
}

function childLevel(parentId) {
  if (parentId === 'cn') return 'province';
  if (REGION_IDS.has(parentId)) return 'country';
  const node = getNode(parentId);
  if (node && (node.level === 'province' || node.level === 'country')) return 'city';
  return null;
}

function levelName(level) {
  return { province: '省份', country: '国家', city: '城市' }[level] || '';
}

function pathOf(id) {
  const out = [];
  let cur = getNode(id);
  let guard = 0;
  while (cur && guard++ < 12) {
    out.unshift(cur);
    cur = cur.parentId ? getNode(cur.parentId) : null;
  }
  return out;
}

function pathNames(id) {
  return pathOf(id).map((n) => n.name);
}

function subtreeIds(id) {
  const set = new Set([id]);
  const walk = (parent) => {
    for (const l of state.data.locations) {
      if (l.parentId === parent) {
        set.add(l.id);
        walk(l.id);
      }
    }
  };
  walk(id);
  return set;
}

function entriesIn(nodeId) {
  if (nodeId === 'all') return state.data.entries;
  if (nodeId === 'unplaced') return state.data.entries.filter((e) => !e.locationId);
  const ids = subtreeIds(nodeId);
  return state.data.entries.filter((e) => ids.has(e.locationId));
}

function normalizeForSearch(value) {
  return String(value == null ? '' : value)
    .normalize('NFKC')
    .toLowerCase();
}

function isSubsequence(needle, haystack) {
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j += 1) {
    if (haystack[j] === needle[i]) i += 1;
  }
  return i === needle.length;
}

function searchTokens(query) {
  return normalizeForSearch(query)
    .split(/\s+/)
    .filter(Boolean);
}

function searchText(entry) {
  const parts = [entry.title || ''];
  const type = TYPES[entry.type];
  if (type) {
    parts.push(type.label);
    for (const def of type.fields) {
      const v = entry.fields && entry.fields[def.key];
      if (v) {
        parts.push(
          Array.isArray(v)
            ? v
                .map((item) =>
                  item && typeof item === 'object' ? Object.values(item).join(' ') : String(item)
                )
                .join(' ')
            : String(v)
        );
      }
    }
  }
  if (entry.fields && Array.isArray(entry.fields.tags)) parts.push(entry.fields.tags.join(' '));
  parts.push(pathNames(entry.locationId).join(' '));
  return normalizeForSearch(parts.join(' '));
}

function scoreEntry(entry, tokens) {
  if (!tokens.length) return 0;
  const title = normalizeForSearch(entry.title);
  const haystack = searchText(entry);
  let score = 0;
  for (const token of tokens) {
    if (title === token) score += 160;
    else if (title.startsWith(token)) score += 120;
    else if (title.includes(token)) score += 100;
    else if (isSubsequence(token, title)) score += 60;
    else if (haystack.includes(token)) score += 40;
    else if (isSubsequence(token, haystack)) score += 20;
    else return 0;
  }
  return score;
}

function searchAllEntries(query) {
  const tokens = searchTokens(query);
  const scope = scopedEntries();
  if (!tokens.length) {
    return scope
      .slice()
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 10);
  }
  return scope
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (b.entry.updatedAt || 0) - (a.entry.updatedAt || 0))
    .slice(0, 40)
    .map((item) => item.entry);
}

function scopedEntries() {
  let list = entriesIn(state.view.nodeId);
  if (state.view.type !== 'all') list = list.filter((e) => e.type === state.view.type);
  if (state.view.status === 'done') list = list.filter((e) => e.checked);
  if (state.view.status === 'todo') list = list.filter((e) => !e.checked);
  return list;
}

function visibleEntries() {
  let list = scopedEntries();
  const tokens = searchTokens(state.view.q);
  if (tokens.length) list = list.filter((e) => scoreEntry(e, tokens) > 0);
  return list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/* ---------- 时间 ---------- */
function formatDate(value) {
  return value ? String(value).replaceAll('-', '.') : '';
}
function formatTs(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
function dateStamp(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function todayInput() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ---------- 持久化 ---------- */
let saveTimer = null;
let dirty = false;
let saving = false;
let syncState = 'idle';

function save() {
  dirty = true;
  if (isGithubMode()) writeLocalCache();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flushSave, isGithubMode() ? 900 : 200);
}

function setSyncState(next) {
  syncState = next;
  renderStorage();
  renderCloudStatus();
}

async function storeRead() {
  if (isGithubMode()) {
    const cached = readLocalCache();
    if (cached) return cached;
    const data = await ghLoad();
    return data || { version: 1, entries: [], locations: [] };
  }
  const res = await fetch('/api/data');
  if (!res.ok) throw new Error('local-unavailable');
  const data = await res.json();
  return {
    version: 1,
    entries: Array.isArray(data.entries) ? data.entries : [],
    locations: Array.isArray(data.locations) ? data.locations : [],
  };
}

async function storeWrite(data) {
  if (isGithubMode()) return ghSave(data);
  const res = await fetch('/api/data', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('保存失败');
}

async function flushSave() {
  if (!dirty) return;
  if (saving) return;
  dirty = false;
  saving = true;
  setSyncState('saving');
  let ok = true;
  try {
    await storeWrite(state.data);
    setSyncState('saved');
    if (isGithubMode()) setTimeout(maybeCloudBackup, 800);
  } catch (err) {
    ok = false;
    dirty = true;
    setSyncState('error');
    const message = isGithubMode()
      ? `云端保存失败：${err.message || '网络错误'}。修改已存在本机，可点侧栏「备份」重试。`
      : '数据保存失败，请确认本地服务仍在运行';
    toast(message, 'error');
  } finally {
    saving = false;
    if (dirty && ok) {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(flushSave, 400);
    }
  }
}

async function loadData() {
  try {
    state.data = await storeRead();
    if (isGithubMode()) writeLocalCache();
  } catch (err) {
    const cached = isGithubMode() ? readLocalCache() : null;
    if (cached) {
      state.data = cached;
      toast('云端暂时读取失败，已载入本机缓存', 'error');
    } else {
      state.data = { version: 1, entries: [], locations: [] };
      if (isGithubMode()) {
        toast('读取私有仓库失败：' + (err.message || '未知错误'), 'error');
      } else if (isLocalHost()) {
        toast('读取数据失败，请用 start.bat 启动服务后再打开页面', 'error');
      } else if (!sessionStorage.getItem('interests.settingsSeen')) {
        setTimeout(() => {
          if (!isGithubMode()) openSettings();
        }, 500);
      }
    }
  }

  const saved = localStorage.getItem('interests.open');
  if (saved) {
    try {
      state.open = new Set(JSON.parse(saved));
    } catch {
      state.open = new Set();
    }
  } else {
    for (const r of REGIONS) {
      if (entriesIn(r.id).length) state.open.add(r.id);
    }
    if (!state.open.size) state.open.add('cn');
  }

  if (isGithubMode()) setTimeout(maybeCloudBackup, 1200);
}

function persistOpen() {
  localStorage.setItem('interests.open', JSON.stringify([...state.open]));
}

/* ---------- 地点操作 ---------- */
function addLocation(name, parentId) {
  const level = childLevel(parentId);
  const clean = (name || '').trim();
  if (!level || !clean) return null;
  const existing = state.data.locations.find((l) => l.parentId === parentId && l.name === clean);
  if (existing) return existing;
  const node = { id: 'loc-' + uid(), name: clean, parentId, level, createdAt: Date.now() };
  state.data.locations.push(node);
  save();
  return node;
}

function renameLocation(id, name) {
  const node = state.data.locations.find((l) => l.id === id);
  const clean = (name || '').trim();
  if (!node || !clean || clean === node.name) return true;
  const clash = state.data.locations.some(
    (l) => l.parentId === node.parentId && l.id !== id && l.name === clean
  );
  if (clash) {
    toast('同级已有同名地点', 'error');
    return false;
  }
  node.name = clean;
  save();
  return true;
}

function deleteLocation(id) {
  const node = getNode(id);
  if (!node || node.fixed) return;
  const ids = subtreeIds(id);
  const affected = state.data.entries.filter((e) => ids.has(e.locationId)).length;
  const msg = affected
    ? `删除「${node.name}」及其下级地点？其中 ${affected} 条收藏也会一并删除。`
    : `删除「${node.name}」？`;
  if (!window.confirm(msg)) return;
  state.data.locations = state.data.locations.filter((l) => !ids.has(l.id));
  state.data.entries = state.data.entries.filter((e) => !ids.has(e.locationId));
  if (ids.has(state.view.nodeId)) state.view.nodeId = 'all';
  save();
  renderAll();
  toast('已删除');
}

/* ---------- 渲染：侧边栏 ---------- */
function renderAll(options = {}) {
  renderTree();
  renderExtra();
  renderMain(options.animate !== false);
  renderStats();
  renderStorage();
  renderCloudStatus();
}

function renderTree() {
  const tree = $('#tree');
  tree.innerHTML = '';
  REGIONS.forEach((r) => tree.appendChild(nodeEl(r.id, 0)));
  if (treeEdit) focusTreeEdit();
}

function nodeEl(id, depth) {
  const node = getNode(id);
  const kids = childrenOf(id);
  const isOpen = state.open.has(id);
  const wrap = el('div', { class: 'tree-node' });
  wrap.dataset.id = id;

  const row = el('div', {
    class:
      'tree-row' +
      (state.view.nodeId === id ? ' active' : '') +
      (node.level === 'region' ? ' is-region' : '') +
      (id === 'cn' ? ' is-cn' : ''),
  });
  row.style.paddingLeft = 6 + depth * 15 + 'px';

  const chev = el('button', {
    type: 'button',
    class: 'tree-chev' + (kids.length ? '' : ' empty') + (isOpen ? ' open' : ''),
    'aria-label': isOpen ? '收起' : '展开',
  });
  chev.innerHTML = icon('chevron');
  chev.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (!kids.length) return;
    if (isOpen) state.open.delete(id);
    else state.open.add(id);
    persistOpen();
    renderTree();
  });
  row.appendChild(chev);

  row.appendChild(el('span', { class: 'tree-name', text: node.name, title: node.name }));
  row.appendChild(el('span', { class: 'count', text: String(entriesIn(id).length) }));

  const actions = el('div', { class: 'tree-actions' });
  const level = childLevel(id);
  if (level) {
    const addBtn = el('button', {
      type: 'button',
      class: 'icon-btn tree-action-add',
      title: `新增${levelName(level)}`,
      'aria-label': `新增${levelName(level)}`,
    });
    addBtn.innerHTML = icon('plus');
    addBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      state.open.add(id);
      persistOpen();
      treeEdit = { mode: 'add', parentId: id };
      renderTree();
    });
    actions.appendChild(addBtn);
  }

  if (!node.fixed) {
    const editBtn = el('button', {
      type: 'button',
      class: 'icon-btn',
      title: '重命名',
      'aria-label': '重命名',
    });
    editBtn.innerHTML = icon('edit');
    editBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      treeEdit = { mode: 'rename', id };
      renderTree();
    });

    const delBtn = el('button', {
      type: 'button',
      class: 'icon-btn tree-action-del',
      title: '删除',
      'aria-label': '删除',
    });
    delBtn.innerHTML = icon('trash');
    delBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      deleteLocation(id);
    });

    actions.append(editBtn, delBtn);
  }
  row.appendChild(actions);

  row.addEventListener('click', () => {
    if (kids.length && !isOpen) {
      state.open.add(id);
      persistOpen();
    }
    setView(id);
    closeSidebar();
  });

  wrap.appendChild(row);

  if (treeEdit && treeEdit.mode === 'rename' && treeEdit.id === id) {
    wrap.appendChild(treeEditRow(node.name, '新名称', (value) => {
      const ok = renameLocation(id, value);
      if (!ok) {
        focusTreeEdit();
        return;
      }
      treeEdit = null;
      renderAll();
    }));
  }

  if (treeEdit && treeEdit.mode === 'add' && treeEdit.parentId === id) {
    const childLevelValue = childLevel(id);
    wrap.appendChild(treeEditRow('', `新${levelName(childLevelValue)}名称`, (value) => {
      const created = addLocation(value, id);
      if (!created) {
        focusTreeEdit();
        return;
      }
      treeEdit = null;
      state.open.add(id);
      persistOpen();
      state.view.nodeId = created.id;
      renderAll();
    }));
  }

  if (kids.length && isOpen) {
    const box = el('div', { class: 'tree-children' });
    kids.forEach((child) => box.appendChild(nodeEl(child.id, depth + 1)));
    wrap.appendChild(box);
  }

  return wrap;
}

function treeEditRow(value, placeholder, commit) {
  const wrap = el('div', { class: 'tree-add' });
  const input = el('input', { class: 'tree-input', type: 'text', placeholder, value, autocomplete: 'off' });
  const ok = el('button', { class: 'btn tiny primary', type: 'button', text: '确定' });
  const cancel = el('button', { class: 'btn tiny ghost', type: 'button', text: '取消' });

  const finish = () => {
    const v = input.value.trim();
    if (!v) {
      input.focus();
      return;
    }
    commit(v);
  };
  const quit = () => {
    treeEdit = null;
    renderTree();
  };

  ok.addEventListener('click', finish);
  cancel.addEventListener('click', quit);
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      finish();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      quit();
    }
  });

  wrap.append(input, ok, cancel);
  return wrap;
}

function focusTreeEdit() {
  const input = $('.tree-input');
  if (!input) return;
  input.focus();
  input.select();
}

function renderExtra() {
  const box = $('#treeExtra');
  box.innerHTML = '';
  const row = el('div', { class: 'tree-row is-extra' + (state.view.nodeId === 'unplaced' ? ' active' : '') });
  const spacer = el('span', { class: 'tree-chev empty' });
  spacer.innerHTML = icon('chevron');
  row.appendChild(spacer);
  row.appendChild(el('span', { class: 'tree-name', text: '无地点收藏' }));
  row.appendChild(el('span', { class: 'count', text: String(entriesIn('unplaced').length) }));
  row.addEventListener('click', () => {
    setView('unplaced');
    closeSidebar();
  });
  box.appendChild(row);
}

function renderStats() {
  const counts = { food: 0, spot: 0, media: 0, book: 0, goods: 0, people: 0, topic: 0 };
  state.data.entries.forEach((e) => {
    if (counts[e.type] != null) counts[e.type] += 1;
  });
  const done = state.data.entries.filter((e) => e.checked).length;
  $('#stats').innerHTML =
    `<div>共 <strong>${state.data.entries.length}</strong> 条收藏 · 已打卡 <strong>${done}</strong></div>` +
    `<div>${TYPES.food.label} ${counts.food} · ${TYPES.spot.label} ${counts.spot} · ${TYPES.media.label} ${counts.media} · ${TYPES.book.label} ${counts.book} · ${TYPES.goods.label} ${counts.goods} · ${TYPES.people.label} ${counts.people} · ${TYPES.topic.label} ${counts.topic}</div>`;
  $('#allCount').textContent = String(state.data.entries.length);
}

function renderStorage() {
  const line = $('#storageLine');
  if (!line) return;
  if (isGithubMode()) {
    const label =
      syncState === 'saving'
        ? '保存中…'
        : syncState === 'error'
        ? '保存失败'
        : syncState === 'saved'
        ? '已同步'
        : '已连接';
    line.textContent = `私有仓库 ${GH.config.owner}/${GH.config.repo} · ${label}`;
    line.classList.add('linked');
    line.title = '点击管理数据仓库';
  } else {
    line.textContent = '本机存储 · 连接私有仓库';
    line.classList.remove('linked');
    line.title = '连接 GitHub 私有数据仓库';
  }
}

/* ---------- 设置：私有数据仓库 ---------- */
function openSettings() {
  const cfg = GH.config || {};
  $('#setOwner').value = cfg.owner || 'wantianxiangsean';
  $('#setRepo').value = cfg.repo || 'zhongcao-meihao-data';
  $('#setBranch').value = cfg.branch || 'main';
  $('#setPath').value = cfg.path || 'data/data.json';
  $('#setToken').value = cfg.token || '';
  $('#settingsStatus').textContent = '';
  $('#settingsStatus').className = 'settings-status';
  const connected = isGithubMode();
  $('#ghDisconnect').hidden = !connected;
  $('#ghBackup').hidden = !connected;
  $('#ghRestore').hidden = !connected;
  renderCloudStatus();
  $('#settingsBackdrop').hidden = false;
  sessionStorage.setItem('interests.settingsSeen', '1');
  setTimeout(() => {
    const target = $('#setOwner').value && $('#setRepo').value ? $('#setToken') : $('#setOwner');
    target.focus();
  }, 30);
}

function closeSettings() {
  $('#settingsBackdrop').hidden = true;
  $('#settingsStatus').textContent = '';
}

async function connectGithub() {
  const status = $('#settingsStatus');
  const show = (text, kind = '') => {
    status.textContent = text;
    status.className = 'settings-status' + (kind ? ' ' + kind : '');
  };

  const owner = $('#setOwner').value.trim();
  const repo = $('#setRepo').value.trim();
  const branch = $('#setBranch').value.trim() || 'main';
  const path = $('#setPath').value.trim() || 'data/data.json';
  const token = $('#setToken').value.trim();

  if (!owner || !repo || !token) {
    show('请填写用户名、私有仓库名和 Token', 'error');
    return;
  }

  const previous = GH.config;
  const cfg = { owner, repo, branch, path, token };
  $('#ghConnect').disabled = true;
  show('正在验证 Token 与仓库…');

  try {
    const repoRes = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );
    if (repoRes.status === 401) throw new Error('Token 无效或已过期');
    if (repoRes.status === 404) throw new Error('找不到该仓库，或 Token 没有访问权限');
    if (!repoRes.ok) throw new Error(`无法访问仓库（${repoRes.status}）`);
    const info = await repoRes.json();
    if (!info.private) {
      throw new Error('这个仓库是公开的。为保证数据私密，请换用私有仓库');
    }

    GH.config = cfg;
    const existing = await ghLoad();

    if (!existing) {
      const localCount = previous ? 0 : state.data.entries.length;
      let uploadLocal = false;
      if (localCount > 0) {
        const hasImage = state.data.entries.some((e) => e.fields && e.fields.image);
        uploadLocal = window.confirm(
          `私有仓库还没有数据。要把本机现有的 ${localCount} 条收藏上传上去吗？${
            hasImage ? '\n注意：本机已有图片不会自动上传。' : ''
          }`
        );
      }
      await ghSave(uploadLocal ? state.data : { version: 1, entries: [], locations: [] });
    } else {
      state.data = existing;
      writeLocalCache();
    }

    writeGithubConfig(cfg);
    closeSettings();
    await loadData();
    state.view.nodeId = 'all';
    syncState = 'idle';
    renderAll();
    toast('已连接私有数据仓库');
  } catch (err) {
    GH.config = previous;
    show(err.message || '连接失败', 'error');
  } finally {
    $('#ghConnect').disabled = false;
  }
}

function disconnectGithub() {
  if (!window.confirm('断开私有仓库？之后本机浏览器会改为读取本地服务数据，GitHub 上的数据不会被删除。')) return;
  writeGithubConfig(null);
  GH.config = null;
  for (const promise of GH.imageCache.values()) {
    promise.then((url) => URL.revokeObjectURL(url)).catch(() => {});
  }
  GH.imageCache.clear();
  closeSettings();
  syncState = 'idle';
  loadData().then(() => {
    state.view.nodeId = 'all';
    renderAll();
    toast('已断开私有仓库');
  });
}

async function runManualCloudBackup() {
  const btn = $('#ghBackup');
  const status = $('#settingsStatus');
  if (!isGithubMode()) {
    status.className = 'settings-status error';
    status.textContent = '请先连接私有数据仓库';
    return;
  }
  btn.disabled = true;
  status.className = 'settings-status';
  status.textContent = '正在备份到私有仓库…';
  try {
    writeLocalCache();
    await ghSave(state.data);
    setSyncState('saved');
    status.className = 'settings-status ok';
    status.textContent = '已备份到云端';
    renderCloudStatus();
  } catch (err) {
    status.className = 'settings-status error';
    status.textContent = err.message || '备份失败';
  } finally {
    btn.disabled = false;
  }
}

async function restoreFromCloud() {
  if (!isGithubMode()) {
    toast('请先连接私有数据仓库', 'error');
    openSettings();
    return;
  }
  if (!window.confirm('云端最新数据会覆盖浏览器当前收藏（不会删除云端数据）。继续吗？')) return;
  const status = $('#settingsStatus');
  status.className = 'settings-status';
  status.textContent = '正在读取云端数据…';
  try {
    const data = await ghLoad();
    if (!data) throw new Error('云端还没有数据文件');
    state.data = data;
    writeLocalCache();
    state.view = { nodeId: 'all', type: 'all', status: 'all', q: '' };
    $('#searchInput').value = '';
    syncState = 'saved';
    renderAll();
    closeSettings();
    toast('已从云端恢复到本地');
  } catch (err) {
    status.className = 'settings-status error';
    status.textContent = err.message || '恢复失败';
  }
}

function renderCloudStatus() {
  const box = $('#cloudStatus');
  if (!box) return;
  if (!isGithubMode()) {
    box.hidden = true;
    box.innerHTML = '';
    return;
  }
  box.hidden = false;
  box.innerHTML = '';

  const headline =
    syncState === 'saving'
      ? '正在自动备份…'
      : syncState === 'error'
      ? '自动备份遇到问题'
      : '自动备份已开启';
  const last = localStorage.getItem('interests.lastCloudBackup');
  const detail = `修改会自动写入私有仓库；每日首次修改另存一份 backups/ 快照${
    last ? `，最近 ${last}` : ''
  }。`;

  box.appendChild(el('strong', { text: headline }));
  box.appendChild(el('span', { text: detail }));
  const link = el('a', {
    href: `https://github.com/${GH.config.owner}/${GH.config.repo}/tree/${GH.config.branch}/backups`,
    target: '_blank',
    rel: 'noopener',
    text: '查看云端快照',
  });
  box.appendChild(link);
}

/* ---------- 渲染：主内容 ---------- */
function setView(nodeId) {
  state.view.nodeId = nodeId;
  renderAll();
}

function renderMain(animate) {
  const node = getNode(state.view.nodeId) || getNode('all');
  const all = entriesIn(state.view.nodeId);
  const list = visibleEntries();
  const done = list.filter((e) => e.checked).length;
  const filtered = !!(state.view.q.trim() || state.view.type !== 'all' || state.view.status !== 'all');

  let eyebrow = '收藏地图';
  if (state.view.nodeId === 'unplaced') eyebrow = '屏幕 · 书桌 · 念头';
  else if (state.view.nodeId !== 'all') {
    const parents = pathNames(state.view.nodeId).slice(0, -1);
    eyebrow = parents.length ? parents.join(' · ') : '大洲';
  }

  $('#viewEyebrow').textContent = eyebrow;
  $('#viewTitle').textContent = node.name;
  $('#viewSub').textContent = filtered
    ? `筛选出 ${list.length} 条（共 ${all.length} 条）· 已打卡 ${done} 条`
    : `${all.length} 条收藏 · 已打卡 ${done} 条`;

  $('#searchClear').hidden = !state.view.q;
  $('#navAll').classList.toggle('active', state.view.nodeId === 'all');

  renderSegs();

  const cards = $('#cards');
  cards.innerHTML = '';
  cards.classList.toggle('no-anim', animate === false);

  if (list.length) {
    const frag = document.createDocumentFragment();
    list.forEach((entry) => frag.appendChild(cardEl(entry)));
    cards.appendChild(frag);
    $('#empty').hidden = true;
  } else {
    $('#empty').hidden = false;
    renderEmpty();
  }
}

function renderSegs() {
  const typeSeg = $('#typeSeg');
  typeSeg.innerHTML = '';
  TYPE_FILTERS.forEach((f) => {
    const b = el('button', {
      type: 'button',
      class: state.view.type === f.value ? 'active' : '',
      text: f.label,
    });
    b.addEventListener('click', () => {
      state.view.type = f.value;
      const typeDef = TYPES[f.value];
      if (typeDef) {
        if (!typeDef.place && state.view.nodeId !== 'all' && state.view.nodeId !== 'unplaced') {
          state.view.nodeId = 'unplaced';
        } else if (typeDef.place && state.view.nodeId === 'unplaced') {
          state.view.nodeId = 'all';
        }
      }
      renderAll();
    });
    typeSeg.appendChild(b);
  });

  const statusSeg = $('#statusSeg');
  statusSeg.innerHTML = '';
  STATUS_FILTERS.forEach((f) => {
    const b = el('button', {
      type: 'button',
      class: state.view.status === f.value ? 'active' : '',
      text: f.label,
    });
    b.addEventListener('click', () => {
      state.view.status = f.value;
      renderMain();
    });
    statusSeg.appendChild(b);
  });
}

const GRADIENTS = [
  'linear-gradient(135deg,#c46a4a,#8e3b28)',
  'linear-gradient(135deg,#7d8a5c,#4c5a3c)',
  'linear-gradient(135deg,#c39a4e,#8a6526)',
  'linear-gradient(135deg,#8c7ba8,#5b4c78)',
  'linear-gradient(135deg,#6f8b96,#3f5b66)',
  'linear-gradient(135deg,#b5726a,#7d3f46)',
];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function gradientFor(entry) {
  return GRADIENTS[hashStr((entry.title || '') + entry.id) % GRADIENTS.length];
}

function starsEl(rating) {
  const wrap = el('span', { class: 'stars', title: `${rating} / 5` });
  for (let i = 1; i <= 5; i += 1) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'star' + (i <= rating ? ' on' : ''));
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', STAR_PATH);
    svg.appendChild(path);
    wrap.appendChild(svg);
  }
  return wrap;
}

function shortPath(id) {
  const names = pathNames(id);
  if (!names.length) return '无地点';
  return names.slice(-2).join(' › ');
}

function cardEl(entry) {
  const type = TYPES[entry.type] || TYPES.food;
  const card = el('article', {
    class: 'card' + (entry.checked ? ' is-checked' : ''),
    tabindex: '0',
    role: 'button',
    'aria-label': `${type.label}：${entry.title}`,
  });
  card.addEventListener('click', () => openDrawer(entry.id));
  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDrawer(entry.id);
    }
  });

  const media = el('div', { class: 'card-media' });
  if (entry.fields && entry.fields.image) {
    media.style.background = gradientFor(entry);
    const fallback = el('div', { class: 'media-fallback', html: icon(type.icon) });
    media.appendChild(fallback);
    const img = el('img', { alt: entry.title, loading: 'lazy' });
    img.addEventListener('load', () => fallback.remove(), { once: true });
    img.addEventListener('error', () => img.remove(), { once: true });
    applyImage(img, entry.fields.image);
    media.appendChild(img);
  } else {
    media.style.background = gradientFor(entry);
    media.appendChild(el('div', { class: 'media-fallback', html: icon(type.icon) }));
  }
  media.appendChild(
    el('span', { class: 'type-chip ' + entry.type, html: `<span class="dot"></span>${type.label}` })
  );
  if (entry.checked) media.appendChild(el('span', { class: 'stamp', text: type.checkDone }));
  card.appendChild(media);

  const body = el('div', { class: 'card-body' });
  body.appendChild(el('h3', { class: 'card-title', text: entry.title }));

  const meta = el('div', { class: 'card-meta' });
  let first = true;
  if (entry.fields && entry.fields.rating) {
    meta.appendChild(starsEl(entry.fields.rating));
    first = false;
  }
  const bits = type.cardFields.map((k) => entry.fields && entry.fields[k]).filter(Boolean);
  bits.forEach((bit) => {
    if (!first) meta.appendChild(el('span', { class: 'sep', text: '·' }));
    meta.appendChild(el('span', { text: String(bit) }));
    first = false;
  });
  body.appendChild(meta);

  const tags = (entry.fields && entry.fields.tags) || [];
  if (tags.length) {
    const box = el('div', { class: 'tags' });
    tags.slice(0, 3).forEach((t) => box.appendChild(el('span', { class: 'tag', text: t })));
    if (tags.length > 3) box.appendChild(el('span', { class: 'tag more', text: `+${tags.length - 3}` }));
    body.appendChild(box);
  }

  const foot = el('div', { class: 'card-foot' });
  const loc = el('div', {
    class: 'card-loc',
    title: entry.locationId ? pathNames(entry.locationId).join(' / ') : '无地点',
  });
  if (type.place && entry.locationId) {
    loc.innerHTML = icon('pin');
    loc.appendChild(el('span', { text: shortPath(entry.locationId) }));
  } else {
    loc.innerHTML = icon(type.place ? 'pin' : 'tag');
    loc.appendChild(el('span', { text: entry.locationId ? shortPath(entry.locationId) : type.label + ' · 无地点' }));
  }
  foot.appendChild(loc);

  const checkLabel = el('label', { class: 'check', title: type.checkHint });
  const cb = el('input', { type: 'checkbox' });
  cb.checked = !!entry.checked;
  cb.addEventListener('click', (e) => e.stopPropagation());
  cb.addEventListener('change', (e) => {
    e.stopPropagation();
    setChecked(entry.id, cb.checked);
  });
  checkLabel.appendChild(cb);
  checkLabel.appendChild(el('span', { text: type.checkLabel }));
  checkLabel.addEventListener('click', (e) => e.stopPropagation());
  foot.appendChild(checkLabel);

  body.appendChild(foot);
  card.appendChild(body);
  return card;
}

function setChecked(id, value) {
  const entry = entryById(id);
  if (!entry) return;
  entry.checked = !!value;
  entry.checkedAt = value ? Date.now() : null;
  entry.updatedAt = Date.now();
  save();
  renderAll({ animate: false });
  if (!$('#drawerBackdrop').hidden) refreshDrawerCheck();
}

function refreshDrawerCheck() {
  const entry = entryById(currentDrawerId);
  if (!entry) return;
  const type = TYPES[entry.type] || TYPES.food;
  const top = $('#drawer .drawer-top');
  if (top) {
    const existing = top.querySelector('.pill.checked');
    if (entry.checked && !existing) top.appendChild(el('span', { class: 'pill checked', text: type.checkDone }));
    if (!entry.checked && existing) existing.remove();
  }
  const cb = $('#drawer .drawer-foot input[type="checkbox"]');
  if (cb) cb.checked = entry.checked;
  const note = $('#drawer .drawer-note');
  if (note) note.textContent = drawerNote(entry, type);
}

function drawerNote(entry, type) {
  const parts = [];
  if (entry.checkedAt) parts.push(`${type.checkDone}于 ${formatTs(entry.checkedAt)}`);
  parts.push(`收录于 ${formatTs(entry.createdAt)}`);
  if (entry.updatedAt && entry.updatedAt - entry.createdAt > 60000) {
    parts.push(`更新于 ${formatTs(entry.updatedAt)}`);
  }
  return parts.join(' · ');
}

function renderEmpty() {
  const box = $('#empty');
  box.innerHTML = '';
  const hasQuery = !!(state.view.q.trim() || state.view.status !== 'all');

  if (hasQuery) {
    box.append(
      el('div', { class: 'empty-mark', text: '寻' }),
      el('h3', { text: '没有找到匹配的收藏' }),
      el('p', { text: '换个关键词，或清除筛选条件再看看。' })
    );
    const actions = el('div', { class: 'empty-actions' });
    const clear = el('button', { class: 'btn ghost', type: 'button', text: '清除筛选' });
    clear.addEventListener('click', clearFilters);
    actions.appendChild(clear);
    box.appendChild(actions);
    return;
  }

  if (state.view.type !== 'all') {
    const type = TYPES[state.view.type];
    box.append(
      el('div', { class: 'empty-mark', text: '种' }),
      el('h3', { text: `还没有${type.label}记录` }),
      el('p', { text: '记下第一条，慢慢攒成自己的收藏。' })
    );
    const actions = el('div', { class: 'empty-actions' });
    const add = el('button', { class: 'btn primary', type: 'button' });
    add.innerHTML = icon(type.icon) + `<span>添加${type.label}</span>`;
    add.addEventListener('click', () => openEditor({ type: state.view.type }));
    actions.appendChild(add);
    box.appendChild(actions);
    return;
  }

  const unplaced = state.view.nodeId === 'unplaced';
  box.append(
    el('div', { class: 'empty-mark', text: '种' }),
    el('h3', { text: unplaced ? '还没有无地点收藏' : '这里还空着' }),
    el('p', {
      text: unplaced
        ? '好剧、好书、好物、想研究的主题、值得记住的人，都可以放在这里。'
        : '把吃过的好菜、去过的地方记下来，慢慢长成你的地图。',
    })
  );

  const actions = el('div', { class: 'empty-actions' });
  (unplaced ? ['media', 'book', 'goods', 'people', 'topic'] : ['food', 'spot']).forEach((t) => {
    const b = el('button', {
      class: 'btn ' + (t === 'food' || t === 'media' ? 'primary' : 'ghost'),
      type: 'button',
    });
    b.innerHTML = icon(TYPES[t].icon) + `<span>添加${TYPES[t].label}</span>`;
    b.addEventListener('click', () => openEditor({ type: t }));
    actions.appendChild(b);
  });
  box.appendChild(actions);
}

function clearFilters() {
  state.view.type = 'all';
  state.view.status = 'all';
  state.view.q = '';
  $('#searchInput').value = '';
  renderMain();
}

/* ---------- 全局搜索 ---------- */
function currentSearchScope() {
  const parts = [];
  if (state.view.nodeId !== 'all') {
    const node = getNode(state.view.nodeId);
    if (node) parts.push(node.name);
  }
  if (state.view.type !== 'all' && TYPES[state.view.type]) parts.push(TYPES[state.view.type].label);
  if (state.view.status === 'done') parts.push('已打卡');
  if (state.view.status === 'todo') parts.push('待打卡');
  return parts.length ? parts.join(' · ') : '全部收藏';
}

function updateSearchScope() {
  const scope = currentSearchScope();
  const scopeEl = $('#searchScope');
  if (scopeEl) scopeEl.textContent = `搜索范围：${scope}`;
  const input = $('#paletteInput');
  if (input) {
    input.placeholder = scope === '全部收藏' ? '搜索全部收藏…' : `在 ${scope} 中搜索…`;
  }
}

function openSearchPalette() {
  updateSearchScope();
  $('#paletteInput').value = '';
  renderSearchResults();
  $('#searchBackdrop').hidden = false;
  setTimeout(() => $('#paletteInput').focus(), 20);
}

function closeSearchPalette() {
  $('#searchBackdrop').hidden = true;
}

function renderSearchResults() {
  const box = $('#searchResults');
  const entries = searchAllEntries($('#paletteInput').value);
  box.innerHTML = '';
  if (!entries.length) {
    box.appendChild(el('div', { class: 'search-empty', text: '没有找到匹配的收藏' }));
    return;
  }
  const frag = document.createDocumentFragment();
  for (const entry of entries) {
    const type = TYPES[entry.type] || TYPES.food;
    const row = el('button', { type: 'button', class: 'search-result' });
    row.appendChild(el('span', { class: 'pill ' + entry.type, text: type.label }));
    row.appendChild(el('span', { class: 'sr-title', text: entry.title }));
    row.appendChild(
      el('span', {
        class: 'sr-meta',
        text: entry.locationId ? pathNames(entry.locationId).join(' / ') : '无地点',
      })
    );
    row.addEventListener('click', () => {
      closeSearchPalette();
      openDrawer(entry.id);
    });
    frag.appendChild(row);
  }
  box.appendChild(frag);
}

function isEditableTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}

/* ---------- 侧栏宽度 ---------- */
const SIDEBAR_WIDTH_KEY = 'interests.sidebarWidth';
const SIDEBAR_MIN = 220;
const SIDEBAR_MAX = 460;
const SIDEBAR_DEFAULT = 278;

function applySidebarWidth(width) {
  const w = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, Math.round(width)));
  document.documentElement.style.setProperty('--sidebar-width', w + 'px');
  return w;
}

function initSidebarResize() {
  const saved = Number(localStorage.getItem(SIDEBAR_WIDTH_KEY));
  if (saved) applySidebarWidth(saved);

  const handle = $('#sidebarResizer');
  if (!handle) return;
  let dragging = false;

  const stop = () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.classList.remove('resizing');
    const width = Math.round($('.sidebar').getBoundingClientRect().width);
    if (width) localStorage.setItem(SIDEBAR_WIDTH_KEY, String(width));
  };

  handle.addEventListener('pointerdown', (e) => {
    if (window.innerWidth <= 900) return;
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    handle.classList.add('dragging');
    document.body.classList.add('resizing');
    e.preventDefault();
  });
  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const left = $('.sidebar').getBoundingClientRect().left;
    applySidebarWidth(e.clientX - left);
  });
  handle.addEventListener('pointerup', stop);
  handle.addEventListener('pointercancel', stop);
  handle.addEventListener('lostpointercapture', stop);
  handle.addEventListener('dblclick', () => {
    applySidebarWidth(SIDEBAR_DEFAULT);
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(SIDEBAR_DEFAULT));
  });
  handle.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const current = $('.sidebar').getBoundingClientRect().width;
    const next = applySidebarWidth(current + (e.key === 'ArrowRight' ? 16 : -16));
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(next));
  });
}

/* ---------- 详情抽屉 ---------- */
let currentDrawerId = null;

function openDrawer(id) {
  const entry = entryById(id);
  if (!entry) return;
  currentDrawerId = id;
  const type = TYPES[entry.type] || TYPES.food;
  const drawer = $('#drawer');
  drawer.innerHTML = '';

  const scroll = el('div', { class: 'drawer-scroll' });
  const media = el('div', { class: 'drawer-media' });
  if (entry.fields && entry.fields.image) {
    media.style.background = gradientFor(entry);
    const fallback = el('div', { class: 'media-fallback', html: icon(type.icon) });
    media.appendChild(fallback);
    const img = el('img', { alt: entry.title });
    img.addEventListener('load', () => fallback.remove(), { once: true });
    img.addEventListener('error', () => img.remove(), { once: true });
    applyImage(img, entry.fields.image);
    media.appendChild(img);
  } else {
    media.style.background = gradientFor(entry);
    media.appendChild(el('div', { class: 'media-fallback', html: icon(type.icon) }));
  }

  const closeBtn = el('button', { class: 'icon-btn drawer-close', type: 'button', 'aria-label': '关闭' });
  closeBtn.innerHTML = icon('close');
  closeBtn.addEventListener('click', closeDrawer);
  media.appendChild(closeBtn);
  scroll.appendChild(media);

  const body = el('div', { class: 'drawer-body' });
  const top = el('div', { class: 'drawer-top' });
  top.appendChild(el('span', { class: 'pill ' + entry.type, text: type.label }));
  if (entry.checked) top.appendChild(el('span', { class: 'pill checked', text: type.checkDone }));
  body.appendChild(top);

  body.appendChild(el('h2', { class: 'drawer-title', text: entry.title }));

  const crumb = el('div', { class: 'drawer-crumb' });
  if (entry.locationId) {
    crumb.innerHTML = icon('pin');
    crumb.appendChild(el('b', { text: pathNames(entry.locationId).join(' / ') || '未知地点' }));
  } else {
    crumb.innerHTML = icon('tag');
    crumb.appendChild(el('b', { text: '无地点 · ' + type.label }));
  }
  body.appendChild(crumb);

  if (entry.fields && entry.fields.rating) {
    const r = el('div', { class: 'drawer-rating' });
    r.appendChild(starsEl(entry.fields.rating));
    r.appendChild(el('span', { text: `${entry.fields.rating}.0 / 5` }));
    body.appendChild(r);
  }

  const facts = el('dl', { class: 'facts' });
  let hasFacts = false;
  for (const def of type.fields) {
    const value = entry.fields && entry.fields[def.key];
    if (!value || (Array.isArray(value) && !value.length)) continue;
    hasFacts = true;
    facts.appendChild(el('dt', { text: def.label }));
    if (Array.isArray(value)) {
      const dd = el('dd');
      if (def.type === 'pairs') {
        value.forEach((pair) => {
          if (!pair || (!pair.point && !pair.understanding)) return;
          const block = el('div', { class: 'insight' });
          if (pair.point) {
            const p = el('p', { class: 'insight-point' });
            p.appendChild(el('span', { class: 'insight-label', text: '核心观点' }));
            p.appendChild(el('span', { text: pair.point }));
            block.appendChild(p);
          }
          if (pair.understanding) {
            const p = el('p', { class: 'insight-under' });
            p.appendChild(el('span', { class: 'insight-label', text: '我的理解' }));
            p.appendChild(el('span', { text: pair.understanding }));
            block.appendChild(p);
          }
          dd.appendChild(block);
        });
      } else {
        const list = el('ul', { class: 'fact-list' });
        value.forEach((item) => list.appendChild(el('li', { text: String(item) })));
        dd.appendChild(list);
      }
      facts.appendChild(dd);
    } else {
      facts.appendChild(el('dd', { text: String(value) }));
    }
  }
  if (entry.fields && entry.fields.date) {
    hasFacts = true;
    facts.appendChild(el('dt', { text: '时间' }));
    facts.appendChild(el('dd', { text: formatDate(entry.fields.date) }));
  }
  if (hasFacts) body.appendChild(facts);

  const tags = (entry.fields && entry.fields.tags) || [];
  if (tags.length) {
    const tagBox = el('div', { class: 'drawer-tags' });
    tags.forEach((t) => tagBox.appendChild(el('span', { class: 'tag', text: t })));
    body.appendChild(tagBox);
  }

  body.appendChild(el('p', { class: 'drawer-note', text: drawerNote(entry, type) }));
  scroll.appendChild(body);
  drawer.appendChild(scroll);

  const foot = el('div', { class: 'drawer-foot' });
  const checkLine = el('label', { class: 'check-line' });
  const cb = el('input', { type: 'checkbox' });
  cb.checked = !!entry.checked;
  cb.addEventListener('change', () => setChecked(entry.id, cb.checked));
  checkLine.appendChild(cb);
  checkLine.appendChild(el('span', { text: type.checkDone }));
  foot.appendChild(checkLine);

  const editBtn = el('button', { class: 'btn tiny ghost', type: 'button' });
  editBtn.innerHTML = icon('edit') + '<span>编辑</span>';
  editBtn.addEventListener('click', () => {
    const target = entryById(entry.id);
    closeDrawer();
    openEditor({ entry: target });
  });
  foot.appendChild(editBtn);

  const delBtn = el('button', { class: 'btn tiny danger', type: 'button' });
  delBtn.innerHTML = icon('trash') + '<span>删除</span>';
  delBtn.addEventListener('click', () => deleteEntry(entry.id));
  foot.appendChild(delBtn);

  drawer.appendChild(foot);
  $('#drawerBackdrop').hidden = false;
}

function closeDrawer() {
  $('#drawerBackdrop').hidden = true;
  $('#drawer').innerHTML = '';
  currentDrawerId = null;
}

function deleteEntry(id) {
  const entry = entryById(id);
  if (!entry) return;
  if (!window.confirm(`删除「${entry.title}」？此操作不可撤销。`)) return;
  state.data.entries = state.data.entries.filter((e) => e.id !== id);
  save();
  closeDrawer();
  renderAll();
  toast('已删除');
}

/* ---------- 编辑器 ---------- */
function defaultEditorLocation() {
  const node = getNode(state.view.nodeId);
  if (!node || state.view.nodeId === 'all' || state.view.nodeId === 'unplaced') return null;
  return state.view.nodeId;
}

function splitLocation(id) {
  if (!id) return { region: 'cn', mid: '', city: '' };
  const path = pathOf(id);
  return {
    region: path[0] ? path[0].id : 'cn',
    mid: path[1] ? path[1].id : '',
    city: path[2] ? path[2].id : '',
  };
}

function openEditor(options = {}) {
  const entry = options.entry || null;
  const type =
    options.type ||
    (entry ? entry.type : state.view.type !== 'all' ? state.view.type : 'food');
  const locationId = entry ? entry.locationId : options.locationId ?? defaultEditorLocation();
  const loc = splitLocation(locationId);

  draft = {
    id: entry ? entry.id : null,
    type,
    title: entry ? entry.title : '',
    checked: entry ? !!entry.checked : false,
    rating: (entry && entry.fields && entry.fields.rating) || 0,
    tags: entry && entry.fields && Array.isArray(entry.fields.tags) ? entry.fields.tags.slice() : [],
    date: entry ? (entry.fields && entry.fields.date) || '' : todayInput(),
    image: (entry && entry.fields && entry.fields.image) || '',
    values: {},
    locRegion: loc.region,
    locMid: loc.mid,
    locCity: loc.city,
  };
  if (entry) {
    for (const def of TYPES[type].fields) {
      const v = entry.fields && entry.fields[def.key];
      if (v != null) draft.values[def.key] = v;
    }
  }

  $('#editorTitle').textContent = entry ? '编辑收藏' : '新收藏';
  $('#editorHint').textContent = '';
  buildEditorBody();
  $('#editorBackdrop').hidden = false;
  setTimeout(() => {
    const input = $('#editorBody [name="title"]');
    if (input) input.focus();
  }, 30);
}

function buildEditorBody() {
  const body = $('#editorBody');
  body.innerHTML = '';
  const type = TYPES[draft.type];

  const switcher = el('div', { class: 'type-switch' });
  TYPE_ORDER.forEach((key) => {
    const b = el('button', {
      type: 'button',
      class: draft.type === key ? 'active' : '',
    });
    b.innerHTML = icon(TYPES[key].icon) + `<span>${TYPES[key].label}</span>`;
    b.addEventListener('click', () => switchType(key));
    switcher.appendChild(b);
  });
  body.appendChild(switcher);

  const grid = el('div', { class: 'form-grid' });

  const titleInput = el('input', {
    type: 'text',
    name: 'title',
    value: draft.title,
    placeholder: type.titlePlaceholder,
    maxlength: '80',
    autocomplete: 'off',
  });
  grid.appendChild(fieldEl({ label: type.titleLabel, required: true, span: true }, titleInput));

  if (type.place) {
    const locField = el('div', { class: 'field span-2' });
    locField.appendChild(el('span', { class: 'label', text: '地点' }));
    const locArea = el('div', { class: 'loc-area' });
    locField.appendChild(locArea);
    locField.appendChild(
      el('div', { class: 'loc-note', text: '省份与城市都可以手动录入；也可以只记到国家或省份。' })
    );
    grid.appendChild(locField);
    renderLocArea(locArea);
  }

  for (const def of type.fields) {
    if (def.common) continue;
    if (def.type === 'list') {
      grid.appendChild(buildListField(def));
      continue;
    }
    if (def.type === 'pairs') {
      grid.appendChild(buildPairsField(def));
      continue;
    }
    let input;
    if (def.type === 'textarea') {
      input = el('textarea', { name: def.key, placeholder: def.ph || '', rows: '2' });
      input.value = draft.values[def.key] || '';
    } else if (def.type === 'select') {
      input = el('select', { name: def.key });
      input.appendChild(new Option('请选择', ''));
      (def.options || []).forEach((opt) => input.appendChild(new Option(opt, opt)));
      input.value = draft.values[def.key] || '';
    } else {
      input = el('input', {
        type: 'text',
        name: def.key,
        placeholder: def.ph || '',
        value: draft.values[def.key] || '',
        autocomplete: 'off',
      });
    }
    grid.appendChild(fieldEl({ label: def.label, span: def.span }, input));
  }

  grid.appendChild(el('div', { class: 'form-divider span-2' }));

  const ratingField = el('div', { class: 'field' });
  ratingField.appendChild(el('span', { class: 'label', text: '评分' }));
  const ratingBox = el('div', { class: 'rating-input' });
  for (let i = 1; i <= 5; i += 1) {
    const b = el('button', { type: 'button', class: i <= draft.rating ? 'on' : '', title: `${i} 星` });
    b.innerHTML = `<svg class="star-svg" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>`;
    b.addEventListener('click', () => {
      draft.rating = draft.rating === i ? 0 : i;
      updateRating(ratingBox);
    });
    ratingBox.appendChild(b);
  }
  const clearRating = el('button', { type: 'button', class: 'rating-clear', text: '清除' });
  clearRating.addEventListener('click', () => {
    draft.rating = 0;
    updateRating(ratingBox);
  });
  ratingBox.appendChild(clearRating);
  ratingField.appendChild(ratingBox);
  grid.appendChild(ratingField);

  const dateInput = el('input', { type: 'date', name: 'date', value: draft.date });
  draft.date = dateInput.value;
  grid.appendChild(fieldEl({ label: type.dateLabel }, dateInput));

  const commonField = type.fields.find((def) => def.common);
  if (commonField) {
    const summaryInput = el('input', {
      type: 'text',
      name: commonField.key,
      value: draft.values[commonField.key] || '',
      placeholder: commonField.ph || '',
      autocomplete: 'off',
    });
    grid.appendChild(fieldEl({ label: commonField.label, span: true }, summaryInput));
  } else {
    const tagsInput = el('input', {
      type: 'text',
      name: 'tags',
      value: draft.tags.join('，'),
      placeholder: '用逗号分隔，如：川菜，性价比高',
      autocomplete: 'off',
    });
    grid.appendChild(fieldEl({ label: '标签', span: true }, tagsInput));
  }

  const checkLine = el('label', { class: 'check-line span-2' });
  const cb = el('input', { type: 'checkbox', name: 'checked' });
  cb.checked = !!draft.checked;
  checkLine.appendChild(cb);
  checkLine.appendChild(el('span', { text: `${type.checkDone}（${type.checkHint}）` }));
  grid.appendChild(checkLine);

  body.appendChild(grid);
}

function fieldEl({ label, required, span }, input) {
  const field = el('div', { class: 'field' + (span ? ' span-2' : '') });
  const labelEl = el('span', { class: 'label', html: label + (required ? '<span class="req">*</span>' : '') });
  if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', label);
  field.append(labelEl, input);
  return field;
}

function buildListField(def) {
  const field = el('div', { class: 'field span-2' });
  const head = el('div', { class: 'list-head' });
  head.appendChild(el('span', { class: 'label', text: def.label }));
  const addBtn = el('button', { type: 'button', class: 'btn tiny ghost list-add' });
  addBtn.innerHTML = icon('plus') + '<span>新增</span>';
  head.appendChild(addBtn);
  field.appendChild(head);

  const list = el('div', { class: 'list-field' });
  list.dataset.list = def.key;

  const addRow = (value = '', focus = false) => {
    const row = el('div', { class: 'list-row' });
    const textarea = el('textarea', { rows: '2', 'aria-label': def.label });
    textarea.value = value;
    textarea.placeholder = def.ph || '';
    const remove = el('button', {
      type: 'button',
      class: 'icon-btn list-remove',
      'aria-label': '删除这一条',
      title: '删除',
    });
    remove.innerHTML = icon('trash');
    remove.addEventListener('click', () => {
      row.remove();
      if (!list.querySelector('.list-row')) addRow('', false);
    });
    row.append(textarea, remove);
    list.appendChild(row);
    if (focus) textarea.focus();
  };

  const raw = draft.values[def.key];
  const initial = Array.isArray(raw) ? raw : raw ? [String(raw)] : [];
  if (initial.length) initial.forEach((value) => addRow(String(value)));
  else addRow('');

  addBtn.addEventListener('click', () => addRow('', true));
  field.appendChild(list);
  return field;
}

function buildPairsField(def) {
  const field = el('div', { class: 'field span-2' });
  const head = el('div', { class: 'list-head' });
  head.appendChild(el('span', { class: 'label', text: def.label }));
  const addBtn = el('button', { type: 'button', class: 'btn tiny ghost list-add' });
  addBtn.innerHTML = icon('plus') + '<span>新增</span>';
  head.appendChild(addBtn);
  field.appendChild(head);

  const list = el('div', { class: 'pair-list' });
  list.dataset.pairs = def.key;

  const addRow = (pair = {}, focus = false) => {
    const row = el('div', { class: 'pair-row' });

    const left = el('div', { class: 'pair-col' });
    left.appendChild(el('span', { class: 'pair-label', text: '核心观点' }));
    const point = el('textarea', { rows: '2', 'aria-label': '核心观点' });
    point.dataset.part = 'point';
    point.placeholder = '一句话概括作者的核心观点…';
    point.value = pair.point != null ? String(pair.point) : '';
    left.appendChild(point);

    const right = el('div', { class: 'pair-col' });
    right.appendChild(el('span', { class: 'pair-label', text: '我的理解' }));
    const understanding = el('textarea', { rows: '2', 'aria-label': '我的理解' });
    understanding.dataset.part = 'understanding';
    understanding.placeholder = '与这条观点对应的理解、联想或疑问…';
    understanding.value = pair.understanding != null ? String(pair.understanding) : '';
    right.appendChild(understanding);

    const remove = el('button', {
      type: 'button',
      class: 'icon-btn list-remove',
      'aria-label': '删除这一组',
      title: '删除这一组',
    });
    remove.innerHTML = icon('trash');
    remove.addEventListener('click', () => {
      row.remove();
      if (!list.querySelector('.pair-row')) addRow({}, false);
    });

    row.append(left, right, remove);
    list.appendChild(row);
    if (focus) point.focus();
  };

  const initial = Array.isArray(draft.values[def.key]) ? draft.values[def.key] : [];
  if (initial.length) {
    initial.forEach((pair) => addRow(pair && typeof pair === 'object' ? pair : {}));
  } else {
    addRow({});
  }

  addBtn.addEventListener('click', () => addRow({}, true));
  field.appendChild(list);
  return field;
}

function updateRating(box) {
  [...box.querySelectorAll('button[title]')].forEach((b, idx) => {
    b.classList.toggle('on', idx + 1 <= draft.rating);
  });
}

function renderLocArea(container) {
  container.innerHTML = '';

  if (!REGIONS.some((r) => r.id === draft.locRegion)) draft.locRegion = REGIONS[0].id;
  if (draft.locMid && !childrenOf(draft.locRegion).some((c) => c.id === draft.locMid)) {
    draft.locMid = '';
    draft.locCity = '';
  }
  if (draft.locCity && !childrenOf(draft.locMid).some((c) => c.id === draft.locCity)) {
    draft.locCity = '';
  }

  const selects = el('div', { class: 'loc-selects' });

  const regionSel = el('select', { name: 'locRegion' });
  REGIONS.forEach((r) => regionSel.appendChild(new Option(r.name, r.id, false, r.id === draft.locRegion)));
  regionSel.value = draft.locRegion;
  regionSel.addEventListener('change', () => {
    draft.locRegion = regionSel.value;
    draft.locMid = '';
    draft.locCity = '';
    renderLocArea(container);
  });

  const midLevel = draft.locRegion === 'cn' ? 'province' : 'country';
  const midSel = el('select', { name: 'locMid' });
  midSel.appendChild(new Option(`— ${levelName(midLevel)} —`, ''));
  childrenOf(draft.locRegion).forEach((c) => midSel.appendChild(new Option(c.name, c.id)));
  midSel.value = draft.locMid || '';
  midSel.addEventListener('change', () => {
    draft.locMid = midSel.value;
    draft.locCity = '';
    renderLocArea(container);
  });

  const citySel = el('select', { name: 'locCity' });
  citySel.appendChild(new Option('— 城市 —', ''));
  if (draft.locMid) {
    childrenOf(draft.locMid).forEach((c) => citySel.appendChild(new Option(c.name, c.id)));
  }
  citySel.value = draft.locCity || '';
  citySel.disabled = !draft.locMid;
  citySel.addEventListener('change', () => {
    draft.locCity = citySel.value;
  });

  selects.append(regionSel, midSel, citySel);
  container.appendChild(selects);

  const addRow = el('div', { class: 'loc-add' });

  const addMid = el('button', { type: 'button', class: 'btn tiny ghost' });
  addMid.innerHTML = icon('plus') + `<span>新增${levelName(midLevel)}</span>`;
  addMid.addEventListener('click', () => {
    showInlineAdd(addRow, `新${levelName(midLevel)}名称`, (name) => {
      const node = addLocation(name, draft.locRegion);
      if (!node) return;
      draft.locMid = node.id;
      draft.locCity = '';
      state.open.add(draft.locRegion);
      persistOpen();
      renderLocArea(container);
      renderTree();
      renderExtra();
    });
  });
  addRow.appendChild(addMid);

  if (draft.locMid) {
    const addCity = el('button', { type: 'button', class: 'btn tiny ghost' });
    addCity.innerHTML = icon('plus') + '<span>新增城市</span>';
    addCity.addEventListener('click', () => {
      showInlineAdd(addRow, '新城市名称', (name) => {
        const node = addLocation(name, draft.locMid);
        if (!node) return;
        draft.locCity = node.id;
        state.open.add(draft.locRegion);
        state.open.add(draft.locMid);
        persistOpen();
        renderLocArea(container);
        renderTree();
        renderExtra();
      });
    });
    addRow.appendChild(addCity);
  }

  container.appendChild(addRow);
}

function showInlineAdd(anchor, placeholder, commit) {
  const existing = anchor.querySelector('.inline-add');
  if (existing) existing.remove();

  const row = el('div', { class: 'inline-add' });
  const input = el('input', { type: 'text', placeholder, autocomplete: 'off' });
  const ok = el('button', { type: 'button', class: 'btn tiny primary', text: '添加' });
  const cancel = el('button', { type: 'button', class: 'btn tiny ghost', text: '取消' });

  const finish = () => {
    const value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }
    row.remove();
    commit(value);
  };
  const quit = () => row.remove();

  ok.addEventListener('click', finish);
  cancel.addEventListener('click', quit);
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      finish();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      quit();
    }
  });

  row.append(input, ok, cancel);
  anchor.appendChild(row);
  input.focus();
}

function readDraftFromForm() {
  if (!draft) return;
  const body = $('#editorBody');
  const title = body.querySelector('[name="title"]');
  if (title) draft.title = title.value;
  const date = body.querySelector('[name="date"]');
  if (date) draft.date = date.value;
  const tags = body.querySelector('[name="tags"]');
  if (tags) draft.tags = parseTags(tags.value);
  const checked = body.querySelector('[name="checked"]');
  if (checked) draft.checked = checked.checked;
  for (const def of TYPES[draft.type].fields) {
    if (def.type === 'list') {
      const rows = body.querySelectorAll(`[data-list="${def.key}"] textarea`);
      draft.values[def.key] = [...rows].map((row) => row.value);
      continue;
    }
    if (def.type === 'pairs') {
      const rows = body.querySelectorAll(`[data-pairs="${def.key}"] .pair-row`);
      draft.values[def.key] = [...rows].map((row) => ({
        point: row.querySelector('[data-part="point"]')?.value || '',
        understanding: row.querySelector('[data-part="understanding"]')?.value || '',
      }));
      continue;
    }
    const input = body.querySelector(`[name="${def.key}"]`);
    if (input) draft.values[def.key] = input.value;
  }
  const region = body.querySelector('[name="locRegion"]');
  if (region) draft.locRegion = region.value;
  const mid = body.querySelector('[name="locMid"]');
  if (mid) draft.locMid = mid.value;
  const city = body.querySelector('[name="locCity"]');
  if (city) draft.locCity = city.value;
}

function switchType(next) {
  if (!draft || draft.type === next) return;
  readDraftFromForm();
  const keep = {
    id: draft.id,
    title: draft.title,
    checked: draft.checked,
    rating: draft.rating,
    tags: draft.tags,
    date: draft.date,
    image: draft.image,
    locRegion: draft.locRegion,
    locMid: draft.locMid,
    locCity: draft.locCity,
  };
  draft = { ...keep, type: next, values: {} };
  buildEditorBody();
  $('#editorHint').textContent = '';
}

function parseTags(value) {
  return String(value)
    .split(/[,，、;；\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
}

async function saveEditor() {
  if (!draft) return;
  readDraftFromForm();

  const title = draft.title.trim();
  if (!title) {
    $('#editorHint').textContent = '请先填写名称';
    const input = $('#editorBody [name="title"]');
    if (input) input.focus();
    return;
  }
  $('#editorHint').textContent = '';

  const saveBtn = $('#editorSave');
  const isEdit = !!draft.id;
  saveBtn.disabled = true;
  const originalText = saveBtn.textContent;

  try {
    const image = draft.image || '';

    const fields = {
      rating: draft.rating || 0,
      tags: draft.tags.filter(Boolean),
      date: draft.date || '',
      image,
    };
    for (const def of TYPES[draft.type].fields) {
      const raw = draft.values[def.key];
      if (def.type === 'list') {
        const values = (Array.isArray(raw) ? raw : raw ? [raw] : [])
          .map((value) => String(value).trim())
          .filter(Boolean);
        if (values.length) fields[def.key] = values;
        continue;
      }
      if (def.type === 'pairs') {
        const pairs = (Array.isArray(raw) ? raw : [])
          .map((pair) => ({
            point: String((pair && pair.point) || '').trim(),
            understanding: String((pair && pair.understanding) || '').trim(),
          }))
          .filter((pair) => pair.point || pair.understanding);
        if (pairs.length) fields[def.key] = pairs;
        continue;
      }
      const value = String(raw == null ? '' : raw).trim();
      if (value) fields[def.key] = value;
    }

    let locationId = null;
    if (TYPES[draft.type].place) {
      locationId = draft.locCity || draft.locMid || draft.locRegion || null;
    }

    const now = Date.now();
    if (isEdit) {
      const entry = entryById(draft.id);
      if (entry) {
        const wasChecked = entry.checked;
        Object.assign(entry, {
          type: draft.type,
          title,
          locationId,
          checked: !!draft.checked,
          fields,
          updatedAt: now,
        });
        if (entry.checked && !wasChecked) entry.checkedAt = now;
        if (!entry.checked) entry.checkedAt = null;
      }
    } else {
      state.data.entries.push({
        id: 'e-' + uid(),
        type: draft.type,
        title,
        locationId,
        checked: !!draft.checked,
        checkedAt: draft.checked ? now : null,
        fields,
        createdAt: now,
        updatedAt: now,
      });
    }

    save();
    renderAll();
    closeEditor();
    toast(isEdit ? '已保存修改' : '已收入收藏');
  } catch (err) {
    console.error(err);
    toast(err.message || '保存失败，请重试', 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = originalText;
  }
}

function closeEditor() {
  draft = null;
  $('#editorBackdrop').hidden = true;
  $('#editorBody').innerHTML = '';
  $('#editorHint').textContent = '';
}

/* ---------- 备份与恢复 ---------- */
let snapshotRunning = false;

function localCacheKey() {
  return GH.config ? `interests.cache.${GH.config.owner}/${GH.config.repo}` : 'interests.cache';
}

function writeLocalCache() {
  if (!isGithubMode()) return;
  try {
    localStorage.setItem(localCacheKey(), JSON.stringify({ savedAt: Date.now(), data: state.data }));
  } catch (err) {
    console.warn('写入本机缓存失败', err);
  }
}

function readLocalCache() {
  if (!isGithubMode()) return null;
  try {
    const raw = localStorage.getItem(localCacheKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.data || !Array.isArray(parsed.data.entries)) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

async function backupToCloudNow() {
  if (!isGithubMode()) {
    toast('请先连接私有数据仓库', 'error');
    openSettings();
    return;
  }
  const btn = $('#exportBtn');
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = icon('upload') + '<span>备份中…</span>';
  try {
    writeLocalCache();
    await ghSave(state.data);
    setSyncState('saved');
    toast('已备份到云端');
  } catch (err) {
    toast('备份失败：' + (err.message || '未知错误'), 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = original;
  }
}

async function createDailySnapshot() {
  if (!isGithubMode()) return false;
  if (snapshotRunning) return false;
  const today = dateStamp();
  if (localStorage.getItem('interests.lastCloudBackup') === today) return true;
  snapshotRunning = true;
  try {
    const path = `backups/${today}.json`;
    const url = ghContentsUrl(path);
    const existing = await ghRequest(url + `?ref=${encodeURIComponent(GH.config.branch)}`, {
      headers: ghHeaders(),
    });
    if (existing.status !== 200) {
      try {
        await ghRequest(url, {
          method: 'PUT',
          headers: ghHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            message: `备份收藏 · ${today}`,
            content: utf8ToBase64(JSON.stringify(state.data, null, 2)),
            branch: GH.config.branch,
          }),
        });
      } catch (err) {
        if (err.status !== 422) throw err;
      }
    }
    localStorage.setItem('interests.lastCloudBackup', today);
    await pruneCloudBackups();
    return true;
  } finally {
    snapshotRunning = false;
  }
}

async function pruneCloudBackups(keep = 30) {
  try {
    const res = await ghRequest(ghContentsUrl('backups') + `?ref=${encodeURIComponent(GH.config.branch)}`, {
      headers: ghHeaders(),
    });
    if (res.status === 404) return;
    const list = await res.json();
    if (!Array.isArray(list)) return;
    const files = list
      .filter((f) => f.type === 'file' && f.name.endsWith('.json'))
      .sort((a, b) => b.name.localeCompare(a.name));
    for (const file of files.slice(keep)) {
      await ghRequest(ghContentsUrl(`backups/${file.name}`), {
        method: 'DELETE',
        headers: ghHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ message: `清理旧备份 ${file.name}`, sha: file.sha, branch: GH.config.branch }),
      });
    }
  } catch (err) {
    console.warn('清理旧备份失败', err);
  }
}

async function maybeCloudBackup() {
  if (!isGithubMode()) return;
  try {
    await createDailySnapshot();
  } catch (err) {
    console.warn('自动云端备份失败', err);
  }
}

/* ---------- 提示 ---------- */
function toast(message, kind = '') {
  const box = $('#toast');
  box.textContent = message;
  box.className = 'toast show' + (kind === 'error' ? ' error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    box.className = 'toast';
  }, 2800);
}

/* ---------- 侧栏（移动端） ---------- */
function openSidebar() {
  $('.app').classList.add('sidebar-open');
}
function closeSidebar() {
  $('.app').classList.remove('sidebar-open');
}

/* ---------- 事件绑定 ---------- */
function bindStaticIcons() {
  $('.nav-all-icon').innerHTML = icon('inbox');
  $('.search-icon').innerHTML = icon('search');
  $('#searchClear').innerHTML = icon('close');
  $('#menuBtn').innerHTML = icon('menu');
  $('#sidebarClose').innerHTML = icon('close');
  $('#editorClose').innerHTML = icon('close');
  $('#settingsClose').innerHTML = icon('close');
  $('#searchEntryIcon').innerHTML = icon('search');
  $('#paletteIcon').innerHTML = icon('search');
  $('#paletteClose').innerHTML = icon('close');
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    const kbd = $('.search-entry kbd');
    if (kbd) kbd.textContent = '⌘ K';
  }
  $('#addBtn').innerHTML = icon('plus') + '<span>新收藏</span>';
  $('#exportBtn').innerHTML = icon('upload') + '<span>备份</span>';
  $('#importBtn').innerHTML = icon('download') + '<span>恢复</span>';
}

function bindEvents() {
  $('#navAll').addEventListener('click', () => {
    setView('all');
    closeSidebar();
  });

  $('#addBtn').addEventListener('click', () => {
    const type = state.view.type !== 'all' ? state.view.type : 'food';
    openEditor({ type });
  });

  $('#searchInput').addEventListener('input', (e) => {
    const value = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.view.q = value;
      renderMain();
    }, 140);
  });
  $('#searchClear').addEventListener('click', () => {
    $('#searchInput').value = '';
    state.view.q = '';
    renderMain();
    $('#searchInput').focus();
  });

  $('#menuBtn').addEventListener('click', openSidebar);
  $('#sidebarClose').addEventListener('click', closeSidebar);
  $('#sidebarScrim').addEventListener('click', closeSidebar);

  $('#storageLine').addEventListener('click', openSettings);
  $('#settingsClose').addEventListener('click', closeSettings);
  $('#ghCancel').addEventListener('click', closeSettings);
  $('#settingsBackdrop').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSettings();
  });
  $('#ghConnect').addEventListener('click', connectGithub);
  $('#ghDisconnect').addEventListener('click', disconnectGithub);
  $('#ghBackup').addEventListener('click', runManualCloudBackup);
  $('#ghRestore').addEventListener('click', restoreFromCloud);

  $('#editorClose').addEventListener('click', closeEditor);
  $('#editorCancel').addEventListener('click', closeEditor);
  $('#editorSave').addEventListener('click', saveEditor);

  $('#searchEntry').addEventListener('click', openSearchPalette);
  $('#paletteClose').addEventListener('click', closeSearchPalette);
  $('#searchBackdrop').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSearchPalette();
  });
  $('#paletteInput').addEventListener('input', renderSearchResults);
  $('#paletteInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const first = $('#searchResults .search-result');
      if (first) first.click();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const first = $('#searchResults .search-result');
      if (first) first.focus();
    }
  });

  $('#drawerBackdrop').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDrawer();
  });

  $('#exportBtn').addEventListener('click', backupToCloudNow);
  $('#importBtn').addEventListener('click', restoreFromCloud);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if ($('#searchBackdrop').hidden) openSearchPalette();
      else closeSearchPalette();
      return;
    }
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isEditableTarget(e.target)) {
      e.preventDefault();
      if ($('#searchBackdrop').hidden) openSearchPalette();
      return;
    }
    if (e.key !== 'Escape') return;
    if (!$('#searchBackdrop').hidden) {
      closeSearchPalette();
      return;
    }
    if (!$('#editorBackdrop').hidden) {
      closeEditor();
      return;
    }
    if (!$('#settingsBackdrop').hidden) {
      closeSettings();
      return;
    }
    if (!$('#drawerBackdrop').hidden) {
      closeDrawer();
      return;
    }
    if ($('.app').classList.contains('sidebar-open')) closeSidebar();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSave();
  });

  window.addEventListener('beforeunload', () => {
    if (!dirty || isGithubMode()) return;
    fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.data),
      keepalive: true,
    }).catch(() => {});
  });
}

/* ---------- 启动 ---------- */
async function init() {
  GH.config = readGithubConfig();
  bindStaticIcons();
  bindEvents();
  initSidebarResize();
  await loadData();
  renderAll();
}

init();
