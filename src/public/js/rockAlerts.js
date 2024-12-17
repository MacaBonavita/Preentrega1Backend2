// src/public/js/rockAlerts.js
const rockAlert = {
    success: (message) => {
        return Swal.fire({
            title: '¡Excelente!',
            text: message,
            icon: 'success',
            confirmButtonText: 'Continuar',
            background: '#1a1a1a',
            color: '#ffffff',
            iconColor: '#ff4136',
            confirmButtonColor: '#ff4136',
            customClass: {
                popup: 'animated tada'
            }
        });
    },
    error: (message) => {
        return Swal.fire({
            title: '¡Oops!',
            text: message,
            icon: 'error',
            confirmButtonText: 'Intenta de nuevo',
            background: '#1a1a1a',
            color: '#ffffff',
            iconColor: '#ff4136',
            confirmButtonColor: '#ff4136',
            customClass: {
                popup: 'animated shake'
            }
        });
    },
    confirm: (message) => {
        return Swal.fire({
            title: '¿Estás seguro?',
            text: message,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            background: '#1a1a1a',
            color: '#ffffff',
            iconColor: '#ffd700',
            confirmButtonColor: '#ff4136',
            cancelButtonColor: '#1a1a1a',
            customClass: {
                popup: 'animated bounceIn'
            }
        });
    }
};