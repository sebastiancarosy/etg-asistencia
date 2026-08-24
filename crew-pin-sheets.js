// ============================================
// VALIDACIÓN TOTP - otpauth (compatible Google Authenticator, RFC 6238)
// ============================================

window.pinValido = false;

const SECRET_BASE32 = 'JBSWY3DPEBLW64TMMQ';
let totpValidator = null;

function inicializarTOTP() {
    if (!totpValidator && typeof OTPAuth !== 'undefined') {
        totpValidator = new OTPAuth.TOTP({
            issuer: 'ETG',
            label: 'Crew',
            algorithm: 'SHA1',
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(SECRET_BASE32)
        });
    }
    return totpValidator;
}

function validarPIN() {
    const input = document.getElementById('pinInput');
    let valor = input.value.trim().replace(/[^0-9]/g, '');
    input.value = valor;

    const mensaje = document.getElementById('pinMessage');

    if (valor.length !== 6) {
        mensaje.innerHTML = '';
        window.pinValido = false;
        return;
    }

    try {
        const validador = inicializarTOTP();
        // window: 1 permite +/- 30 segundos de margen por si el código
        // cambió justo mientras el crew estaba escribiendo
        const delta = validador.validate({ token: valor, window: 1 });

        if (delta !== null) {
            mensaje.innerHTML = '<div class="validation-message success">✅ Código válido - Presiona "Siguiente"</div>';
            window.pinValido = true;
        } else {
            mensaje.innerHTML = '<div class="validation-message error">❌ Código incorrecto. Intenta de nuevo</div>';
            window.pinValido = false;
        }
    } catch (error) {
        console.error('❌ Error validando TOTP:', error);
        mensaje.innerHTML = '<div class="validation-message error">❌ Error validando código</div>';
        window.pinValido = false;
    }
}

console.log('✅ Validación TOTP cargada (otpauth)');
