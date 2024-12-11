<script setup>
import { ref, onMounted } from 'vue';
import { confirmation } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const clientes = ref([]);
const load = ref(false);

const getClientes = async () => {
    try {
        const response = await axios.get('/api/clientes');
        clientes.value = response.data;
        load.value = true;
    } catch (error) {
        console.error('Error al obtener clientes:', error.message);
    }
};

const deleteCliente = (id, nombre) => {
    confirmation(nombre, '/api/clientes/' + id, '/clients');
};

onMounted(() => {
    getClientes();
});
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col text-center">
        <h2 class="text-primary">
          <i class="fa-solid fa-address-book text-danger me-2"></i>Clientes
        </h2>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-6 offset-md-3">
        <div class="d-grid gap-2">
          <router-link :to="{ path: 'clients/create' }" class="btn btn-success shadow-sm">
            <i class="fa-solid fa-circle-plus me-2"></i>Agregar Cliente
          </router-link>
        </div>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-10 offset-md-1">
        <div v-if="!load" class="card shadow-sm text-center p-4">
          <div class="card-body">
            <img src="/Loading.gif" alt="Cargando" class="img-fluid" style="max-width: 150px;">
          </div>
        </div>
        <div v-else class="table-responsive shadow-sm">
          <table class="table table-striped table-hover table-bordered">
            <thead class="table-danger">
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Dirección</th>
                <th colspan="2" class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cliente, i) in clientes" :key="cliente.id">
                <td>{{ i + 1 }}</td>
                <td>{{ cliente.nombre }}</td>
                <td>{{ cliente.apellidos }}</td>
                <td>{{ cliente.direccion }}</td>
                <td class="text-center">
                  <router-link :to="{ path: '/clients/edit/' + cliente.id }" class="btn btn-warning btn-sm shadow-sm">
                    <i class="fa-solid fa-edit"></i> Editar
                  </router-link>
                </td>
                <td class="text-center">
                  <button
                    class="btn btn-danger btn-sm shadow-sm"
                    @click="deleteCliente(cliente.id, cliente.nombre)"
                  >
                    <i class="fa-solid fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
}

h2 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
}

.table {
  border: 1px solid #e3e6ea;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
}

.table-danger {
  background-color: #f8d7da;
}

.btn {
  font-weight: bold;
  border-radius: 8px;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.shadow-sm {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}
</style>

