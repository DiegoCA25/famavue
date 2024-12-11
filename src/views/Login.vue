<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
const form = ref({ email: '', password: '' });
</script>

<template>
  <div class="row mt-5 justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow-lg border-0 rounded">
        <div class="card-header bg-primary text-white text-center">
          <h4 class="fw-bold mb-0">
            <i class="fas fa-prescription-bottle-alt me-2"></i>Inicio de Sesión
          </h4>
        </div>
        <div class="card-body p-4">
          <!-- Imagen centrada -->
          <div class="text-center mb-4">
            <img 
              src="/public/medicina.jpg" 
              alt="Login Logo" 
              class="img-fluid rounded-circle border border-3 border-primary" 
              style="width: 120px; height: 120px;"
            >
          </div>
          <form @submit.prevent="$event => authStore.login(form)">
            <div class="input-group mb-3">
              <span class="input-group-text bg-primary text-white">
                <i class="fa-solid fa-at"></i>
              </span>
              <input
                autofocus
                type="email"
                v-model="form.email"
                placeholder="Correo Electrónico"
                class="form-control"
              >
            </div>
            <div class="input-group mb-3">
              <span class="input-group-text bg-primary text-white">
                <i class="fa-solid fa-key"></i>
              </span>
              <input
                type="password"
                v-model="form.password"
                placeholder="Contraseña"
                class="form-control"
              >
            </div>
            <div class="d-grid">
              <button class="btn btn-primary btn-lg fw-bold">
                <i class="fa-solid fa-sign-in-alt me-2"></i>Iniciar Sesión
              </button>
            </div>
          </form>
          <div class="text-center mt-3">
            <router-link :to="{ path: 'register' }" class="text-decoration-none text-primary fw-semibold">
              ¿No tienes cuenta? Regístrate aquí
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 10px;
}

.card-header {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.25rem;
  border-bottom: none;
}

.input-group-text {
  border-radius: 0.375rem 0 0 0.375rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.text-primary {
  color: #007bff !important;
}
</style>
