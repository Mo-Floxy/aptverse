const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomBytes } = require("crypto");

const root = __dirname;
const rooms = new Map();
const files = {
  "/": "index.html",
  "/index.html": "index.html",
  "/index.js": "index.js",
  "/style.css": "style.css",
  "/favicon.svg": "favicon.svg",
};
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

function send(response, status, body, type = "application/json") {
  response.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  response.end(type === "application/json" ? JSON.stringify(body) : body);
}
function readJson(request) {
  return new Promise((resolve, reject) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
      if (data.length > 100000) request.destroy();
    });
    request.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}
function room(id) {
  return rooms.get(id.toUpperCase());
}
function publicRoom(value) {
  return {
    offer: value.offer || null,
    answer: value.answer || null,
    candidates: value.candidates || [],
    ended: Boolean(value.ended),
  };
}

const CHAT_MODEL = "claude-sonnet-5";
const MAX_REPLY_TOKENS = 300;

function buildChatSystemPrompt(contact) {
  const name = (contact && contact.name) || "a friend";
  const role =
    (contact && contact.role) || "a member of the APTverse community";
  return [
    `You are ${name}, ${role}, chatting one-on-one over DM with Mo Flourish,`,
    `a software engineering student at Aptech Learning Lagos.`,
    `Reply the way a real person would text: short, casual, 1-3 sentences,`,
    `matching the tone and topic of what Mo just said. Stay fully in character as ${name}`,
    `and never mention that you are an AI or a language model. Do not use markdown formatting.`,
  ].join(" ");
}

function toApiMessages(history) {
  const mapped = (Array.isArray(history) ? history : [])
    .filter((m) => m && typeof m.text === "string" && m.text.trim())
    .slice(-14)
    .map((m) => ({
      role: m.from === "me" ? "user" : "assistant",
      content: m.text.trim(),
    }));
  const merged = [];
  for (const m of mapped) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += "\n" + m.content;
    else merged.push({ role: m.role, content: m.content });
  }
  while (merged.length && merged[0].role !== "user") merged.shift();
  return merged;
}

async function requestChatReply(contact, history) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const error = new Error(
      "ANTHROPIC_API_KEY is not set on the server. Set it before starting server.js to enable AI replies.",
    );
    error.status = 500;
    throw error;
  }
  const messages = toApiMessages(history);
  if (!messages.length) {
    const error = new Error("No usable message history to reply to.");
    error.status = 400;
    throw error;
  }
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      max_tokens: MAX_REPLY_TOKENS,
      system: buildChatSystemPrompt(contact),
      messages,
    }),
  });
  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    const error = new Error(
      (data && data.error && data.error.message) ||
        "Anthropic API request failed",
    );
    error.status = upstream.status;
    throw error;
  }
  const reply = (data.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
  if (!reply) {
    const error = new Error("Anthropic API returned an empty reply");
    error.status = 502;
    throw error;
  }
  return reply;
}

setInterval(
  () => {
    const expiry = Date.now() - 60 * 60 * 1000;
    for (const [id, value] of rooms)
      if (value.updatedAt < expiry) rooms.delete(id);
  },
  10 * 60 * 1000,
).unref();

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    try {
      if (request.method === "POST" && url.pathname === "/api/chat-reply") {
        const body = await readJson(request);
        try {
          const reply = await requestChatReply(body.contact, body.history);
          return send(response, 200, { reply });
        } catch (error) {
          return send(response, error.status || 500, {
            error: error.message || "Chat reply failed",
          });
        }
      }
      if (request.method === "POST" && url.pathname === "/api/calls") {
        let id;
        do {
          id = randomBytes(4).toString("hex").toUpperCase();
        } while (rooms.has(id));
        rooms.set(id, {
          offer: null,
          answer: null,
          candidates: [],
          ended: false,
          updatedAt: Date.now(),
        });
        return send(response, 201, { id });
      }
      const match = url.pathname.match(
        /^\/api\/calls\/([A-Z0-9]+)(?:\/(offer|answer|candidates|end))?$/i,
      );
      if (match) {
        const [, id, action] = match;
        const call = room(id);
        if (!call) return send(response, 404, { error: "Call not found" });
        if (request.method === "GET")
          return send(response, 200, publicRoom(call));
        const body = await readJson(request);
        call.updatedAt = Date.now();
        if (action === "offer") call.offer = body.offer;
        else if (action === "answer") call.answer = body.answer;
        else if (action === "candidates")
          call.candidates.push({ side: body.side, candidate: body.candidate });
        else if (action === "end") call.ended = true;
        else return send(response, 400, { error: "Unsupported call action" });
        return send(response, 200, publicRoom(call));
      }
      const file = files[url.pathname];
      if (!file || request.method !== "GET")
        return send(response, 404, "Not found", "text/plain; charset=utf-8");
      const filePath = path.join(root, file);
      return fs.readFile(filePath, (error, data) =>
        error
          ? send(response, 404, "Not found", "text/plain; charset=utf-8")
          : send(
              response,
              200,
              data,
              types[path.extname(file)] || "application/octet-stream",
            ),
      );
    } catch (error) {
      send(response, 400, { error: error.message });
    }
  })
  .listen(process.env.PORT || 4173, () =>
    console.log(
      `APTverse running at http://localhost:${process.env.PORT || 4173}`,
    ),
  );
