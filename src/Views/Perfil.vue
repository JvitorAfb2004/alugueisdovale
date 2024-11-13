<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container class="my-5">
    <v-breadcrumbs :items="['Conta', 'Seu Perfil']"></v-breadcrumbs>
    <v-row>
      <!-- Seção de Informações de Contato -->
      <v-col cols="12" md="4">
        <v-card elevation="0" class="cardImoveis">
          <v-row
            class="justify-space-between align-center"
            style="margin: 10px"
          >
            <v-card-title class="font-weight-bold">Perfil</v-card-title
            ><v-btn
              v-if="this.edit == false"
              @click="editar()"
              style="margin-right: 20px"
              elevation="0"
              icon
              link
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-btn
              v-if="this.edit == true"
              style="float: right"
              @click="atualizar()"
              class="btn"
              >Atualizar</v-btn
            ></v-row
          >
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nome:</v-list-item-title>
                  <v-text-field
                    :disabled="edit == false"
                    variant="outlined"
                    v-model="displayName"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Telefone:</v-list-item-title>
                  <v-text-field
                    variant="outlined"
                    :disabled="edit == false"
                    :model-value="contato"
                    v-model="contato"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email:</v-list-item-title>
                  <v-text-field
                    variant="outlined"
                    disabled=""
                    :model-value="email"
                    v-model="email"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Seção de Imóveis Anunciados -->
      <v-col cols="12" md="8" style="box-shadow: none !important">
        <v-card elevation="0" class="cardImoveis">
          <v-card-title class="font-weight-bold"
            >Imóveis Anunciados</v-card-title
          >

          <v-divider></v-divider>

          <v-row style="margin-top: 10px">
            <v-col style="padding: 10px; margin: 0 auto; text-align: center">
              <v-skeleton-loader
                v-if="esqueleto == true"
                type="card"
              ></v-skeleton-loader>
              <span center v-if="anuncios.length == 0 && esqueleto == false"
                >Nenhum Anúncio</span
              >
            </v-col>
            <v-col
              v-for="(anuncio, index) in anuncios"
              :key="index"
              cols="12"
              md="6"
            >
              <v-card elevation="0">
                <v-carousel height="200">
                  <!-- Verifica se existem imagens no anúncio -->
                  <v-carousel-item
                    v-for="(imagem, i) in anuncio.imagens"
                    :key="i"
                    :src="imagem"
                    cover
                  ></v-carousel-item>
                </v-carousel>
                <v-card-title>{{ anuncio.titulo }}</v-card-title>
                <v-card-subtitle>
                  <v-icon>mdi-map-marker</v-icon>
                  {{ anuncio.endereco }}</v-card-subtitle
                >

                <v-card-subtitle>
                  <v-icon>mdi-currency-usd</v-icon>
                  {{ anuncio.preco }}</v-card-subtitle
                >

                <v-card-actions>
                  <v-btn
                    target="_blank"
                    class="btnDetalhes"
                    text
                    link
                    :href="'/imoveis/detalhes?item=' + anuncio.id"
                  >
                    Ver Anuncio</v-btn
                  >
                  <v-btn
                    class="btnDetalhes"
                    text
                    link
                    :href="'/anunciante/editar?item=' + anuncio.id"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    Editar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar color="#4CAF50" v-model="alerta">
    {{ msgAlerta }}
  </v-snackbar>
</template>
<script>
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      edit: false,
      esqueleto: true,
      displayName: "",
      contato: "",
      uid: "",
      email: "",
      anuncios: [],
      alerta: false,
      msgAlerta: "",
    };
  },

  mounted() {
    // Verifica se há dados de usuário no localStorage ao montar o componente
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      this.uid = user.uid; // Define o UID do usuário na instância do componente
      this.buscarAnuncios(); // Carrega os anúncios do usuário
      this.getResponsavel(); // Carrega os dados do usuário
    } else {
      // Redireciona para login se não houver usuário logado
      this.$router.push("/login");
    }
  },

  methods: {
    toast(msg) {
      this.alerta = true;

      this.msgAlerta = msg;
      setTimeout(() => {
        this.alerta = false;
      }, 2000);
    },
    editar() {
      this.edit = true;
    },

    async atualizar() {
      this.edit = false;
      try {
        // Atualiza as informações do usuário no Firestore
        const usuarioRef = doc(db, "usuarios", this.uid);
        await updateDoc(usuarioRef, {
          displayName: this.displayName,
          contato: this.contato,
        });
        this.toast("Informações Atualizadas Com Sucesso!");
      } catch (erro) {
        console.error("Erro ao atualizar os dados:", erro);
      }
    },

    async getResponsavel() {
      try {
        // Recupera os dados do usuário logado do Firestore
        const usuarioRef = doc(db, "usuarios", this.uid);
        const usuario = await getDoc(usuarioRef);

        if (usuario.exists()) {
          const userData = usuario.data();

          this.displayName = userData.displayName;
          this.email = userData.email;
          this.contato = userData.contato;
        } else {
          console.log("Usuário não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    },

    async buscarAnuncios() {
      try {
        // Consulta os anúncios onde o campo 'uidResponsavel' é igual ao UID do usuário logado
        const anunciosQuery = query(
          collection(db, "imoveis"),
          where("uidResponsavel", "==", this.uid),
        );
        const querySnapshot = await getDocs(anunciosQuery);
        setTimeout(() => {
          // Armazena os anúncios no array `anuncios`
          this.anuncios = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          this.esqueleto = false;
        }, 1000);
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      }
    },
  },
};
</script>
