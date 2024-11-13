<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container class="pa-4">
    <v-breadcrumbs
      :items="['Imóveis', 'Editar Imóvel', imovel.titulo]"
    ></v-breadcrumbs>
    <v-card elevation="0">
      <v-card-title>
        <h3>Editar Imóvel</h3>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-row dense>
            <!-- Título e Tipo do imóvel -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Título"
                v-model="imovel.titulo"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                label="Tipo de Imóvel"
                v-model="imovel.tipo"
                :items="['Apartamento', 'Casa', 'Comercial']"
                variant="outlined"
                :rules="[rules.required]"
              ></v-select>
            </v-col>

            <!-- Descrição do imóvel -->
            <v-col cols="12">
              <v-textarea
                label="Descrição"
                v-model="imovel.descricao"
                variant="outlined"
                :rules="[rules.required]"
                rows="4"
              ></v-textarea>
            </v-col>

            <!-- Preço e Área -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Preço"
                v-model="imovel.preco"
                variant="outlined"
                :rules="[rules.required, rules.isNumber]"
                prefix="R$"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Área (m²)"
                v-model="imovel.area"
                variant="outlined"
                :rules="[rules.required, rules.isNumber]"
                type="number"
              ></v-text-field>
            </v-col>

            <!-- Endereço do imóvel -->
            <v-col cols="12">
              <v-text-field
                label="Endereço"
                v-model="imovel.endereco"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <!-- Número de Quartos e Banheiros -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Quartos"
                v-model="imovel.quartos"
                variant="outlined"
                :rules="[rules.required, rules.isNumber]"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Banheiros"
                v-model="imovel.banheiros"
                variant="outlined"
                :rules="[rules.required, rules.isNumber]"
                type="number"
              ></v-text-field>
            </v-col>

            <!-- Upload de Imagens -->
          </v-row>

          <!-- Botão de Adicionar Imóvel -->
          <v-row style="justify-content: right" class="mt-4">
            <v-btn
              @click="this.dialogExcluir = true"
              class="btn"
              style="background-color: red !important"
              color="red"
            >
              Excluir Imóvel
            </v-btn>
            <v-btn
              class="btn"
              target="_blank"
              :href="'/imoveis/detalhes?item=' + imovel.id"
            >
              Detalhes do Imóvel
            </v-btn>
            <v-btn class="btn" @click="atualizarImovel">
              Atualizar Imóvel
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
  <v-snackbar color="#4CAF50" v-model="alerta">
    {{ msgAlerta }}
  </v-snackbar>
  <v-dialog v-model="dialogExcluir" max-width="400">
    <v-card>
      <v-card-title class="headline">Deseja excluir o anúncio?</v-card-title>
      <v-card-text>
        Ação sem volta. Tem certeza de que deseja continuar?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- Botão para voltar -->
        <v-btn color="grey" text @click="dialogExcluir = false">Voltar</v-btn>
        <!-- Botão para excluir -->
        <v-btn color="red" text @click="excluirImovel">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  doc,
  getDocs,
  getDoc,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Certifique-se de que 'db' e 'storage' estejam configurados no seu firebase.js

export default {
  data() {
    return {
      isValid: false,
      alerta: false,
      dialogExcluir: false,
      msgAlerta: "",
      item: this.getItemFromURL(),
      activeItemIndex: 0,
      imovel: {
        uidResponsavel: "",
        titulo: "",
        descricao: "",
        preco: "",
        endereco: "",
        quartos: "",
        banheiros: "",
        area: "",
        tipo: "",
        imagens: [],
        data: this.getCurrentDate(),
      },
      imagensUrls: [],
      displayName: "",
      email: "",
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
        isNumber: (value) => !isNaN(value) || "Este campo deve ser um número.",
      },
    };
  },
  mounted() {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      this.imovel.uidResponsavel = user.uid;
      this.getImovel();
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    async excluirImovel() {
      try {
        // Cria a referência ao documento que será excluído
        const imovelRef = doc(db, "imoveis", this.imovel.id);

        // Exclui o documento
        await deleteDoc(imovelRef);

        // Exibe uma mensagem de sucesso
        this.toast("Imóvel Excluído Com Sucesso!");

        // Redireciona para outra rota após um pequeno delay
        setTimeout(() => {
          this.$router.push("/perfil");
        }, 500);
      } catch (erro) {
        console.error("Erro ao excluir imóvel:", erro);
      }
    },
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
          this.toast("Erro nao buscar imóvel");
          this.$router.push("/404");
        } else {
          this.imovel = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          };
        }
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
      }
    },
    getCurrentDate() {
      const today = new Date(); // Obtém a data atual
      const day = String(today.getDate()).padStart(2, "0"); // Dia com 2 dígitos
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Mês com 2 dígitos (lembrando que os meses começam em 0)
      const year = today.getFullYear(); // Ano com 4 dígitos

      return `${day}/${month}/${year}`; // Formato dia/mês/ano
    },
    toast(msg) {
      this.alerta = true;

      this.msgAlerta = msg;
      setTimeout(() => {
        this.alerta = false;
      }, 2000);
    },
    async contarImoveis() {
      try {
        // Recupera todos os documentos da coleção 'imoveis'
        const querySnapshot = await getDocs(collection(db, "imoveis"));
        // Retorna a quantidade de documentos encontrados na coleção
        return querySnapshot.size + 1; // Adiciona 1 ao tamanho da coleção para o próximo ID
      } catch (error) {
        console.error("Erro ao contar imóveis:", error);
        return 0; // Retorna 0 caso ocorra algum erro
      }
    },

    async atualizarImovel() {
      if (this.$refs.form.validate()) {
        // Crie um ID único para o imóvel
        console.log(this.imovel.id);
        const imovelRef = doc(db, "imoveis", this.imovel.id); // Referência para o documento do imóvel

        // Agora você pode salvar o imóvel com as imagens no Firestore
        await updateDoc(imovelRef, {
          ...this.imovel,
        });

        this.toast("Imóvel atualizado com sucesso!"); // Mostrar a notificação
      }
    },
  },
};
</script>

<style scoped>
.pa-4 {
  padding: 16px;
}
</style>
