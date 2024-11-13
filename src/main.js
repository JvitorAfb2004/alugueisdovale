// Importações
import { createApp } from "vue"; // Vue 3
import { createRouter, createWebHistory } from "vue-router"; // Vue Router para Vue 3
import { createVuetify } from "vuetify"; // Vuetify para Vue 3
import "vuetify/styles"; // Importando os estilos do Vuetify
import "./assets/global.css"; // Estilos globais
import App from "./App.vue"; // Componente principal
import Login from "./Views/Login.vue"; // Componente Login
import Home from "./Views/Home.vue";
import Register from "./Views/Register.vue";
import Imoveis from "./Views/Imoveis.vue";
import "@mdi/font/css/materialdesignicons.css";
import ImoveisDetalhes from "./Views/Imoveis/Detalhes.vue";
import AdicionarImovel from "./Views/Imoveis/Adicionar.vue";
import Perfil from "./Views/Perfil.vue";
import Error from "./Views/404.vue";
import EditarImovel from "./Views/Imoveis/editar.vue"


// Configuração do Vuetify
const vuetify = createVuetify({
  typography: {
    fontFamily: "Poppins, sans-serif", // Fonte personalizada
  },
  theme: {
    themes: {
      light: {
        primary: "#2C3E50", // Azul escuro, principal
        secondary: "#8D99AE", // Cinza azulado, para contraste
        accent: "#FFC107", // Dourado para destaque
        error: "#E63946", // Vermelho para mensagens de erro
        info: "#4DA8DA", // Azul claro para informações
        success: "#2A9D8F", // Verde para mensagens de sucesso
        warning: "#E9C46A", // Amarelo mostarda para avisos
      },
    },
  },
});

// Configuração do Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/imoveis",
      component: Imoveis,
    },
    {
      path: "/imoveis/detalhes",
      component: ImoveisDetalhes,
    },
    {
      path: "/anunciante/novoimovel",
      component: AdicionarImovel,
    },
    {
      path: "/perfil",
      component: Perfil,
    },
    {
      path: "/anunciante/editar",
      component:EditarImovel,
    },
    {
      path: "/:catchAll(.*)", // Captura todas as rotas não definidas
      component: Error, // Componente de página de erro
    },
  ],
});

// Criação da aplicação Vue
const app = createApp(App);

// Usando Vuetify e Vue Router
app.use(vuetify);
app.use(router);

// Montando a aplicação
app.mount("#app");
