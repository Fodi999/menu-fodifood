# 🚀 MCP Server для FODI SUSHI

MCP (Model Context Protocol) сервер для мониторинга ошибок приложения FODI SUSHI в реальном времени.

## 📋 Что это дает?

GitHub Copilot сможет **напрямую получать** логи вашего приложения через MCP протокол:
- ✅ Автоматический доступ к ошибкам
- ✅ Real-time мониторинг
- ✅ Статистика по логам
- ✅ Экспорт в Markdown

## 🔧 Установка

### 1. Установите зависимости

```bash
cd mcp-server
npm install
```

### 2. Запустите сервер

```bash
# Development mode с hot reload
npm run dev

# Production mode
npm run build
npm start
```

Сервер запустится на:
- **HTTP API:** http://localhost:3001
- **WebSocket:** ws://localhost:3001
- **MCP:** stdio transport

## 🔌 Подключение к фронтенду

Обновите `errorLogger.ts` чтобы отправлять логи на MCP сервер:

```typescript
// В src/lib/errorLogger.ts
private async sendToServer(error: ErrorLog) {
  try {
    await fetch('http://localhost:3001/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    });
  } catch (err) {
    console.error('Failed to send error to MCP server:', err);
  }
}
```

## 🎯 Использование в Claude Desktop / Copilot

### Настройка MCP в Claude Desktop

Добавьте в `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fodi-sushi-monitor": {
      "command": "node",
      "args": ["/Users/dmitrijfomin/Desktop/menu-fodifood/mcp-server/dist/index.js"]
    }
  }
}
```

### Доступные инструменты

После подключения Copilot сможет использовать:

#### 1. `get_logs` - Получить логи
```typescript
// Copilot может вызвать:
get_logs({ limit: 10, type: "error" })
```

#### 2. `get_stats` - Статистика
```typescript
// Copilot получит:
{
  total: 25,
  errors: 5,
  warnings: 10,
  info: 10
}
```

#### 3. `export_logs_markdown` - Экспорт
```typescript
// Copilot получит красиво форматированный Markdown
```

#### 4. `clear_logs` - Очистить
```typescript
// Очистить все логи
```

## 🌐 HTTP API

Можно использовать напрямую через HTTP:

```bash
# Отправить лог
curl -X POST http://localhost:3001/api/log \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-10-10T15:30:00Z",
    "message": "Test error",
    "type": "error",
    "url": "http://localhost:3000",
    "userAgent": "Mozilla/5.0..."
  }'

# Получить логи
curl http://localhost:3001/api/logs

# Получить статистику
curl http://localhost:3001/api/stats
```

## 📡 WebSocket

Подключитесь для real-time обновлений:

```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'initial_logs') {
    console.log('Начальные логи:', data.logs);
  }
  
  if (data.type === 'new_log') {
    console.log('Новый лог:', data.log);
  }
};
```

## 🔒 Production deployment

Для production разверните на:
- Railway
- Render
- Fly.io
- Heroku

Установите переменную окружения:
```bash
HTTP_PORT=3001  # или любой другой порт
```

## 📊 Архитектура

```
┌─────────────┐
│  Frontend   │
│ (Vercel)    │
└──────┬──────┘
       │ HTTP POST /api/log
       ▼
┌─────────────┐      ┌──────────────┐
│ MCP Server  │◄────►│   Copilot    │
│ (Node.js)   │ MCP  │   (Claude)   │
└─────────────┘      └──────────────┘
       │
       │ WebSocket
       ▼
┌─────────────┐
│  Dashboard  │
│  (Optional) │
└─────────────┘
```

## 🛠️ Разработка

```bash
# Установка
npm install

# Разработка с hot reload
npm run dev

# Сборка
npm run build

# Запуск production
npm start

# Watch mode
npm run watch
```

## 📝 Логи формата

```typescript
interface ErrorLog {
  timestamp: string;      // ISO 8601
  message: string;        // Текст ошибки
  stack?: string;         // Stack trace
  url: string;           // URL страницы
  userAgent: string;     // User agent
  type: 'error' | 'warning' | 'info';
}
```

## 🎯 Примеры использования

### Copilot автоматически получит доступ к:

1. **Последние ошибки:**
   ```
   "Покажи мне последние 5 ошибок"
   → Copilot вызовет get_logs({limit: 5, type: "error"})
   ```

2. **Статистика:**
   ```
   "Сколько ошибок было сегодня?"
   → Copilot вызовет get_stats()
   ```

3. **Анализ:**
   ```
   "Проанализируй последние ошибки"
   → Copilot получит логи и проанализирует
   ```

## 🔗 Ссылки

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop](https://claude.ai/download)

---

**Создано:** 10 октября 2025  
**Версия:** 1.0.0  
**Статус:** 🚧 В разработке
