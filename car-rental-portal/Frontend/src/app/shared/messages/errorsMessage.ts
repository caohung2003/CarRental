import Swal from 'sweetalert2';

export function displayErrorMessage(message: string){
    Swal.fire({
        // toast: true,
        icon: 'error',
        text: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    })
}