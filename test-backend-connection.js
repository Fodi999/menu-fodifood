#!/usr/bin/env node

// 🔍 Тест подключения к бекенду
// Проверяет все основные API эндпоинты

const BASE_URL = 'https://irrelevant-nellie-fodi999-aefe2c9f.koyeb.app';

async function testEndpoint(endpoint, method = 'GET', body = null, headers = {}) {
  try {
    console.log(`\n🔍 Тестирую: ${method} ${endpoint}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    
    console.log(`   Статус: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.text();
      try {
        const jsonData = JSON.parse(data);
        console.log(`   ✅ Ответ:`, jsonData);
        return { success: true, data: jsonData };
      } catch {
        console.log(`   ✅ Ответ (text):`, data.slice(0, 100) + (data.length > 100 ? '...' : ''));
        return { success: true, data };
      }
    } else {
      const errorText = await response.text();
      console.log(`   ❌ Ошибка:`, errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.log(`   ❌ Исключение:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Начинаю тестирование бекенда...');
  console.log(`📡 URL: ${BASE_URL}`);
  
  const tests = [
    // Health check
    ['/api/health', 'GET'],
    
    // Products API
    ['/api/products', 'GET'],
    
    // Test auth endpoints (without actual credentials)
    ['/api/auth/register', 'POST', { 
      email: 'test@example.com', 
      password: 'testpass', 
      name: 'Test User' 
    }],
    
    // Check CORS
    ['/api/products', 'OPTIONS'],
  ];

  const results = [];
  
  for (const [endpoint, method, body, headers] of tests) {
    const result = await testEndpoint(endpoint, method, body, headers);
    results.push({ endpoint, method, ...result });
    await new Promise(resolve => setTimeout(resolve, 500)); // Пауза между запросами
  }

  console.log('\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:');
  console.log('================================');
  
  let successCount = 0;
  results.forEach(({ endpoint, method, success, error }) => {
    const status = success ? '✅' : '❌';
    console.log(`${status} ${method} ${endpoint}`);
    if (error && !success) {
      console.log(`    Ошибка: ${error}`);
    }
    if (success) successCount++;
  });
  
  console.log(`\n📈 Успешно: ${successCount}/${results.length} тестов`);
  
  if (successCount === results.length) {
    console.log('🎉 Все тесты прошли успешно! Бекенд работает корректно.');
  } else {
    console.log('⚠️  Некоторые тесты не прошли. Проверьте конфигурацию бекенда.');
  }
}

// Запуск тестов
runTests().catch(console.error);
