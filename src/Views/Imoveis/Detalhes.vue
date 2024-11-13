<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-breadcrumbs :items="['Imóveis', imovel.titulo]"></v-breadcrumbs>
    <v-carousel
      v-model="activeItemIndex"
      style="border-radius: 20px !important"
    >
      <!-- Verifica se existem imagens no anúncio -->

      <v-carousel-item
        v-for="(imagem, i) in imovel.imagens"
        :key="i"
        :src="imagem"
        cover
      ></v-carousel-item>
      <template v-slot:placeholder>
        <v-row align="center" class="fill-height ma-0" justify="center">
          <v-progress-circular
            color="grey-lighten-5"
            indeterminate
          ></v-progress-circular>
        </v-row>
      </template>
    </v-carousel>
    <!-- Detalhes do Imóvel -->
    <v-card flat>
      <v-divider class="my-4"></v-divider>
      <v-card-title style="font-size: 22pt">{{ imovel.titulo }}</v-card-title>
      <v-card-subtitle>
        <v-icon left>mdi-map-marker</v-icon> {{ imovel.endereco }}
      </v-card-subtitle>
      <v-card-subtitle>
        <v-icon left>mdi-calendar</v-icon> Anunciado em:
        {{ imovel.data }}
      </v-card-subtitle>

      <!-- Descrição e Informações do Imóvel -->
      <v-card-text>
        <div class="descricao">{{ imovel.descricaoCompleta }}</div>
        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col cols="6">
            <v-icon left>mdi-ruler-square</v-icon> <strong>Área:</strong>
            {{ imovel.area }}
          </v-col>
          <v-col cols="6">
            <v-icon left>mdi-home-city-outline</v-icon> <strong>Tipo:</strong>
            {{ imovel.tipo }}
          </v-col>
          <v-col cols="6">
            <v-icon left>mdi-bed-outline</v-icon> <strong>Quartos:</strong>
            {{ imovel.quartos }}
          </v-col>
          <v-col cols="6">
            <v-icon left>mdi-shower-head</v-icon> <strong>Banheiros:</strong>
            {{ imovel.banheiros }}
          </v-col>
          <v-col cols="6">
            <v-icon>mdi-cash</v-icon>
            <strong>Preço:</strong> R$ {{ imovel.preco.toLocaleString() }}
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <!-- Perfil do Anunciante -->
        <div class="perfil-anunciante">
          <div class="anunciante-info">
            <v-avatar>
              <v-icon style="padding-right: 10px; font-size: 18pt"
                >mdi-account</v-icon
              >
            </v-avatar>
            <strong>{{ imovel.anuncianteNome }}</strong>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Botões de Ação -->
    <div class="btns">
      <v-btn width="200" class="btnShare" @click="compartilhar">
        <v-icon left>mdi-share-variant</v-icon> Compartilhar
      </v-btn>

      <v-btn class="btnContato option" @click="entrarEmContato">
        <v-icon left>mdi-whatsapp</v-icon> Entrar em Contato
      </v-btn>
    </div>

    <v-dialog v-model="dialog" max-width="400px" elevation="0">
      <v-card class="loading-card" elevation="0">
        <v-card-title class="loading-title">
          Carregando informações...
        </v-card-title>

        <!-- Animação de carregamento -->
        <v-card-text>
          <v-row justify="center" align="center">
            <v-progress-circular
              indeterminate
              color="#4CAF50"
              size="64"
              width="8"
            ></v-progress-circular>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { db } from "../../firebase"; // Certifique-se de que 'db' está configurado corretamente
import { getDoc, doc } from "firebase/firestore";
export default {
  data() {
    return {
      activeItemIndex: 0,
      dialog: true,
      item: this.getItemFromURL(),
      imovel: {
        id: 1,
        nome: "",
        preco: "",
        localizacao: "",
        imagens: [],
        anuncianteNome: "",
        anuncianteContato: "",
        area: "",
        quartos: "",
        banheiros: "",
        dataAnuncio: "",
        contato: "",
      },
    };
  },
  mounted() {
    this.getImovel();
  },
  methods: {
    getItemFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("item"); // Pega o parâmetro 'item'
    },
    async getImovel() {
      try {
        // Criação da referência para o documento 'imovel-7' na coleção 'imoveis'
        const imovelRef = doc(db, "imoveis", this.item);

        // Obtendo o documento
        const docSnapshot = await getDoc(imovelRef);

        // Verificando se o documento existe
        if (!docSnapshot.exists()) {
          console.log("Imóvel não encontrado!");
          this.$router.push("/404");
        } else {
          this.imovel = docSnapshot.data();
          setTimeout(() => {
            this.dialog = false;
          }, 500);
          this.getResponsavel();
        }
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
      }
    },

    async getResponsavel() {
      try {
        // Criação da referência para o documento 'imovel-7' na coleção 'imoveis'
        const usuarioRef = doc(db, "usuarios", this.imovel.uidResponsavel);

        // Obtendo o documento
        const usuario = await getDoc(usuarioRef);

        // Verificando se o documento existe
        if (!usuario.exists()) {
          console.log("Imóvel não encontrado!");
        } else {
          this.imovel.anuncianteNome = usuario.data().displayName;
          this.imovel.contato = usuario.data().contato;
        }
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
      }
    },

    compartilhar() {
      if (navigator.share) {
        navigator
          .share({
            title: this.imovel.titulo,
            text: "Por Alugueldovale.com",
            url: window.location.href, // URL atual da página
          })
          .then(() => {})
          .catch((error) => {
            console.error("Erro ao tentar compartilhar:", error);
          });
      } else {
        console.log(
          "A API de compartilhamento não é suportada neste navegador.",
        );
      }
    },
    entrarEmContato() {
      // Monta o link para o WhatsApp
      const link = "https://wa.me/55" + this.imovel.contato;

      // Abre o link em uma nova aba/janela
      window.open(link, "_blank");
    },
  },
};
</script>

<style scoped>
.header-img {
  width: 90%;
  margin: 0 auto !important;
  margin: 10px;
  border-radius: 6px !important;
}

.descricao {
  font-size: 1rem;
  color: #555;
}

.perfil-anunciante {
  display: flex;
  align-items: center;
}

.anunciante-info {
  margin-left: 10px;
}
</style>
