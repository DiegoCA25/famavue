<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const form = ref({
    name: '',
    descripcion: '',
    caducidad: '',
    precio: '',
    laboratorio_id: '',
    image: null,
});
const laboratories = ref([]);
const id = ref(route.params.id);

onMounted(() => {
    getLaboratories();
    getMedicamento();
});

const getLaboratories = async () => {
    try {
        const response = await axios.get('/api/laboratorios');
        laboratories.value = response.data;
    } catch (error) {
        console.error('Error al obtener laboratorios:', error.message);
    }
};

const getMedicamento = async () => {
    try {
        const response = await axios.get('/api/medicamentos/' + id.value);
        const medicamento = response.data.data;
        form.value.name = medicamento.name;
        form.value.descripcion = medicamento.descripcion;
        form.value.caducidad = medicamento.caducidad;
        form.value.precio = medicamento.precio;
        form.value.laboratorio_id = medicamento.laboratorio_id;
    } catch (error) {
        console.error('Error al obtener medicamento:', error.message);
    }
};

const save = async () => {
    try {
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('descripcion', form.value.descripcion);
        formData.append('caducidad', form.value.caducidad);
        formData.append('precio', form.value.precio);
        formData.append('laboratorio_id', form.value.laboratorio_id);
        if (form.value.image) {
            formData.append('image', form.value.image);
        }
        const response = await sendRequest('PUT', formData, '/api/medicamentos/' + id.value, '/medications', {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response) {
            alert('Medicamento actualizado correctamente');
        }
    } catch (error) {
        console.error('Error al actualizar medicamento:', error.message);
    }
};
</script>

<template>
    <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
            <div class="card border border-warning">
                <div class="card-header bg-warning border border-warning text-dark text-center">
                    <h4 class="fw-bold">Editar Medicamento</h4>
                </div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-pills"></i>
                            </span>
                            <input
                                type="text"
                                v-model="form.name"
                                placeholder="Nombre"
                                class="form-control"
                                required
                            />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-info-circle"></i>
                            </span>
                            <textarea
                                v-model="form.descripcion"
                                placeholder="Descripción"
                                class="form-control"
                                required
                            ></textarea>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-calendar"></i>
                            </span>
                            <input
                                type="date"
                                v-model="form.caducidad"
                                class="form-control"
                                required
                            />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-dollar-sign"></i>
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                v-model="form.precio"
                                placeholder="Precio"
                                class="form-control"
                                required
                            />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-flask"></i>
                            </span>
                            <select
                                v-model="form.laboratorio_id"
                                class="form-select"
                                required
                            >
                                <option disabled value="">Seleccionar Laboratorio</option>
                                <option
                                    v-for="lab in laboratories"
                                    :key="lab.id"
                                    :value="lab.id"
                                >
                                    {{ lab.laboratorio }}
                                </option>
                            </select>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-image"></i>
                            </span>
                            <input
                                type="file"
                                @change="e => form.value.image = e.target.files[0]"
                                class="form-control"
                                accept="image/*"
                            />
                        </div>
                        <div class="d-grid col-10 mx-auto">
                            <button class="btn btn-warning text-dark">
                                <i class="fa-solid fa-save"></i> Actualizar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
