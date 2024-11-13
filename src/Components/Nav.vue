<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app-bar class="appbar" elevation="0">
    <!-- Nome à esquerda -->
    <v-toolbar-title @click="goToHome" style="cursor: pointer"
      >Alugueis do Vale</v-toolbar-title
    >

    <div class="d-flex align-center" v-if="isDesktop">
      <v-btn href="/anunciante/novoimovel" link class="mr-4"
        >Anunciar Imóvel</v-btn
      >
      <v-btn href="/imoveis" link class="mr-4">Buscar Imóvel</v-btn>

      <v-btn href="/perfil" link class="mr-4" v-if="logado">Seu Perfil</v-btn>
      <v-btn href="/register" link class="btn" v-if="!logado">
        Criar Conta</v-btn
      >
      <v-btn href="/login" link class="btn" v-if="!logado"> Entrar </v-btn>
      <v-btn @click="sair" link class="btn" v-if="logado"> Sair </v-btn>
    </div>
    <div class="d-flex align-center" v-if="isDesktop == false">
      <v-btn class="IconMenu" icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
  <!-- Drawer (Menu Lateral) -->
  <v-navigation-drawer
    location="right"
    style="padding-top: 50px"
    v-model="drawer"
    app
    temporary
  >
    <v-list>
      <v-list-item href="/anunciante/novoimovel" link>
        <v-list-item-title> Anunciar Imóvel</v-list-item-title>
      </v-list-item>

      <v-list-item href="/imoveis" link>
        <v-list-item-title> Buscar Imóveis</v-list-item-title>
      </v-list-item>
      <v-list-item href="/perfil" link v-if="logado">
        <v-list-item-title> Seu Perfil</v-list-item-title>
      </v-list-item>

      <v-list-item @click="sair" link v-if="logado">
        <v-list-item-title> Deslogar</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="!logado" href="/login" link>
        <v-list-item-title> Entrar </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!logado" href="/register" link>
        <v-list-item-title> Criar Conta </v-list-item-title>
      </v-list-item>

      <!-- Adicione outros itens de menu conforme necessário -->
    </v-list>
  </v-navigation-drawer>
  <v-snackbar color="#4CAF50" v-model="alerta">
    {{ msgAlerta }}
  </v-snackbar>
</template>

<script>
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { isLoggedIn, logout } from "../firebase";

export default {
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    goToHome() {
      this.$router.push("/");
    },
  },
  setup() {
    // Obtenção das variáveis do display
    const display = useDisplay();
    const isDesktop = display.mdAndUp;

    // Estado reativo para login e mensagens
    const logado = ref(false);
    const alerta = ref(false);
    const msgAlerta = ref("");

    // Verificação de login
    isLoggedIn((loggedIn) => {
      logado.value = loggedIn;
    });

    // Função para exibir uma mensagem de toast
    const showToast = (msg) => {
      alerta.value = true;
      msgAlerta.value = msg;
      setTimeout(() => {
        alerta.value = false;
      }, 2000);
    };

    // Função para deslogar
    const sair = async () => {
      try {
        await logout();
        showToast("Deslogado com sucesso");
        logado.value = false; // Atualiza o estado de login local
      } catch (error) {
        console.error("Erro ao deslogar:", error);
      }
    };

    return { isDesktop, logado, alerta, msgAlerta, sair, showToast };
  },
};
</script>

<style scoped></style>
