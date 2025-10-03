#!/usr/bin/env node

/**
 * Скрипт проверки целостности переводов
 * Проверяет, что все ключи присутствуют во всех языковых файлах
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'locales');
const LANGUAGES = ['en', 'ru', 'pl'];

// Рекурсивно получить все ключи из объекта
function getKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      keys.push(...getKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Загрузить файл перевода
function loadTranslation(lang) {
  const filePath = path.join(LOCALES_DIR, lang, 'ns1.json');
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Ошибка загрузки ${lang}/ns1.json:`, error.message);
    return null;
  }
}

// Основная функция проверки
function checkTranslations() {
  console.log('🔍 Проверка целостности переводов...\n');
  
  const translations = {};
  const allKeys = new Set();
  
  // Загрузить все переводы и собрать все ключи
  for (const lang of LANGUAGES) {
    translations[lang] = loadTranslation(lang);
    
    if (translations[lang]) {
      const keys = getKeys(translations[lang]);
      keys.forEach(key => allKeys.add(key));
      console.log(`✅ ${lang}: ${keys.length} ключей`);
    }
  }
  
  console.log(`\n📊 Всего уникальных ключей: ${allKeys.size}\n`);
  
  // Проверить отсутствующие ключи
  let hasErrors = false;
  
  for (const lang of LANGUAGES) {
    const missingKeys = [];
    
    if (!translations[lang]) {
      console.log(`❌ ${lang}: файл не загружен`);
      continue;
    }
    
    const langKeys = new Set(getKeys(translations[lang]));
    
    for (const key of allKeys) {
      if (!langKeys.has(key)) {
        missingKeys.push(key);
      }
    }
    
    if (missingKeys.length > 0) {
      hasErrors = true;
      console.log(`❌ ${lang}: отсутствует ${missingKeys.length} ключей:`);
      missingKeys.forEach(key => console.log(`   - ${key}`));
      console.log('');
    } else {
      console.log(`✅ ${lang}: все ключи на месте`);
    }
  }
  
  if (!hasErrors) {
    console.log('\n🎉 Все переводы в порядке!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Обнаружены проблемы с переводами');
    process.exit(1);
  }
}

// Запустить проверку
checkTranslations();
