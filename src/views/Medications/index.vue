<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { confirmation, sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Modal from '../../components/Modal.vue';
import Paginate from 'vuejs-paginate-next';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

onMounted(async () => {
    await getLaboratories();
    await getMedications(1);
});

const laboratories = ref([]);
const medications = ref([]);
const load = ref(false);
const rows = ref(0);
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

const getMedications = async (page) => {
    try {
        const response = await axios.get(`/api/medicamentos?page=${page}`);
        medications.value = response.data;
        rows.value = response.data.last_page;
    } catch (error) {
        console.error('Error al obtener medicamentos:', error.message);
    } finally {
        load.value = true;
    }
};

const deleteMedications = (id, name) => {
    confirmation(name, `/api/medicamentos/${id}`, '/medications');
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
  const formData = new FormData();
formData.append('name', form.name);
formData.append('descripcion', form.descripcion);
formData.append('caducidad', form.caducidad);
formData.append('precio', form.precio);
formData.append('laboratorio_id', form.laboratorio_id);

if (form.image) {
    formData.append('image', form.image);
}

axios.post('/api/medicamentos/' + id, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

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
          <button class="btn btn-success shadow-sm" data-bs-toggle="modal" data-bs-target="#modal" @click="openModal(1)">
            <i class="fa-solid fa-circle-plus me-2"></i>Agregar Medicamento
          </button>
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
              <tr v-for="(med, i) in medications.data || []" :key="med.id">
                <td>{{ i + 1 }}</td>
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
                  <button class="btn btn-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#modal"
                    @click="openModal(2, med.name, med.descripcion, med.caducidad, med.precio, med.laboratorio_id, med.image, med.id)">
                    <i class="fa-solid fa-edit"></i> Editar
                  </button>
                  <button class="btn btn-danger btn-sm" @click="deleteMedications(med.id, med.name)">
                    <i class="fa-solid fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <Paginate :page-count="rows" :click-handler="getMedications" prev-text="Anterior" next-text="Siguiente" container-class="paginate mt-3"></Paginate>
        </div>
      </div>
    </div>
  </div>

  <Modal id="modal" :title="title">
    <div class="modal-body">
      <form @submit.prevent="save">
        <div class="mb-3">
          <label for="name" class="form-label">Nombre del Medicamento</label>
          <input type="text" id="name" v-model="form.name" class="form-control" placeholder="Nombre" required>
        </div>
        <div class="mb-3">
          <label for="descripcion" class="form-label">Descripción</label>
          <textarea id="descripcion" v-model="form.descripcion" class="form-control" placeholder="Descripción" required></textarea>
        </div>
        <div class="mb-3">
          <label for="caducidad" class="form-label">Fecha de Caducidad</label>
          <input type="date" id="caducidad" v-model="form.caducidad" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="precio" class="form-label">Precio</label>
          <input type="number" id="precio" v-model="form.precio" class="form-control" placeholder="Precio" step="0.01" required>
        </div>
        <div class="mb-3">
          <label for="laboratorio" class="form-label">Laboratorio</label>
          <select id="laboratorio" v-model="form.laboratorio_id" class="form-select" required>
            <option disabled value="">Seleccionar laboratorio</option>
            <option v-for="lab in laboratories" :key="lab.id" :value="lab.id">{{ lab.laboratorio }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="image" class="form-label">Imagen</label>
          <input type="file" id="image" @change="onImageChange" class="form-control" accept="image/*">
        </div>
        <div class="d-grid">
          <button class="btn btn-success">
            <i class="fa-solid fa-save me-2"></i>Guardar
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>