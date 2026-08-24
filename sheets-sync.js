// ============================================
// SINCRONIZACIÓN CON GOOGLE SHEETS
// ============================================

class GoogleSheetSync {
    constructor(sheetId, folderFotosId, adminEmail) {
        this.sheetId = sheetId;
        this.folderFotosId = folderFotosId;
        this.adminEmail = adminEmail;
        this.registrosLocales = [];
        this.cargarRegistrosLocales();
    }

    cargarRegistrosLocales() {
        const data = localStorage.getItem('registros_etg');
        this.registrosLocales = data ? JSON.parse(data) : [];
    }

    // Guardar registro LOCALMENTE y preparar para sincronización
    async guardarRegistro(registro) {
        // Agregar timestamp de sincronización
        registro.timestampSync = new Date().toISOString();
        
        // Guardar localmente
        this.registrosLocales.push(registro);
        localStorage.setItem('registros_etg', JSON.stringify(this.registrosLocales));

        console.log('✅ Registro guardado localmente:', registro);
        console.log('📊 Pendiente sincronización con Sheet:', this.sheetId);

        // Marcar para sincronización
        this.marcarParaSincronizar(registro);

        return true;
    }

    marcarParaSincronizar(registro) {
        let pendientes = JSON.parse(localStorage.getItem('registros_pendientes_sync') || '[]');
        pendientes.push(registro);
        localStorage.setItem('registros_pendientes_sync', JSON.stringify(pendientes));
        
        console.log('📤 Registro marcado para sincronización automática');
    }

    // Obtener registros pendientes de sincronizar
    obtenerPendientes() {
        return JSON.parse(localStorage.getItem('registros_pendientes_sync') || '[]');
    }

    // Simular sincronización (en producción se usaría Google Sheets API)
    async sincronizarConSheet() {
        const pendientes = this.obtenerPendientes();
        
        if (pendientes.length === 0) {
            return { sincronizados: 0 };
        }

        console.log(`📤 Sincronizando ${pendientes.length} registros...`);
        
        // Aquí irá la integración real con Google Sheets API
        // Por ahora, simular que se sincronizó
        
        localStorage.removeItem('registros_pendientes_sync');
        
        return { 
            sincronizados: pendientes.length,
            timestamp: new Date().toISOString()
        };
    }

    // Obtener estadísticas para el dashboard
    obtenerEstadisticas(fecha = null) {
        const hoy = fecha || new Date().toISOString().split('T')[0];
        const registrosHoy = this.registrosLocales.filter(r => r.fecha === hoy);

        return {
            totalRegistros: registrosHoy.length,
            personasUnicas: new Set(registrosHoy.map(r => r.nombre)).size,
            pinValidados: registrosHoy.filter(r => r.pinValido === true).length,
            fotosCapturadas: registrosHoy.filter(r => r.foto === true).length,
            entradas: registrosHoy.filter(r => r.tipo === 'entrada').length,
            salidas: registrosHoy.filter(r => r.tipo === 'salida').length
        };
    }

    // Obtener registros por nombre
    filtrarPorNombre(nombre) {
        return this.registrosLocales.filter(r => 
            r.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    }

    // Exportar a CSV (con la info del Sheet)
    exportarCSV() {
        let csv = 'NOMBRE,CARGO,TIPO,HORA,PIN_VALIDO,FOTO,DISPOSITIVO,FECHA\n';
        this.registrosLocales.forEach(r => {
            csv += `"${r.nombre}","${r.cargo}","${r.tipo}","${r.hora}","${r.pinValido === true ? 'SÍ' : 'NO'}","${r.foto === true ? 'SÍ' : 'NO'}","${r.dispositivo || 'N/A'}","${r.fecha}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `etg-registros-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
}

// Inicializar sincronización
const sheetSync = new GoogleSheetSync(
    '12AU4Wz3Hhh1XyRt8DSQq9yvbFdF3OBOocDZpHDU7dXo',
    '1iCCn_JxmiQhjEIjopnW6MrOtSXbjIaqv',
    'sebastian.caro@sebastianyatra.com'
);

// Sincronizar cada 5 minutos
setInterval(() => {
    sheetSync.sincronizarConSheet();
}, 5 * 60 * 1000);
