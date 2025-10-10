# 🚀 БЫСТРЫЙ СТАРТ: Отправка логов Copilot

## ⚡ СУПЕР ПРОСТО (1 команда!)

### 1️⃣ Откройте сайт и DevTools
```
http://localhost:3000  (или https://menu-fodifood.vercel.app)
Нажмите: F12
```

### 2️⃣ В Console выполните:
```javascript
window.errorLogger.copyAsMarkdown()
```

### 3️⃣ Вставьте в чат с Copilot
```
Cmd+V  (macOS)  или  Ctrl+V  (Windows)
```

## ✅ Готово! Я получу:
- ❌ Все ошибки с временными метками
- 📍 URL где произошла ошибка
- 📚 Stack trace для каждой ошибки
- 🌐 Информацию о браузере
- 📊 Красиво отформатированный Markdown

---

## 🎯 Другие полезные команды

```javascript
// Показать в консоли (для ручного копирования)
window.errorLogger.printMarkdown()

// Скачать как файл .md
window.errorLogger.downloadAsMarkdown()

// Посмотреть все ошибки (JSON)
window.errorLogger.getLogs()

// Очистить логи
window.errorLogger.clearLogs()
```

---

## 🎁 Бонус: Как отправить конкретную ошибку

Если видите ошибку в консоли:

```javascript
// Просто скопируйте текст ошибки и оберните в ```
```

Пример:
````
Вот ошибка которую я получил:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'name')
    at MainContentDynamic.tsx:82:45
```
````

---

## 📱 Шпаргалка команд

| Что нужно | Команда |
|-----------|---------|
| 📋 Скопировать логи | `window.errorLogger.copyAsMarkdown()` |
| 🖨️ Показать логи | `window.errorLogger.printMarkdown()` |
| 💾 Скачать .md | `window.errorLogger.downloadAsMarkdown()` |
| 🧹 Очистить | `window.errorLogger.clearLogs()` |

---

**Создано:** 10 октября 2025  
**Всё работает автоматически! 🎉**
