<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { sendRequest } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const route = useRoute();
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const form = ref({ id: '', laboratorio: '' });
const id = ref(route.params.id);

onMounted(() => {
    getLaboratorio();
});

const getLaboratorio = async () => {
    try {
        const response = await axios.get('/api/laboratorios/' + id.value);
        form.value.laboratorio = response.data.data.laboratorio;
    } catch (error) {
        console.error('Error al obtener laboratorio:', error.message);
    }
};

const save = async () => {
    try {
        const res = await sendRequest('PUT', form.value, '/api/laboratorios/' + id.value, '/laboratories');
        if (res) {
            alert('Laboratorio actualizado exitosamente');
        }
    } catch (error) {
        console.error('Error al guardar laboratorio:', error.message);
    }
};
</script>

<template>
  <Modal id="editLaboratoryModal" title="Edit Laboratory">
    <div class="modal-body">
      <form @submit.prevent="save">
        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="fa-solid fa-industry"></i>
          </span>
          <input
            type="text"
            v-model="form.laboratorio"
            placeholder="Laboratorio"
            class="form-control"
            required
          />
        </div>
        <div class="d-grid col-10 mx-auto">
          <button class="btn btn-primary">
            <i class="fa-solid fa-save"></i> Save
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>
