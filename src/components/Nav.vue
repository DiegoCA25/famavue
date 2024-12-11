<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
</script>

<template> 
<nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
  <div class="container-fluid">
    <a class="navbar-brand fw-bold text-primary" href="#">
      <i class="fas fa-prescription-bottle-alt text-success me-2"></i>Farmacia
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0" v-if="authStore.user">
        <li class="nav-item">
          <RouterLink to="/medications" class="nav-link text-dark fw-semibold">
            <i class="fas fa-pills text-success me-2"></i>Medicamentos
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/laboratories" class="nav-link text-dark fw-semibold">
            <i class="fas fa-flask text-warning me-2"></i>Laboratorios
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/sales" class="nav-link text-dark fw-semibold">
            <i class="fas fa-shopping-cart text-info me-2"></i>Ventas
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/employees" class="nav-link text-dark fw-semibold">
            <i class="fas fa-users text-secondary me-2"></i>Empleados
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/clients" class="nav-link text-dark fw-semibold">
            <i class="fas fa-address-book text-danger me-2"></i>Clientes
          </RouterLink>
        </li>
      </ul>
      <ul class="navbar-nav ms-auto align-items-center" v-if="authStore.user">
        <li class="nav-item me-3">
          <span class="nav-link text-dark fw-semibold">
            <i class="fas fa-user-circle text-primary me-2"></i>{{ authStore.user.name }}
          </span>
        </li>
        <li class="nav-item">
          <button @click="authStore.logout" class="btn btn-danger fw-bold">
            <i class="fas fa-sign-out-alt me-2"></i>Salir
          </button>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<style scoped>
.navbar {
  background: #f8f9fa;
  border-bottom: 2px solid #e3e6ea;
}

.navbar-brand {
  font-size: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-link {
  transition: color 0.2s ease-in-out;
}

.nav-link:hover {
  color: #007bff !important;
}

.navbar-toggler {
  border: none;
  outline: none;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}
</style>

