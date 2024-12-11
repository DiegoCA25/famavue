import Swal from 'sweetalert2';
import { nextTick } from '@vue/runtime-core';
import { useAuthStore } from '@/stores/auth';

export function show_alerta(msj, icon, focus) {
    if (focus && focus.value) {
        nextTick(() => focus.value.focus());
    }
    Swal.fire({
        title: msj,
        icon: icon,
        buttonsStyling: true,
    });
}

export function confirmation(name, url, redirect) {
    const alert = Swal.mixin({ buttonsStyling: true });
    alert.fire({
        title: 'Are you sure you want to delete ' + name + '?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Yes, delete',
        cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancel', // Corregido cierre de comillas
    }).then((result) => {
        if (result.isConfirmed) {
            sendRequest('DELETE', {}, url, redirect);
        }
    });
}

export async function sendRequest(method, params, url, redirect) {
    const authStore = useAuthStore();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

    let res;

    await axios({
        method: method,
        url: url,
        data: params,
    })
        .then((response) => {
            res = response.data.status;
            show_alerta(response.data.message, 'success', '');
            if (redirect) {
                setTimeout(() => {
                    window.location.href = redirect;
                }, 200);
            }
        })
        .catch((errors) => {
            let desc = '';
            res = errors.response?.data?.status || 'error'; // Manejo seguro de errores
            const errorArray = errors.response?.data?.errors;

            if (Array.isArray(errorArray)) {
                errorArray.map((e) => {
                    desc += ' ' + e;
                });
            } else {
                desc = errors.response?.data?.message || 'An unexpected error occurred';
            }

            show_alerta(desc, 'error', '');
        });

    return res;
}

