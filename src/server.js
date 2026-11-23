import http from 'node:http';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { itemService } from './services/item.service.js';

await connectDB();

async function readJsonBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
  }
  return raw ? JSON.parse(raw) : {};
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${config.port}`);
  const segments = url.pathname.split('/').filter(Boolean);

  res.setHeader('Content-Type', 'application/json');

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      res.writeHead(200);
      return res.end(
        JSON.stringify({ status: 'ok', env: config.env, dbName: config.dbName })
      );
    }

    if (segments[0] === 'items') {
      const id = segments[1];

      if (req.method === 'GET' && !id) {
        const items = await itemService.getAllItems();
        res.writeHead(200);
        return res.end(JSON.stringify(items));
      }

      if (req.method === 'POST' && !id) {
        const body = await readJsonBody(req);
        const created = await itemService.createItem(body);
        res.writeHead(201);
        return res.end(JSON.stringify(created));
      }

      if (req.method === 'GET' && id) {
        const item = await itemService.getItemById(id);
        if (!item) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: 'Item not found' }));
        }
        res.writeHead(200);
        return res.end(JSON.stringify(item));
      }

      if (req.method === 'PATCH' && id) {
        const body = await readJsonBody(req);
        const updated = await itemService.updateItem(id, body);
        if (!updated) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: 'Item not found' }));
        }
        res.writeHead(200);
        return res.end(JSON.stringify(updated));
      }

      if (req.method === 'DELETE' && id) {
        const deleted = await itemService.deleteItem(id);
        if (!deleted) {
          res.writeHead(404);
          return res.end(JSON.stringify({ error: 'Item not found' }));
        }
        res.writeHead(200);
        return res.end(JSON.stringify({ deleted: true, id }));
      }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  } catch (error) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(config.port, () => {
  console.log(`[${config.env}] Server running on http://localhost:${config.port}`);
});