const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('\n📊 Список пользователей в базе данных:\n');
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  if (users.length === 0) {
    console.log('❌ Пользователей нет в базе данных');
  } else {
    console.table(users);
    console.log(`\n✅ Всего пользователей: ${users.length}\n`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
