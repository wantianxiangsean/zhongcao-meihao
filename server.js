const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');
const IMAGE_DIR = path.join(DATA_DIR, 'images');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const BACKUP_FILE = path.join(DATA_DIR, 'data.backup.json');
const PORT = Number(process.env.PORT || 4321);

fs.mkdirSync(IMAGE_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function emptyData() {
  return { version: 1, entries: [], locations: [] };
}

function readData() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!parsed || !Array.isArray(parsed.entries) || !Array.isArray(parsed.locations)) {
      return emptyData();
    }
    return parsed;
  } catch {
    return emptyData();
  }
}

function writeData(data) {
  const text = JSON.stringify(data, null, 2);
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, text);
  try {
    if (fs.existsSync(DATA_FILE)) fs.copyFileSync(DATA_FILE, BACKUP_FILE);
  } catch {}
  fs.renameSync(tmp, DATA_FILE);
}

function send(res, code, body, type) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
  res.writeHead(code, {
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Content-Length': buf.length,
    'Cache-Control': 'no-store',
  });
  res.end(buf);
}

function sendJson(res, code, obj) {
  send(res, code, JSON.stringify(obj), 'application/json; charset=utf-8');
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('请求内容过大'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, buf) => {
    if (err) return send(res, 404, 'Not found');
    const ext = path.extname(filePath).toLowerCase();
    const noCache = ['.html', '.js', '.css', '.json'].includes(ext);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': buf.length,
      'Cache-Control': noCache ? 'no-store' : 'public, max-age=86400',
    });
    res.end(buf);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return send(res, 400, 'Bad request');
  }

  try {
    if (pathname === '/api/data') {
      if (req.method === 'GET') {
        return sendJson(res, 200, readData());
      }
      if (req.method === 'PUT') {
        let data;
        try {
          data = JSON.parse(await readBody(req, 50 * 1024 * 1024));
        } catch {
          return sendJson(res, 400, { error: '数据格式不正确' });
        }
        if (!data || !Array.isArray(data.entries) || !Array.isArray(data.locations)) {
          return sendJson(res, 400, { error: '数据结构不正确' });
        }
        writeData({ version: 1, entries: data.entries, locations: data.locations });
        return sendJson(res, 200, { ok: true });
      }
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    if (pathname === '/api/images' && req.method === 'POST') {
      let payload;
      try {
        payload = JSON.parse(await readBody(req, 12 * 1024 * 1024));
      } catch {
        return sendJson(res, 400, { error: '图片数据格式不正确' });
      }
      const match = /^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=\s]+)$/.exec(payload.dataUrl || '');
      if (!match) return sendJson(res, 400, { error: '只支持 PNG / JPG / WebP / GIF 图片' });
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const name = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
      fs.writeFileSync(path.join(IMAGE_DIR, name), Buffer.from(match[2], 'base64'));
      return sendJson(res, 200, { url: '/images/' + name });
    }

    if (pathname.startsWith('/images/') && req.method === 'GET') {
      const name = path.basename(pathname);
      const filePath = path.join(IMAGE_DIR, name);
      if (!fs.existsSync(filePath)) return send(res, 404, 'Not found');
      return serveFile(res, filePath);
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      const rel = pathname === '/' ? '/index.html' : pathname;
      const filePath = path.resolve(PUBLIC_DIR, '.' + rel);
      if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== PUBLIC_DIR) {
        return send(res, 403, 'Forbidden');
      }
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return serveFile(res, filePath);
      }
      return serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
    }

    send(res, 405, 'Method not allowed');
  } catch (err) {
    console.error(err);
    if (!res.headersSent) sendJson(res, 500, { error: '服务器错误' });
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用。可以关闭占用它的程序，或用 PORT=4322 npm start 换一个端口。`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log('');
  console.log('  种草美好 · 美食与远方');
  console.log(`  已启动：http://localhost:${PORT}`);
  console.log('  数据保存在本目录的 data 文件夹里，关闭此窗口即停止网站。');
  console.log('');
});
