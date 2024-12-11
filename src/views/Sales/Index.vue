<script setup>
import { ref, onMounted } from 'vue';
import { confirmation, sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';
import Modal from '../../components/Modal.vue';
import Paginate from 'vuejs-paginate-next';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

onMounted(async () => {
    await getClientes();
    await getMedications();
    await getVentas(1); // Cargar la primera página al inicio
});

const clientes = ref([]);
const medications = ref([]);
const ventas = ref([]);
const load = ref(false);
const rows = ref(0);
const currentPage = ref(1); // Mantener el seguimiento de la página actual
const form = ref({
    cliente_id: '',
    medicamento_id: '',
    cantidad: '',
});
const title = ref('');
const operation = ref(1);
const id = ref('');

const getClientes = async () => {
    try {
        const response = await axios.get('/api/clientes');
        clientes.value = response.data;
    } catch (error) {
        console.error('Error al obtener clientes:', error.message);
    }
};

const getMedications = async () => {
    try {
        const response = await axios.get('/api/medicamentos');
        medications.value = response.data.data.map((med) => ({
            id: med.id,
            name: med.name,
        }));
    } catch (error) {
        console.error('Error al obtener medicamentos:', error.message);
    }
};

const getVentas = async (page) => {
    try {
        load.value = false; // Mostrar indicador de carga
        const response = await axios.get(`/api/ventas?page=${page}`);
        ventas.value = response.data;
        rows.value = response.data.last_page; // Total de páginas
        currentPage.value = page; // Actualizar la página actual
        load.value = true; // Ocultar indicador de carga
    } catch (error) {
        console.error('Error al obtener ventas:', error.message);
    }
};

const deleteVenta = (id, cliente) => {
    confirmation(cliente, `/api/ventas/${id}`, '/ventas');
};

const openModal = (op, cliente_id = '', medicamento_id = '', cantidad = '', venta_id = null) => {
    clear();
    operation.value = op;
    id.value = venta_id;

    if (op === 1) {
        title.value = 'Agregar Venta';
    } else {
        title.value = 'Editar Venta';
        form.value.cliente_id = cliente_id;
        form.value.medicamento_id = medicamento_id;
        form.value.cantidad = cantidad;
    }
};

const clear = () => {
    form.value.cliente_id = '';
    form.value.medicamento_id = '';
    form.value.cantidad = '';
};

const save = async () => {
    try {
        if (operation.value === 1) {
            await sendRequest('POST', form.value, '/api/ventas', '');
        } else {
            await sendRequest('PUT', form.value, `/api/ventas/${id.value}`, '');
        }
        clear();
        await getVentas(currentPage.value); // Mantener la página actual después de guardar
    } catch (error) {
        console.error('Error al guardar venta:', error.message);
    }
};
</script>

<template>
  <div class="container mt-5">
    <div class="row mb-4">
      <div class="col text-center">
        <h2 class="text-primary">
          <i class="fa-solid fa-shopping-cart text-info me-2"></i>Gestión de Ventas
        </h2>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="d-grid gap-2">
          <button class="btn btn-success shadow-sm" data-bs-toggle="modal" data-bs-target="#modal" @click="openModal(1)">
            <i class="fa-solid fa-circle-plus me-2"></i>Agregar Venta
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
            <thead class="table-info">
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Medicamento</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(venta, i) in ventas.data || []" :key="venta.id">
                <td>{{ i + 1 + (currentPage - 1) * ventas.per_page }}</td>
                <td>{{ venta.cliente }}</td>
                <td>{{ venta.medicamento }}</td>
                <td>{{ venta.cantidad }}</td>
                <td>
                  <button class="btn btn-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#modal"
                    @click="openModal(2, venta.cliente_id, venta.medicamento_id, venta.cantidad, venta.id)">
                    <i class="fa-solid fa-edit"></i> Editar
                  </button>
                  <button class="btn btn-danger btn-sm" @click="deleteVenta(venta.id, venta.cliente)">
                    <i class="fa-solid fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <Paginate :page-count="rows" :click-handler="getVentas" prev-text="Anterior" next-text="Siguiente" container-class="paginate mt-3"></Paginate>
        </div>
      </div>
    </div>
  </div>

  <Modal id="modal" :title="title">
    <div class="modal-body">
      <form @submit.prevent="save">
        <div class="mb-3">
          <label for="cliente" class="form-label">Cliente</label>
          <select id="cliente" v-model="form.cliente_id" class="form-select" required>
            <option disabled value="">Selecciona un Cliente</option>
            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">{{ cliente.nombre }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="medicamento" class="form-label">Medicamento</label>
          <select id="medicamento" v-model="form.medicamento_id" class="form-select" required>
            <option disabled value="">Selecciona un Medicamento</option>
            <option v-for="medicamento in medications" :key="medicamento.id" :value="medicamento.id">{{ medicamento.name }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="cantidad" class="form-label">Cantidad</label>
          <input type="number" id="cantidad" v-model="form.cantidad" class="form-control" placeholder="Cantidad" required>
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

