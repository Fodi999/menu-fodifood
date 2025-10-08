# Развертывание на Vercel

## Подготовка к развертыванию

### 1. Установите Vercel CLI
```bash
npm i -g vercel
```

### 2. Войдите в Vercel
```bash
vercel login
```

### 3. Первичное развертывание
Из корневой папки проекта:
```bash
vercel
```

При первом развертывании Vercel спросит:
- **Set up and deploy "menu-fodifood"?** → Y
- **Which scope do you want to deploy to?** → Выберите свой аккаунт
- **Link to existing project?** → N (для нового проекта)
- **What's your project's name?** → menu-fodifood
- **In which directory is your code located?** → ./

### 4. Настройка переменных окружения

В панели Vercel (https://vercel.com/dashboard) перейдите в:
**Project Settings → Environment Variables**

Добавьте следующие переменные:

#### Production Variables:
- `NEXT_PUBLIC_API_URL` = `https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app`
- `NEXTAUTH_URL` = `https://menu-fodifood.vercel.app` (или ваш кастомный домен)
- `NEXTAUTH_SECRET` = `j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=`

#### Preview Variables (для тестовых веток):
- `NEXT_PUBLIC_API_URL` = `https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app`
- `NEXTAUTH_URL` = `https://your-preview-url.vercel.app`
- `NEXTAUTH_SECRET` = `j+fkqjtR1vl6b6WzE+UISqGX211x6VMNcH0Vil/S/nw=`

### 5. Повторное развертывание
После изменений:
```bash
vercel --prod
```

### 6. Автоматическое развертывание через Git
Подключите GitHub репозиторий к Vercel для автоматического развертывания при push.

## Проверка работы

После развертывания проверьте:
1. Открывается ли сайт
2. Работают ли API вызовы к бекенду на Koyeb
3. Корректно ли работает аутентификация
4. Загружаются ли изображения

## Возможные проблемы и решения

### CORS ошибки
Если возникают CORS ошибки, убедитесь что в Go бекенде на Koyeb настроены правильные Origins:
```go
// Должен включать ваш Vercel домен
c.Header("Access-Control-Allow-Origin", "https://menu-fodifood.vercel.app")
```

### Проблемы с переменными окружения
- Проверьте что все переменные добавлены в Vercel Dashboard
- Убедитесь что `NEXT_PUBLIC_` префикс используется для клиентских переменных
- После изменения переменных сделайте redeploy

### Проблемы с билдом
- Проверьте логи билда в Vercel Dashboard
- Убедитесь что все зависимости установлены корректно
- Проверьте TypeScript ошибки

## Команды для разработки

```bash
# Локальная разработка
npm run dev

# Билд для продакшена
npm run build

# Запуск продакшен версии локально
npm run start

# Линтинг
npm run lint
```
