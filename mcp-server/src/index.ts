#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';

// Типы для логов
interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  type: 'error' | 'warning' | 'info';
}

// Хранилище логов
class LogStore {
  private logs: ErrorLog[] = [];
  private maxLogs = 1000;

  addLog(log: ErrorLog) {
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    console.log(`📝 New log added: ${log.type} - ${log.message}`);
  }

  getLogs(limit?: number): ErrorLog[] {
    if (limit) {
      return this.logs.slice(-limit);
    }
    return [...this.logs];
  }

  getErrorLogs(): ErrorLog[] {
    return this.logs.filter(log => log.type === 'error');
  }

  getWarningLogs(): ErrorLog[] {
    return this.logs.filter(log => log.type === 'warning');
  }

  clearLogs() {
    this.logs = [];
  }

  getStats() {
    return {
      total: this.logs.length,
      errors: this.logs.filter(log => log.type === 'error').length,
      warnings: this.logs.filter(log => log.type === 'warning').length,
      info: this.logs.filter(log => log.type === 'info').length,
    };
  }
}

const logStore = new LogStore();

// Создаем MCP сервер
const server = new Server(
  {
    name: "menu-fodifood-monitor",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Регистрируем инструменты (tools)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_logs",
        description: "Получить логи ошибок из приложения FODI SUSHI",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Количество последних логов (по умолчанию все)",
            },
            type: {
              type: "string",
              enum: ["all", "error", "warning", "info"],
              description: "Тип логов для фильтрации",
            },
          },
        },
      },
      {
        name: "get_stats",
        description: "Получить статистику по логам",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "clear_logs",
        description: "Очистить все логи",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "export_logs_markdown",
        description: "Экспортировать логи в формате Markdown",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Количество последних логов",
            },
          },
        },
      },
    ],
  };
});

// Обработка вызовов инструментов
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_logs": {
      const limit = args?.limit as number | undefined;
      const type = (args?.type as string) || "all";

      let logs: ErrorLog[];
      if (type === "error") {
        logs = logStore.getErrorLogs();
      } else if (type === "warning") {
        logs = logStore.getWarningLogs();
      } else {
        logs = logStore.getLogs(limit);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(logs, null, 2),
          },
        ],
      };
    }

    case "get_stats": {
      const stats = logStore.getStats();
      return {
        content: [
          {
            type: "text",
            text: `📊 Статистика логов FODI SUSHI:\n\n` +
                  `Всего логов: ${stats.total}\n` +
                  `❌ Ошибок: ${stats.errors}\n` +
                  `⚠️ Предупреждений: ${stats.warnings}\n` +
                  `ℹ️ Информационных: ${stats.info}`,
          },
        ],
      };
    }

    case "clear_logs": {
      logStore.clearLogs();
      return {
        content: [
          {
            type: "text",
            text: "✅ Все логи очищены",
          },
        ],
      };
    }

    case "export_logs_markdown": {
      const limit = args?.limit as number | undefined;
      const logs = logStore.getLogs(limit);

      let markdown = '# 📊 Error Logs - FODI SUSHI\n\n';
      markdown += `**Total Logs:** ${logs.length}\n`;
      markdown += `**Generated:** ${new Date().toLocaleString('ru-RU')}\n\n`;
      markdown += '---\n\n';

      logs.forEach((log, index) => {
        const emoji = log.type === 'error' ? '❌' : log.type === 'warning' ? '⚠️' : 'ℹ️';
        
        markdown += `## ${emoji} Log #${index + 1}\n\n`;
        markdown += `**Time:** ${new Date(log.timestamp).toLocaleString('ru-RU')}\n`;
        markdown += `**Type:** ${log.type}\n`;
        markdown += `**URL:** ${log.url}\n`;
        markdown += `**Message:**\n\`\`\`\n${log.message}\n\`\`\`\n\n`;
        
        if (log.stack) {
          markdown += `**Stack Trace:**\n\`\`\`\n${log.stack}\n\`\`\`\n\n`;
        }
        
        markdown += `**User Agent:** ${log.userAgent}\n\n`;
        markdown += '---\n\n';
      });

      return {
        content: [
          {
            type: "text",
            text: markdown,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Регистрируем ресурсы
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "logs://current",
        name: "Current Application Logs",
        description: "Текущие логи приложения FODI SUSHI",
        mimeType: "application/json",
      },
      {
        uri: "logs://stats",
        name: "Log Statistics",
        description: "Статистика по логам",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "logs://current") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(logStore.getLogs(), null, 2),
        },
      ],
    };
  }

  if (uri === "logs://stats") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(logStore.getStats(), null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// HTTP API для приема логов от фронтенда
const app = express();
app.use(cors());
app.use(express.json());

// Endpoint для приема логов
app.post('/api/log', (req, res) => {
  const log = req.body as ErrorLog;
  logStore.addLog(log);
  
  // Отправляем через WebSocket всем подключенным клиентам
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify({ type: 'new_log', log }));
    }
  });
  
  res.json({ success: true });
});

// Endpoint для получения логов через HTTP
app.get('/api/logs', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  res.json(logStore.getLogs(limit));
});

// Endpoint для статистики
app.get('/api/stats', (req, res) => {
  res.json(logStore.getStats());
});

// Создаем HTTP сервер
const httpServer = http.createServer(app);

// WebSocket сервер для real-time обновлений
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket connection');
  
  // Отправляем текущие логи при подключении
  ws.send(JSON.stringify({
    type: 'initial_logs',
    logs: logStore.getLogs(50),
  }));
});

// Запускаем HTTP сервер
const HTTP_PORT = process.env.HTTP_PORT || 3001;
httpServer.listen(HTTP_PORT, () => {
  console.log(`🌐 HTTP/WebSocket server running on http://localhost:${HTTP_PORT}`);
  console.log(`📝 POST logs to: http://localhost:${HTTP_PORT}/api/log`);
});

// Запускаем MCP сервер через stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("🚀 MCP Server для FODI SUSHI запущен!");
  console.log("📊 Доступные инструменты:");
  console.log("  - get_logs: получить логи");
  console.log("  - get_stats: статистика");
  console.log("  - clear_logs: очистить логи");
  console.log("  - export_logs_markdown: экспорт в Markdown");
}

main().catch((error) => {
  console.error("❌ Server error:", error);
  process.exit(1);
});
