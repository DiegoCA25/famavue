<script setup>
const props = defineProps({
  modal: String,
  title: String,
});
</script>

<template>
  <div class="modal fade" :id="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow-lg border-0 rounded">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title fw-bold">
            <i class="fas fa-edit me-2"></i>{{ title }}
          </h5>
          <button
            class="btn-close btn-close-white"
            type="button"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body p-4">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-content {
  border-radius: 10px;
  background-color: #ffffff;
}

.modal-header {
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  padding: 1rem;
}

.modal-title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.modal-body {
  padding: 1.5rem;
}

.btn-close {
  background-color: transparent;
}

.btn-close-white {
  filter: invert(1);
}

.modal-lg {
  max-width: 800px;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
