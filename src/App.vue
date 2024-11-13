<template>
  <v-app>
    <!-- Navegação (Nav) -->
    <Nav></Nav>

    <v-main style="margin-top: 40px">
      <router-view></router-view>
      <!-- Renderiza o componente com base na rota -->
    </v-main>
    <Footer style="margin-top: 40px"></Footer>
  </v-app>
</template>

<script setup>
// Importando os componentes Nav e Header
import Nav from "./Components/Nav.vue";
import Footer from "./Views/Footer.vue";
</script>
