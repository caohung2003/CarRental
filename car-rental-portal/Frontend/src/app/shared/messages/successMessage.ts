import Swal from "sweetalert2";

export function displaySuccessMessage(message: string){
    Swal.fire({
        // toast: true,
        icon: 'success',
        text: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    })
}