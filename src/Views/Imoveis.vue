<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <!-- Barra de Pesquisa e Filtro -->
    <v-row class="rowTop">
      <v-text-field
        v-model="search"
        label="Pesquisar imóveis"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        dense
      ></v-text-field>

      <v-btn icon style="height: 45px !important" @click="drawer = true">
        <v-icon>mdi-filter-outline</v-icon>
      </v-btn>
    </v-row>

    <!-- Lista de Imóveis -->
    <v-row>
      <v-col
        v-for="imovel in filteredImoveis"
        :key="imovel.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="cardImoveis" elevation="0">
          <v-img
            class="fotoImovel"
            height="200"
            aspect-ratio="16/9"
            cover
            :src="imovel.imagens[0]"
          ></v-img>
          <v-card-title>{{ imovel.titulo }}</v-card-title>
          <v-card-subtitle
            >R$ {{ imovel.preco.toLocaleString() }}</v-card-subtitle
          >
          <v-card-text>{{ imovel.descricao }}</v-card-text>

          <v-card-actions>
            <v-btn
              class="btnDetalhes"
              text
              link
              :href="'/imoveis/detalhes?item=' + imovel.id"
            >
              <v-icon style="padding-right: 10px"
                >mdi-information-outline</v-icon
              >
              Detalhes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Drawer de Filtros -->
    <v-navigation-drawer
      v-model="drawer"
      class="drawer"
      app
      width="350"
      temporary
      location="right"
    >
      <v-divider></v-divider>

      <v-card flat>
        <!-- Filtro por Tipo -->
        <v-select
          style="margin-top: 15px"
          v-model="filters.tipo"
          :items="['Todos', 'Apartamento', 'Casa', 'Studio']"
          label="Tipo de Imóvel"
          dense
          variant="outlined"
        ></v-select>

        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="filters.preco[0]"
              variant="outlined"
              type="number"
              prefix="R$"
              placeholder="Min"
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="filters.preco[1]"
              variant="outlined"
              type="number"
              prefix="R$"
              placeholder="Max"
            ></v-text-field> </v-col
        ></v-row>
        <!-- Botão de Aplicar Filtros -->
        <v-btn class="btn" block @click="aplicarFiltros">Aplicar Filtros</v-btn>
        <v-btn
          style="margin-top: 20px; height: 45px"
          block
          @click="drawer = false"
          >Fechar</v-btn
        >
      </v-card>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { db } from "../firebase"; // Certifique-se de que 'db' está configurado corretamente
import { collection, query, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      drawer: false,
      search: "",
      filters: {
        tipo: "",
        preco: [0, 10000],
      },
      imoveis: [],
    };
  },

  mounted() {
    this.buscarAnuncios();
  },

  computed: {
    filteredImoveis() {
      return this.imoveis.filter((imovel) => {
        // Converte o objeto imovel em uma string concatenada para facilitar a busca
        const imovelData = Object.values(imovel).join(" ").toLowerCase();

        return (
          // Filtro por tipo: retorna todos os imóveis se 'Todos' for selecionado
          (this.filters.tipo === "Todos" ||
            this.filters.tipo === "" ||
            imovel.tipo === this.filters.tipo) &&
          // Filtro de pesquisa: verifica se qualquer dado do imóvel contém o texto da pesquisa
          (this.search === "" ||
            imovelData.includes(this.search.toLowerCase())) &&
          // Filtro de preço: valor do imóvel dentro da faixa de preço selecionada
          imovel.preco >= this.filters.preco[0] &&
          imovel.preco <= this.filters.preco[1]
        );
      });
    },
  },
  methods: {
    aplicarFiltros() {
      this.drawer = false;
    },
    // Função para buscar anúncios
    async buscarAnuncios() {
      try {
        // Cria a consulta para buscar anúncios onde o idresponsavel é igual ao uid
        const q = query(
          collection(db, "imoveis"), // Coleção 'imoveis'
        );

        // Recupera os documentos que atendem à consulta
        const querySnapshot = await getDocs(q);

        // Mapeia os documentos e armazena no estado
        this.imoveis = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }; // Retorna o id e os dados do documento
        });
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  padding-top: 24px;
}
</style>
