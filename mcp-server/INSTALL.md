# 🚀 Быстрая установка MCP Server

## 📋 Что это дает?

GitHub Copilot сможет **автоматически видеть** все ошибки вашего приложения в реальном времени!

## ⚡ Установка (3 шага)

### Шаг 1: Установите зависимости

```bash
cd mcp-server
npm install
```

### Шаг 2: Запустите сервер

```bash
npm run dev
```

Вы увидите:
```
🌐 HTTP/WebSocket server running on http://localhost:3001
📝 POST logs to: http://localhost:3001/api/log
🚀 MCP Server для FODI SUSHI запущен!
```

### Шаг 3: Запустите фронтенд (в другом терминале)

```bash
cd ..
npm run dev
```

## ✅ Готово!

Теперь:
- ✅ Все ошибки **автоматически** отправляются на MCP сервер
- ✅ Copilot может **сам** запросить логи через MCP протокол
- ✅ Real-time мониторинг через WebSocket

## 🎯 Проверка работы

### 1. Откройте приложение
```
http://localhost:3000
```

### 2. Создайте тестовую ошибку

В консоли браузера (F12):
```javascript
window.errorLogger.logError("Тестовая ошибка для MCP")
```

### 3. Проверьте MCP сервер

Откройте терминал где запущен MCP сервер, вы увидите:
```
📝 New log added: error - Тестовая ошибка для MCP
```

### 4. Проверьте через HTTP API

```bash
curl http://localhost:3001/api/logs | jq
```

## 🔌 Подключение Copilot (опционально)

Для автоматического доступа Copilot к логам через MCP:

### Для Claude Desktop:

Отредактируйте файл:
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Добавьте:
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

Затем:
1. Перезапустите Claude Desktop
2. Copilot сможет вызывать `get_logs()`, `get_stats()` и другие инструменты

## 📊 Команды для проверки

```bash
# Получить все логи
curl http://localhost:3001/api/logs

# Получить статистику
curl http://localhost:3001/api/stats

# Отправить тестовый лог
curl -X POST http://localhost:3001/api/log \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2025-10-10T15:30:00Z",
    "message": "Test from curl",
    "type": "error",
    "url": "http://localhost:3000",
    "userAgent": "curl"
  }'
```

## 🔧 Полезные команды

```bash
# Установка
cd mcp-server && npm install

# Разработка (hot reload)
npm run dev

# Сборка для production
npm run build

# Запуск production
npm start

# Watch mode
npm run watch
```

## 🌐 Переменные окружения

Создайте `.env` в папке `mcp-server`:

```bash
# Порт HTTP сервера
HTTP_PORT=3001

# В production
NODE_ENV=production
```

Создайте `.env.local` в корне проекта:

```bash
# URL MCP сервера
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3001
```

## 🎯 Что происходит?

```
1. Ошибка в браузере
   ↓
2. errorLogger перехватывает
   ↓
3. Отправка на MCP server (localhost:3001)
   ↓
4. MCP server сохраняет в памяти
   ↓
5. Copilot может запросить через MCP protocol
```

## 🚨 Troubleshooting

### MCP сервер не запускается?

```bash
# Проверьте Node.js версию (нужна 18+)
node --version

# Переустановите зависимости
cd mcp-server
rm -rf node_modules package-lock.json
npm install
```

### Логи не отправляются?

```bash
# Проверьте что MCP сервер запущен
curl http://localhost:3001/api/stats

# Проверьте консоль браузера на ошибки
# Должны видеть: "📤 Log sent to MCP server"
```

### Порт 3001 занят?

```bash
# Измените порт в mcp-server/.env
HTTP_PORT=3002

# И обновите NEXT_PUBLIC_MCP_SERVER_URL
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3002
```

---

**Создано:** 10 октября 2025  
**Статус:** ✅ Готово к использованию
