<script setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router'; // Importar el router para redireccionar
import { show_alerta, sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const router = useRouter(); // Inicializar el router
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const form = ref({ nombre: '', apellidos: '', direccion: '' });
const nameInput = ref('');

const save = async () => {
    try {
        const response = await sendRequest('POST', form.value, '/api/clientes', '');
        if (response) {
            form.value.nombre = '';
            form.value.apellidos = '';
            form.value.direccion = '';
            nextTick(() => nameInput.value.focus());
            router.push('/clients'); // Redirigir a /clients después de guardar
        }
    } catch (error) {
        console.error('Error al guardar cliente:', error.message);
    }
};

const cancel = () => {
    router.push('/clients'); // Redirigir a /clients al cancelar
};
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col text-center">
        <h2 class="text-primary">
          <i class="fa-solid fa-address-book text-danger me-2"></i>Registrar Cliente
        </h2>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-6 offset-md-3">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-danger text-white text-center fw-bold">
            <i class="fa-solid fa-user-plus me-2"></i>Agregar Cliente
          </div>
          <div class="card-body">
            <form @submit.prevent="save">
              <!-- Nombre -->
              <div class="input-group mb-3">
                <span class="input-group-text bg-primary text-white">
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

              <!-- Apellidos -->
              <div class="input-group mb-3">
                <span class="input-group-text bg-primary text-white">
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

              <!-- Dirección -->
              <div class="input-group mb-3">
                <span class="input-group-text bg-primary text-white">
                  <i class="fa-solid fa-map-marker-alt"></i>
                </span>
                <input
                  type="text"
                  v-model="form.direccion"
                  placeholder="Dirección"
                  class="form-control"
                  required
                >
              </div>

              <div class="d-grid gap-2">
                <button class="btn btn-success fw-bold">
                  <i class="fa-solid fa-save me-2"></i>Guardar
                </button>
                <button type="button" @click="cancel" class="btn btn-secondary fw-bold">
                  <i class="fa-solid fa-arrow-left me-2"></i>Regresar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}

h2 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
}

.card-header {
  font-size: 1.2rem;
}

.input-group-text {
  font-size: 1rem;
}

.btn {
  border-radius: 8px;
  font-weight: bold;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.shadow-sm {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}
</style>

