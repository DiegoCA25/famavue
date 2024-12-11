<script setup>
import { ref, nextTick } from 'vue';
import { show_alerta, sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const form = ref({ nombre: '', apellidos: '', correo: '' }); // Cambiado para manejar datos de empleados
const nameInput = ref('');

const save = () => {
    sendRequest('POST', form.value, '/api/empleados', ''); // Ajustado para empleados
    form.value.nombre = '';
    form.value.apellidos = '';
    form.value.correo = '';
    nextTick(() => nameInput.value.focus());
};
</script>

<template>
    <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
            <div class="card border border-success">
                <div class="card-header bg-success border border-success text-white"></div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <!-- Campo de Nombre -->
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-user"></i>
                            </span>
                            <input
                                autofocus
                                type="text"
                                v-model="form.nombre"
                                placeholder="Nombre"
                                class="form-control"
                                required
                                ref="nameInput"
                            >
                        </div>

                        <!-- Campo de Apellidos -->
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-user"></i>
                            </span>
                            <input
                                type="text"
                                v-model="form.apellidos"
                                placeholder="Apellidos"
                                class="form-control"
                                required
                            >
                        </div>

                        <!-- Campo de Correo -->
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-envelope"></i>
                            </span>
                            <input
                                type="email"
                                v-model="form.correo"
                                placeholder="Correo"
                                class="form-control"
                                required
                            >
                        </div>

                        <div class="d-grid col-10 mx-auto">
                            <button class="btn btn-dark">
                                <i class="fa-solid fa-save"></i> Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
