<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { confirmation, sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

onMounted(async () => {
    await getLaboratories();
    await getMedications(1);
});

const laboratories = ref([]);
const medications = ref([]);
const load = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(10);

const form = ref({
    name: '',
    descripcion: '',
    caducidad: '',
    precio: '',
    laboratorio_id: '',
    image: null,
});

const title = ref('');
const operation = ref(1);
const id = ref('');

const getLaboratories = async () => {
    try {
        const response = await axios.get('/api/laboratorios');
        laboratories.value = response.data;
    } catch (error) {
        console.error('Error al obtener laboratorios:', error.message);
    } finally {
        load.value = true;
    }
};

const getMedications = async (page = 1) => {
    try {
        load.value = false;
        const response = await axios.get(`/api/medicamentos?page=${page}`);
        medications.value = response.data.data || [];
        currentPage.value = response.data.current_page || 1;
        totalPages.value = response.data.last_page || 1;
        load.value = true;
    } catch (error) {
        console.error('Error al obtener medicamentos:', error.message);
    }
};

const deleteMedications = (id, name) => {
    confirmation(name, `/api/medicamentos/${id}`, '/medications');
};

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        getMedications(page);
    }
};

const openModal = (op, name = '', descripcion = '', caducidad = '', precio = '', laboratorio_id = '', image = null, medication = null) => {
    clear();
    operation.value = op;
    id.value = medication;

    if (op === 1) {
        title.value = 'Agregar Medicamento';
    } else {
        title.value = 'Editar Medicamento';
        form.value.name = name;
        form.value.descripcion = descripcion;
        form.value.caducidad = caducidad;
        form.value.precio = precio;
        form.value.laboratorio_id = laboratorio_id;
        form.value.image = image;
    }
};

const clear = () => {
    form.value.name = '';
    form.value.descripcion = '';
    form.value.caducidad = '';
    form.value.precio = '';
    form.value.laboratorio_id = '';
    form.value.image = null;
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

        if (operation.value === 1) {
            await axios.post('/api/medicamentos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await axios.post(`/api/medicamentos/${id.value}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        clear();
        getMedications(1);
    } catch (error) {
        console.error('Error al guardar el medicamento:', error.response?.data || error.message);
    }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row mb-4">
      <div class="col text-center">
        <h2 class="text-primary">
          <i class="fa-solid fa-pills text-success me-2"></i>Gestión de Medicamentos
        </h2>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="d-grid gap-2">
          <router-link :to="{ path: 'medications/create' }" class="btn btn-success shadow-sm">
            <i class="fa-solid fa-circle-plus me-2"></i>Agregar medicamento
          </router-link>
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-10 offset-md-1">
        <div v-if="!load" class="text-center p-4">
          <img src="/Loading.gif" alt="Cargando..." class="img-fluid" style="max-width: 150px;">
        </div>
        <div v-else class="table-responsive shadow-sm">
          <table class="table table-bordered table-hover table-striped">
            <thead class="table-success">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Caducidad</th>
                <th>Precio</th>
                <th>Laboratorio</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(med, i) in medications" :key="med.id">
                <td>{{ (currentPage - 1) * 10 + i + 1 }}</td>
                <td>{{ med.name }}</td>
                <td>{{ med.descripcion }}</td>
                <td>{{ med.caducidad }}</td>
                <td>{{ med.precio }}</td>
                <td>{{ med.laboratorio }}</td>
                <td>
                  <img
                    :src="med.image ? med.image : '/default-image.png'"
                    alt="Imagen"
                    class="img-thumbnail"
                    width="50"
                  />
                </td>
                <td>
                  <router-link :to="{ path: '/medications/edit/' + med.id }" class="btn btn-warning btn-sm shadow-sm">
                    <i class="fa-solid fa-edit"></i> Editar
                  </router-link>
                  <button class="btn btn-danger btn-sm" @click="deleteMedications(med.id, med.name)">
                    <i class="fa-solid fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Paginación -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <button
              class="btn btn-secondary"
              :disabled="currentPage <= 1"
              @click="goToPage(currentPage - 1)"
            >
              Anterior
            </button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button
              class="btn btn-secondary"
              :disabled="currentPage >= totalPages"
              @click="goToPage(currentPage + 1)"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>