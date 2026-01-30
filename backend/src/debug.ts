// src/debug.ts
import 'dotenv/config';

console.log('🔍 ПЕРЕВІРКА ENV:');
const url = process.env.DATABASE_URL;

if (!url) {
    console.error('❌ DATABASE_URL = undefined (Пусто!)');
    console.error('👉 Перевір, чи є файл .env і чи правильна назва змінної.');
} else {
    console.log('✅ DATABASE_URL знайдено!');
    console.log('👀 Початок рядка:', url.substring(0, 25) + '...');
    
    // Перевірка на pgbouncer (критично для Supabase Transaction Pooler)
    if (!url.includes('pgbouncer=true')) {
        console.warn('⚠️ УВАГА: Для порту 6543 у Supabase обов’язково треба параметр ?pgbouncer=true в кінці URL!');
    } else {
        console.log('✅ Параметр pgbouncer=true присутній.');
    }
}