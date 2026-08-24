// ⚙️ CONFIGURACIÓN DEL EVENTO ETG
// Edita estos valores según tu evento

const CONFIG_EVENTO = {
    // Nombre del evento/show
    nombre: "Mantenimiento y Ensayos Querétaro",
    
    // Ciudad donde se realizará
    ciudad: "Querétaro",
    
    // País
    pais: "MÉXICO",
    
    // Fechas del evento
    fechaInicio: "2026-08-24",
    fechaFin: "2026-08-25",
    
    // Artista/Tour
    artista: "Sebastián Yatra",
    
    // Tarifa por hora (en USD)
    tarifaHora: 40,
    
    // Horarios de sesiones
    horarios: {
        MORNING_START: 8,
        MORNING_END: 14,
        AFTERNOON_START: 14,
        AFTERNOON_END: 23
    }
};

// Exportar para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG_EVENTO;
}
