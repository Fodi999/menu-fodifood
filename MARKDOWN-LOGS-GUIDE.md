# 📋 Как отправить логи Copilot через Markdown

## 🚀 Самый простой способ (3 команды)

### Вариант 1: Скопировать в буфер обмена
```javascript
// В консоли браузера (F12):
window.errorLogger.copyAsMarkdown()
```
✅ Логи скопированы! Просто нажмите **Cmd+V** (или Ctrl+V) в чате с Copilot!

---

### Вариант 2: Вывести в консоль для копирования
```javascript
// В консоли браузера:
window.errorLogger.printMarkdown()
```
Затем:
1. Выделите весь вывод в консоли
2. Скопируйте (Cmd+C или Ctrl+C)
3. Вставьте в чат с Copilot

---

### Вариант 3: Скачать как .md файл
```javascript
// В консоли браузера:
window.errorLogger.downloadAsMarkdown()
```
Затем:
1. Откройте скачанный файл `error-logs-*.md`
2. Скопируйте все содержимое
3. Вставьте в чат с Copilot

---

## 📊 Пример вывода

После выполнения команды вы получите красиво форматированный Markdown:

```markdown
# 📊 Error Logs

**Total Errors:** 2
**Generated:** 10.10.2025, 15:30:45

---

## ❌ Error #1

**Time:** 10.10.2025, 15:28:12
**Type:** error
**URL:** https://menu-fodifood.vercel.app/
**Message:**
```
Cannot read properties of undefined (reading 'name')
```

**Stack Trace:**
```
Error: Cannot read properties of undefined (reading 'name')
    at MainContentDynamic.tsx:82
    at Array.map (<anonymous>)
    ...
```

**User Agent:** Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)

---
```

## 🎯 Все доступные команды

```javascript
// 📋 Копировать в буфер обмена (РЕКОМЕНДУЕТСЯ!)
window.errorLogger.copyAsMarkdown()

// 🖨️ Вывести в консоль для ручного копирования
window.errorLogger.printMarkdown()

// 💾 Скачать как .md файл
window.errorLogger.downloadAsMarkdown()

// 📄 Скачать как .json файл
window.errorLogger.downloadLogs()

// 👀 Просто посмотреть логи
window.errorLogger.getLogs()

// 🧹 Очистить все логи
window.errorLogger.clearLogs()

// ✍️ Добавить свою ошибку
window.errorLogger.logError("Моя ошибка", { details: "..." })
```

## 🎬 Пошаговая инструкция

### Шаг 1: Откройте DevTools
- **macOS:** Cmd + Option + I
- **Windows/Linux:** F12 или Ctrl + Shift + I

### Шаг 2: Перейдите на вкладку Console

### Шаг 3: Выполните команду
```javascript
window.errorLogger.copyAsMarkdown()
```

### Шаг 4: Вставьте в чат с Copilot
Просто нажмите **Cmd+V** (macOS) или **Ctrl+V** (Windows) в чате!

---

## 💡 Советы

### Если команда не работает:
```javascript
// Проверьте, что логгер загружен:
window.errorLogger

// Если undefined, перезагрузите страницу
location.reload()
```

### Если нужно залогировать что-то специально:
```javascript
// Сначала выполните действие, которое вызывает ошибку
// Затем скопируйте логи:
window.errorLogger.copyAsMarkdown()
```

### Для production (Vercel):
Все команды работают так же! Просто откройте:
```
https://menu-fodifood.vercel.app
```
И выполните те же команды в консоли.

---

## 📱 Быстрая шпаргалка

| Действие | Команда |
|----------|---------|
| 📋 Скопировать Markdown | `window.errorLogger.copyAsMarkdown()` |
| 🖨️ Показать в консоли | `window.errorLogger.printMarkdown()` |
| 💾 Скачать .md | `window.errorLogger.downloadAsMarkdown()` |
| 👀 Посмотреть логи | `window.errorLogger.getLogs()` |
| 🧹 Очистить | `window.errorLogger.clearLogs()` |

---

## 🎁 Дополнительно: Ручное форматирование

Если хотите отправить что-то вручную, просто оберните в код блоки:

````markdown
## Ошибка из консоли

```
Error: Cannot read properties of undefined (reading 'name')
    at page.tsx:123
```

## Network ошибка

```json
{
  "error": "Not found",
  "status": 404
}
```
````

---

**Создано:** 10 октября 2025  
**Статус:** ✅ Готово к использованию
