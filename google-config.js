// ============================================
// GOOGLE CONFIG - ETG ASISTENCIA
// ============================================

// EVENTO ACTUAL: Mantenimiento SY Querétaro
// FECHAS: 24-25 de Agosto 2026

const GOOGLE_CONFIG = {
    // ========== GOOGLE SHEETS ==========
    SHEET_ID: '1gfxEi2LpeSmHxq2DBfSWjvmX04kktM5xAP9yfFqnD4k',
    SHEET_NAME: 'ETG-Asistencia-Querétaro',

    // ========== APPS SCRIPT (puente para guardar de verdad) ==========
    // Pega aquí la URL que te da Google al implementar el Apps Script
    // (ver instrucciones en Code.gs / mensaje de Claude)
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwYWqPP6YfUp3YQ78ZRjp3qtY18TXANcqO1ktB8PmK1pdF-MorwyaV5DW6SkvW74c8u/exec',
    
    // ========== GOOGLE DRIVE ==========
    FOLDER_ID: '11imfIsHbc1rwkofA-2DuhkpbrVwQdDJo',  // Para subir fotos
    FOLDER_NAME: 'ETG-QUERÉTARO-24-25AGO',
    
    // ========== EMAIL ==========
    EMAIL: 'sebastian.caro@sebastianyatra.com',
    
    // ========== EVENTO ==========
    EVENTO: 'Mantenimiento SY Querétaro',
    FECHAS: '24-25 de Agosto 2026',
    UBICACION: 'Querétaro',
    
    // ========== URLS DIRECTAS ==========
    SHEET_URL: 'https://docs.google.com/spreadsheets/d/1gfxEi2LpeSmHxq2DBfSWjvmX04kktM5xAP9yfFqnD4k/edit',
    FOLDER_URL: 'https://drive.google.com/drive/folders/11imfIsHbc1rwkofA-2DuhkpbrVwQdDJo',
};

// ========== EVENTOS ANTERIORES (HISTÓRICO) ==========
const EVENTOS_ANTERIORES = {
    MEDELLÍN: {
        SHEET_ID: '12AU4Wz3Hhh1XyRt8DSQq9yvbFdF3OBOocDZpHDU7dXo',
        FOLDER_ID: '1iCCn_JxmiQhjEIjopnW6MrOtSXbjIaqv',
        EVENTO: 'ETG Medellín 2026',
        FECHAS: 'Histórico'
    }
};

// ========== PARA CREAR NUEVO EVENTO ==========
// Cuando necesites otro evento:
// 1. Copia este archivo como google-config-[CIUDAD].js
// 2. Reemplaza los IDs
// 3. Actualiza google-config.js con los nuevos IDs
// 4. Push a GitHub
// 5. Auto-deploy

console.log('✅ Google Config cargado - Evento actual:');
console.log(`📍 ${GOOGLE_CONFIG.EVENTO}`);
console.log(`📅 ${GOOGLE_CONFIG.FECHAS}`);
console.log(`📊 Sheet: ${GOOGLE_CONFIG.SHEET_ID.substring(0, 20)}...`);
console.log(`📁 Folder: ${GOOGLE_CONFIG.FOLDER_ID.substring(0, 20)}...`);
