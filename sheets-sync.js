// ============================================
// SINCRONIZACIÓN REAL CON GOOGLE SHEETS + DRIVE
// Usa un Google Apps Script Web App como puente
// (ver Code.gs / instrucciones de instalación)
// ============================================

class GoogleSheetSync {
    constructor(appsScriptUrl) {
        this.appsScriptUrl = appsScriptUrl;
        this.registrosLocales = this.cargarRegistrosLocales();
    }

    cargarRegistrosLocales() {
        const data = localStorage.getItem('registros_etg');
        return data ? JSON.parse(data) : [];
    }

    guardarLocal(registro) {
        this.registrosLocales.push(registro);
        localStorage.setItem('registros_etg', JSON.stringify(this.registrosLocales));
    }

    encolarPendiente(registro) {
        const pendientes = JSON.parse(localStorage.getItem('registros_pendientes_sync') || '[]');
        pendientes.push(registro);
        localStorage.setItem('registros_pendientes_sync', JSON.stringify(pendientes));
    }

    obtenerPendientes() {
        return JSON.parse(localStorage.getItem('registros_pendientes_sync') || '[]');
    }

    limpiarPendiente(index) {
        const pendientes = this.obtenerPendientes();
        pendientes.splice(index, 1);
        localStorage.setItem('registros_pendientes_sync', JSON.stringify(pendientes));
    }

    // Envía un registro al Apps Script (Sheets + Drive).
    // Usa mode: 'no-cors' + Content-Type: text/plain para evitar el preflight
    // OPTIONS que Apps Script no maneja. No podemos leer la respuesta real,
    // pero el POST sí se ejecuta del lado del servidor.
    async enviarRegistro(registro) {
        registro.timestampSync = new Date().toISOString();
        this.guardarLocal(registro);

        if (!this.appsScriptUrl || this.appsScriptUrl.includes('PEGA_AQUI')) {
            console.warn('⚠️ APPS_SCRIPT_URL no configurada. Guardado solo localmente.');
            this.encolarPendiente(registro);
            return { ok: false, motivo: 'sin_configurar' };
        }

        try {
            await fetch(this.appsScriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(registro)
            });
            console.log('✅ Registro enviado a Google Sheets:', registro.nombre);
            return { ok: true };
        } catch (error) {
            console.error('❌ Error de red, se guarda para reintentar:', error);
            this.encolarPendiente(registro);
            return { ok: false, motivo: 'red', error };
        }
    }

    // Reintenta enviar todo lo que quedó pendiente (por ejemplo, sin señal)
    async reintentarPendientes() {
        if (!this.appsScriptUrl || this.appsScriptUrl.includes('PEGA_AQUI')) return;

        const pendientes = this.obtenerPendientes();
        if (pendientes.length === 0) return;

        console.log(`📤 Reintentando ${pendientes.length} registro(s) pendiente(s)...`);

        for (let i = pendientes.length - 1; i >= 0; i--) {
            try {
                await fetch(this.appsScriptUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(pendientes[i])
                });
                this.limpiarPendiente(i);
            } catch (error) {
                console.warn('Sigue sin conexión, se reintentará después.');
                break;
            }
        }
    }

    obtenerEstadisticas(fecha = null) {
        const hoy = fecha || new Date().toISOString().split('T')[0];
        const registrosHoy = this.registrosLocales.filter(r => r.fecha === hoy);

        return {
            totalRegistros: registrosHoy.length,
            personasUnicas: new Set(registrosHoy.map(r => r.nombre)).size,
            pinValidados: registrosHoy.filter(r => r.pinValido === true).length,
            entradas: registrosHoy.filter(r => r.tipo === 'entrada').length,
            salidas: registrosHoy.filter(r => r.tipo === 'salida').length,
            pendientesSync: this.obtenerPendientes().length
        };
    }

    exportarCSV() {
        let csv = 'NOMBRE,CARGO,TIPO,HORA,PIN_VALIDO,DISPOSITIVO,FECHA\n';
        this.registrosLocales.forEach(r => {
            csv += `"${r.nombre}","${r.cargo}","${r.tipo}","${r.hora}","${r.pinValido === true ? 'SI' : 'NO'}","${r.dispositivo || 'N/A'}","${r.fecha}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `etg-registros-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    }
}

// Se inicializa usando la URL configurada en google-config.js
const sheetSync = new GoogleSheetSync(
    typeof GOOGLE_CONFIG !== 'undefined' ? GOOGLE_CONFIG.APPS_SCRIPT_URL : ''
);

// Reintenta pendientes al cargar y cada 2 minutos (por si no había señal)
window.addEventListener('online', () => sheetSync.reintentarPendientes());
setInterval(() => sheetSync.reintentarPendientes(), 2 * 60 * 1000);
