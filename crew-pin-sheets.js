// ============================================
// VALIDACIÓN DE CÓDIGO - SIMPLE
// ============================================

window.pinValido = false;

function validarPIN() {
    const input = document.getElementById('pinInput');
    let valor = input.value.trim().replace(/[^0-9]/g, '');
    input.value = valor;

    const mensaje = document.getElementById('pinMessage');

    if (valor.length !== 4) {
        mensaje.innerHTML = '';
        window.pinValido = false;
        return;
    }

    const codigoTOTP = localStorage.getItem('codigoTOTP');

    if (!codigoTOTP) {
        mensaje.innerHTML = '<div class="validation-message error">❌ Pide el código al Admin</div>';
        window.pinValido = false;
        return;
    }

    if (valor === codigoTOTP) {
        mensaje.innerHTML = '<div class="validation-message success">✅ Código válido - Presiona "Siguiente"</div>';
        window.pinValido = true;
    } else {
        mensaje.innerHTML = '<div class="validation-message error">❌ Código incorrecto. Intenta de nuevo</div>';
        window.pinValido = false;
    }
}

console.log('✅ Validación cargada');
