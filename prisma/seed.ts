import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Создаем администратора
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@fodisushi.com" },
    update: {},
    create: {
      email: "admin@fodisushi.com",
      name: "Администратор",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Создаем тестового пользователя
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      name: "Тестовый пользователь",
      password: userPassword,
      role: "user",
    },
  });
  console.log("✅ Test user created:", user.email);

  // Создаем тестовые продукты
  const products = [
    {
      name: "Филадельфия",
      description: "Классический ролл с лососем и сливочным сыром",
      price: 450,
      imageUrl: "/products/philadelphia.jpg",
      weight: "250г",
      category: "Роллы",
    },
    {
      name: "Калифорния",
      description: "Ролл с крабовым мясом, авокадо и икрой тобико",
      price: 380,
      imageUrl: "/products/california.jpg",
      weight: "240г",
      category: "Роллы",
    },
    {
      name: "Сет Микс",
      description: "Ассорти из популярных роллов - 40 штук",
      price: 1890,
      imageUrl: "/products/mix-set.jpg",
      weight: "1200г",
      category: "Сеты",
    },
    {
      name: "Нигири Лосось",
      description: "Суши с нежным лососем",
      price: 120,
      imageUrl: "/products/nigiri-salmon.jpg",
      weight: "40г",
      category: "Суши",
    },
    {
      name: "Coca-Cola",
      description: "Классическая кока-кола 0.5л",
      price: 80,
      imageUrl: "/products/cola.jpg",
      weight: "500мл",
      category: "Напитки",
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }
  console.log(`✅ Created ${products.length} products`);

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
