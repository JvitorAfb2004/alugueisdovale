<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container
    fluid
    class="d-flex flex-column align-center justify-center text-center"
    style="height: 100vh"
  >
    <v-row>
      <v-col>
        <v-img
          style="text-align: center !important; margin: 0 auto !important"
          src="https://cdn-icons-png.flaticon.com/512/6261/6261498.png"
          alt="Página Não Encontrada"
          max-width="300"
          class="mb-5"
          contain
        ></v-img>
        <h1 class="display-2 font-weight-bold">404</h1>
        <p class="text-h5">Ops! Página não encontrada</p>
        <p class="text-subtitle-1 mb-4">
          A página que você está procurando não existe ou foi movida.
        </p>
        <v-btn link href="/" class="btn"> Voltar para a página inicial </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {},
};
</script>

<style scoped></style>
