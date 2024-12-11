<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const form = ref({ id: '', nombre: '', apellidos: '', correo: '' }); // Cambiado a 'empleado'
const id = ref(route.params.id);

onMounted(() => {
    getEmpleado();
});

const getEmpleado = () => {
    axios.get('/api/empleados/' + id.value).then(response => {
        const empleado = response.data.data;
        form.value.nombre = empleado.nombre;
        form.value.apellidos = empleado.apellidos;
        form.value.correo = empleado.correo;
    });
};

const save = () => {
    sendRequest('PUT', form.value, ('/api/empleados/' + id.value), '/employees');
};
</script>

<template>
    <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
            <div class="card border border-success">
                <div class="card-header bg-success border border-success text-white"></div>
                <div class="card-body">
                    <form @submit.prevent="save">
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
                            >
                        </div>
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
