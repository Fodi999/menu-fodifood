#!/bin/bash

# Цвета для терминала
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

clear

echo -e "${BOLD}${YELLOW}"
cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════════════╗
║               🍣 FODI SUSHI - АРХИТЕКТУРА ПРОЕКТА                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────────────────┐"
echo -e "│${BOLD}                    FRONTEND (Next.js 15 + React 19)${NC}${CYAN}                     │"
echo -e "└─────────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

echo -e "${GREEN}📁 СТРУКТУРА ПРОЕКТА:${NC}"
echo ""
tree -L 3 -I 'node_modules|.next|.git' --charset ascii | head -50
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}🔧 ОСНОВНЫЕ КОМПОНЕНТЫ:${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} ${BOLD}src/app/layout.tsx${NC}         - Root layout (Server Component)"
echo -e "  ${GREEN}✓${NC} ${BOLD}src/app/providers.tsx${NC}      - Client providers wrapper"
echo -e "  ${GREEN}✓${NC} ${BOLD}src/contexts/AuthContext${NC}   - JWT authentication state"
echo -e "  ${GREEN}✓${NC} ${BOLD}src/middleware.ts${NC}          - Route protection (JWT)"
echo ""

echo -e "${YELLOW}📄 СТРАНИЦЫ:${NC}"
echo ""
echo -e "  ${CYAN}Публичные:${NC}"
echo -e "    • ${BOLD}/auth/signin${NC}        - Вход (→ Go API /api/auth/login)"
echo -e "    • ${BOLD}/auth/signup${NC}        - Регистрация (→ Go API /api/auth/register)"
echo ""
echo -e "  ${CYAN}Защищённые:${NC}"
echo -e "    • ${BOLD}/profile${NC}            - Личный кабинет (→ Go API /api/profile)"
echo ""
echo -e "  ${CYAN}Админ:${NC}"
echo -e "    • ${BOLD}/admin${NC}              - Dashboard (→ Go API /api/admin/stats)"
echo -e "    • ${BOLD}/admin/users${NC}        - Пользователи (→ Go API /api/admin/users)"
echo -e "    • ${BOLD}/admin/orders${NC}       - Заказы (→ Go API /api/admin/orders)"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}🗄️  БАЗА ДАННЫХ (PostgreSQL - Neon):${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} User         - Пользователи (user/admin)"
echo -e "  ${GREEN}✓${NC} Product      - Продукты (роллы, суши)"
echo -e "  ${GREEN}✓${NC} Order        - Заказы"
echo -e "  ${GREEN}✓${NC} OrderItem    - Позиции заказа"
echo -e "  ${GREEN}✓${NC} Ingredient   - Ингредиенты"
echo -e "  ${GREEN}✓${NC} StockItem    - Складские остатки"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}📦 TECH STACK:${NC}"
echo ""
echo -e "  ${CYAN}Frontend:${NC}"
echo -e "    • Next.js 15.5.4"
echo -e "    • React 19.2.0"
echo -e "    • TypeScript 5.x"
echo -e "    • Tailwind CSS 4.0"
echo -e "    • i18next (RU/EN/PL)"
echo ""
echo -e "  ${CYAN}Backend (В разработке):${NC}"
echo -e "    • ${RED}⏳${NC} Go 1.21+"
echo -e "    • ${RED}⏳${NC} Gin/Echo framework"
echo -e "    • ${RED}⏳${NC} JWT Authentication"
echo -e "    • ${RED}⏳${NC} REST API"
echo ""
echo -e "  ${CYAN}Database:${NC}"
echo -e "    • PostgreSQL (Neon Cloud)"
echo -e "    • Prisma ORM"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}📊 ТЕКУЩИЙ СТАТУС:${NC}"
echo ""
echo -e "  ${GREEN}✅ ГОТОВО:${NC}"
echo -e "    • NextAuth.js удалён"
echo -e "    • AuthContext создан (JWT)"
echo -e "    • Все страницы переписаны под Go API"
echo -e "    • Middleware защищает роуты"
echo ""
echo -e "  ${RED}⏳ TODO:${NC}"
echo -e "    • Разработать Go API сервер"
echo -e "    • Реализовать JWT авторизацию"
echo -e "    • Создать API endpoints"
echo -e "    • Подключить к PostgreSQL"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}📚 ДОКУМЕНТАЦИЯ:${NC}"
echo ""
ls -1 *.md | while read file; do
    echo -e "  ${CYAN}•${NC} ${BOLD}$file${NC}"
done
echo ""

echo -e "${GREEN}${BOLD}Проект готов к интеграции с Go backend! 🚀${NC}"
echo ""
