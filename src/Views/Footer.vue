<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-footer class="footer" padless>
    <v-container>
      <v-row class="text-center" justify="center" align="center">
        <v-col cols="12" md="4" style="text-align: center">
          <v-btn
            class="iconSocialMedia"
            icon
            @click="openLink('https://instagram.com')"
          >
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
          <h4 class="font-weight-bold">Alugueis do Vale</h4>
          <p>
            Oferecemos os melhores imóveis para alugar na região, com qualidade
            e confiança.
          </p>
          <p class="mt-3">
            Desenvolvido por
            <span class="font-weight-bold">Genius Soluções</span>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  methods: {
    goTo(route) {
      this.$router.push(route);
    },
    openLink(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
.v-footer {
  padding: 16px;
  background-color: #f5f5f5;
}
.font-weight-bold {
  font-weight: bold;
}
</style>
