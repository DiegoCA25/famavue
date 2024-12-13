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
        const response = await axios.get(`/api/medicamentos/${id.value}`);
        const medicamento = response.data.data;
        form.value.name = medicamento.name;
        form.value.descripcion = medicamento.descripcion;
        form.value.caducidad = medicamento.caducidad;
        form.value.precio = medicamento.precio;
        form.value.laboratorio_id = medicamento.laboratorio_id;
        form.value.image = null;
    } catch (error) {
        console.error('Error al obtener medicamento:', error.message);
    }
};

const onImageChange = (e) => {
    form.value.image = e.target.files[0];
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

        const res = await sendRequest('PUT', formData, `/api/medicamentos/${id.value}`, '/medications', {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (res) {
            alert('Medicamento actualizado correctamente');
        }
    } catch (error) {
        console.error('Error al actualizar medicamento:', error.message);
    }
};


onMounted(async () => {
    await getLaboratories();
    await getMedicamento();
});
</script>

<template>
    <div class="row mt-5">
        <div class="col-md-6 offset-md-3">
            <div class="card border border-warning shadow-sm">
                <div class="card-header bg-warning text-dark text-center">
                    <h4 class="fw-bold">
                        <i class="fa-solid fa-pills me-2"></i>Editar Medicamento
                    </h4>
                </div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <!-- Campo Nombre -->
                        <div class="mb-3">
                            <label for="name" class="form-label">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                v-model="form.name"
                                placeholder="Nombre del Medicamento"
                                class="form-control"
                                required
                            />
                        </div>
                        <!-- Campo Descripción -->
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <textarea
                                id="descripcion"
                                v-model="form.descripcion"
                                placeholder="Descripción del Medicamento"
                                class="form-control"
                                required
                            ></textarea>
                        </div>
                        <!-- Campo Caducidad -->
                        <div class="mb-3">
                            <label for="caducidad" class="form-label">Fecha de Caducidad</label>
                            <input
                                id="caducidad"
                                type="date"
                                v-model="form.caducidad"
                                class="form-control"
                                required
                            />
                        </div>
                        <!-- Campo Precio -->
                        <div class="mb-3">
                            <label for="precio" class="form-label">Precio</label>
                            <input
                                id="precio"
                                type="number"
                                step="0.01"
                                v-model="form.precio"
                                placeholder="Precio del Medicamento"
                                class="form-control"
                                required
                            />
                        </div>
                        <!-- Campo Laboratorio -->
                        <div class="mb-3">
                            <label for="laboratorio_id" class="form-label">Laboratorio</label>
                            <select
                                id="laboratorio_id"
                                v-model="form.laboratorio_id"
                                class="form-select"
                                required
                            >
                                <option disabled value="">Seleccionar Laboratorio</option>
                                <option v-for="lab in laboratories" :key="lab.id" :value="lab.id">
                                    {{ lab.laboratorio }}
                                </option>
                            </select>
                        </div>
                        <!-- Campo Imagen -->
                        <div class="mb-3">
                            <label for="image" class="form-label">Imagen (opcional)</label>
                            <input
                                id="image"
                                type="file"
                                @change="onImageChange"
                                class="form-control"
                                accept="image/*"
                            />
                        </div>
                        <div class="d-grid">
                            <button class="btn btn-warning text-dark">
                                <i class="fa-solid fa-save me-2"></i>Actualizar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

