# 🔍 Инструкция: Как передать логи DevTools

## 🎯 Способ 1: Копировать вручную (самый простой)

1. **Откройте DevTools:**
   - Windows/Linux: `F12` или `Ctrl+Shift+I`
   - macOS: `Cmd+Option+I`

2. **Перейдите на вкладку Console**

3. **Скопируйте ошибки:**
   - Выделите нужные сообщения
   - ПКМ → "Copy all messages" или `Cmd+C`
   - Вставьте в чат с Copilot

## 🤖 Способ 2: Автоматический логгер (установлен!)

Я добавил автоматический логгер ошибок в ваше приложение!

### Как использовать:

1. **Откройте сайт в браузере**
   ```
   http://localhost:3000
   ```

2. **Откройте DevTools Console (F12)**

3. **Используйте команды:**

   ```javascript
   // Посмотреть все собранные логи
   window.errorLogger.getLogs()
   
   // Скачать логи как JSON файл
   window.errorLogger.downloadLogs()
   
   // Очистить логи
   window.errorLogger.clearLogs()
   
   // Экспортировать логи как JSON строку
   window.errorLogger.exportLogs()
   ```

4. **Ручное логирование:**
   ```javascript
   // Залогировать ошибку
   window.errorLogger.logError("Что-то пошло не так", { details: "..." })
   
   // Залогировать предупреждение
   window.errorLogger.logWarning("Внимание!")
   
   // Залогировать информацию
   window.errorLogger.logInfo("Информация")
   ```

### 📊 Что логгер собирает автоматически:

- ✅ Все необработанные JavaScript ошибки
- ✅ Необработанные Promise rejections
- ✅ Timestamp каждой ошибки
- ✅ Stack trace
- ✅ URL страницы где произошла ошибка
- ✅ User Agent браузера

### 📥 Как отправить мне логи:

**Вариант A: Скачать файл**
```javascript
window.errorLogger.downloadLogs()
```
Затем откройте скачанный JSON файл и вставьте содержимое в чат.

**Вариант B: Скопировать из консоли**
```javascript
console.log(window.errorLogger.exportLogs())
```
Скопируйте вывод и вставьте мне.

## 📱 Способ 3: Network инспектор

Если проблема с API запросами:

1. **DevTools → Network tab**
2. **Воспроизведите ошибку**
3. **Найдите красный (failed) запрос**
4. **ПКМ → Copy → Copy as cURL**
5. **Вставьте мне**

Или:
- **ПКМ → Copy → Copy response**
- **Отправьте ответ сервера**

## 🎨 Способ 4: Screenshot

Если ошибка визуальная:

1. **Сделайте скриншот DevTools:**
   - macOS: `Cmd+Shift+4`
   - Windows: `Win+Shift+S`

2. **Приложите скриншот в чат**

## 🔧 Способ 5: React DevTools

Для проблем с React компонентами:

1. **Установите React DevTools** (если еще нет)
   - [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

2. **Откройте вкладку "Components" или "Profiler"**

3. **Найдите проблемный компонент**

4. **Скопируйте props/state и отправьте мне**

## 📋 Быстрая шпаргалка команд

```javascript
// В консоли браузера:

// Скачать все логи
window.errorLogger.downloadLogs()

// Посмотреть последние ошибки
window.errorLogger.getLogs()

// Очистить логи
window.errorLogger.clearLogs()

// Залогировать что-то специально
window.errorLogger.logError("Custom error")
```

## 🎯 Что мне присылать:

### При ошибке на странице:
1. ❌ Текст ошибки из Console
2. 📍 URL страницы где произошла ошибка
3. 🔍 Stack trace (если есть)
4. 📊 Результат `window.errorLogger.getLogs()`

### При проблеме с API:
1. 🌐 URL запроса
2. 📤 Отправленные данные (Request payload)
3. 📥 Полученный ответ (Response)
4. ⚠️ Статус код (404, 500, etc.)

### При визуальной проблеме:
1. 🖼️ Скриншот
2. 🌐 Браузер и версия
3. 📱 Размер экрана

---

## ⚡ Быстрый старт прямо сейчас:

1. Откройте http://localhost:3000 (или ваш Vercel URL)
2. Нажмите F12
3. Введите в Console:
   ```javascript
   window.errorLogger.getLogs()
   ```
4. Скопируйте результат и отправьте мне!

---

**Создано:** 10 октября 2025  
**Версия:** 1.0
