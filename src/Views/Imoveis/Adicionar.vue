<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container class="pa-4">
    <v-breadcrumbs :items="['Imóveis', 'Novo Imóvel']"></v-breadcrumbs>
    <v-card elevation="0">
      <v-card-title>
        <h3>Adicionar Imóvel</h3>
      </v-card-title>
    
      <v-card-text>
        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-col cols="12">
            <v-file-input
              label="Imagens do Imóvel"
              v-model="imovel.imagens"
              multiple
              variant="outlined"
              accept="image/*"
              prepend-icon="mdi-camera"
              :rules="[rules.required]"
              @change="uploadImagens"
            ></v-file-input>
          </v-col>
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
            <v-btn class="btn" @click="adicionarImovel">
              Adicionar Imóvel
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
  <v-snackbar color="#4CAF50" v-model="alerta">
    {{ msgAlerta }}
  </v-snackbar>
</template>
<script>
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db, storage } from "../../firebase"; // Certifique-se de que 'db' e 'storage' estejam configurados no seu firebase.js

export default {
  data() {
    return {
      isValid: false,
      alerta: false,
      msgAlerta: "",
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
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
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

    async adicionarImovel() {
      if (this.$refs.form.validate()) {
        // Crie um ID único para o imóvel
        const imovelId = `imovel-${await this.contarImoveis()}`; // Gerando um ID único para o imóvel
        const imovelRef = doc(db, "imoveis", imovelId); // Referência para o documento do imóvel

        try {
          // Enviar imagens para o Firebase Storage
          const uploadPromises = this.imovel.imagens.map(
            async (imagem, index) => {
              const imageRef = ref(
                storage,
                `imagens/imovel-${imovelId}/imagem-${index}`,
              );
              const snapshot = await uploadBytes(imageRef, imagem);
              const downloadURL = await getDownloadURL(snapshot.ref);
              return downloadURL; // Retorna o link da imagem
            },
          );

          // Espera todas as imagens serem carregadas
          const imagensURLs = await Promise.all(uploadPromises);

          // Agora você pode salvar o imóvel com as imagens no Firestore
          await setDoc(imovelRef, {
            ...this.imovel,
            imagens: imagensURLs, // Adicionando as URLs das imagens
          });

          // Resetar o formulário após adicionar o imóvel
          this.$refs.form.reset();
          this.toast("Imóvel adicionado com sucesso!"); // Mostrar a notificação
        } catch (error) {
          console.error("Erro ao adicionar imóvel:", error);
        }
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
