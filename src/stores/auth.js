import axios from 'axios';
import { defineStore } from 'pinia';
import { show_alerta } from '../functions';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authUser: null,
    authToken: null,
  }),
  getters: {
    user: (state) => state.authUser,
    token: (state) => state.authToken,
  },
  actions: {
    async getToken() {
      await axios.get('/sanctum/csrf-cookie');
    },
    async login(form) {
      try {
        await this.getToken();
        const res = await axios.post('/api/auth/login', form);
    
        // Almacenar el token y la información del usuario
        this.authToken = res.data.token;
        this.authUser = res.data.data;
        localStorage.setItem('authToken', this.authToken); // Persistir token
    
        // Redirigir a la página de medicamentos usando Vue Router
        this.router.push('/medications');
      } catch (errors) {
        let desc = '';
        if (errors.response && errors.response.data.errors) {
          errors.response.data.errors.forEach((e) => {
            desc += ` ${e}`;
          });
        } else {
          desc = 'Error desconocido al iniciar sesión';
        }
        show_alerta(desc, 'error', '');
      }
    },  
    async register(form) {
      try {
        await this.getToken();
        const res = await axios.post('/api/auth/register', form);
    
        // Mostrar éxito y redirigir
        show_alerta(res.data.message, 'success', '');
    
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.push('/login'); // Usando Vue Router
        }, 2000);
      } catch (errors) {
        let desc = '';
        if (errors.response && errors.response.data.errors) {
          errors.response.data.errors.forEach((e) => {
            desc += ` ${e}`;
          });
        } else {
          desc = 'Error desconocido al registrarse';
        }
        show_alerta(desc, 'error', '');
      }
    },
    async logout() {
      try {
        // Enviar el token en el encabezado Authorization
        await axios.post(
          '/api/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          }
        );

        // Limpiar el estado y almacenamiento local
        this.authToken = null;
        this.authUser = null;
        localStorage.removeItem('authToken');

        // Redirigir al login
        window.location.href = '/login';
      } catch (error) {
        console.error('Error al cerrar sesión:', error);

        // Limpiar el estado incluso si ocurre un error
        this.authToken = null;
        this.authUser = null;
        localStorage.removeItem('authToken');

        // Redirigir al login
        window.location.href = '/login';
      }
    },
  },
  persist: true, // Persistir el estado en localStorage o sessionStorage
});
