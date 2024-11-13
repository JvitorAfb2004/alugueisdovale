<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container
    class="header-container text-center"
    style="background-color: white !important"
    fluid
  >
    <!-- Título e Subtítulo -->
    <v-col cols="12" md="8">
      <h1 class="header-title">{{ title }}</h1>
      <h3 class="header-subtitle">
        {{ subtitle }}
      </h3>

      <div
        style="
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 20px;
        "
      >
        <v-btn
          link
          href="/imoveis"
          class="btn"
          style="margin-bottom: 15px; color: white; width: 220px"
        >
          Buscar Imóveis
        </v-btn>
        <v-btn
          class="btn"
          link
          href="/anunciante/novoimovel"
          style="margin-bottom: 15px; color: white; width: 220px"
        >
          Anunciar Imóvel
        </v-btn>
      </div>
    </v-col>
  </v-container>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "Alugueis do Vale",
    },
    subtitle: {
      type: String,
      default: "Tudo na Palma da sua Mão",
    },
  },
  methods: {
    handleContactClick() {
      // Lógica ao clicar no botão de contato (por exemplo, rolar até a seção de contato)
      console.log("Botão de contato clicado!");
    },
  },
};
</script>

<style scoped></style>
