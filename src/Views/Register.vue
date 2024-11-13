<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid class="login-container">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-row justify="center" class="mb-6">
            <h1 class="text-center font-weight-bold">Cadastrar</h1>
          </v-row>

          <v-form class="mb-4" @submit.prevent="createAccount">
            <v-row>
              <v-col>
                <v-text-field
                  :disabled="alerta == true"
                  v-model="nome"
                  label="Nome Completo"
                  type="text"
                  outlined
                  dense
                  class="mb-4"
                  variant="outlined"
                  required
                />
                <v-text-field
                  :disabled="alerta == true"
                  v-model="contato"
                  label="Número para Contato"
                  outlined
                  v-mask="'(##)# ####-####'"
                  dense
                  class="mb-4"
                  variant="outlined"
                  required
                />
                <v-text-field
                  :disabled="alerta == true"
                  v-model="email"
                  label="Email"
                  type="email"
                  outlined
                  dense
                  class="mb-4"
                  variant="outlined"
                  required
                  :rules="rules.email"
                />
                <v-text-field
                  :disabled="alerta == true"
                  v-model="password"
                  label="Senha"
                  type="password"
                  outlined
                  dense
                  class="mb-4"
                  variant="outlined"
                  required
                  :rules="rules.password"
                />
              </v-col>
            </v-row>

            <v-btn block class="btn" large type="submit" :loading="loading">
              Criar Conta
            </v-btn>

            <v-row justify="center">
              <v-btn
                href="/login"
                link
                style="
                  box-shadow: none;
                  margin-top: 25px;
                  font-size: 9pt;
                  font-weight: 400;
                "
              >
                Já tem uma conta?<span class="font-weight-bold">
                  Entre agora!</span
                >
              </v-btn>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar color="#4CAF50" v-model="alerta">
      {{ msgAlerta }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase"; // Importa a configuração do Firebase
import { doc, setDoc } from "firebase/firestore";
export default {
  data() {
    return {
      alerta: false,
      msgAlerta: "",
      nome: "",
      email: "",
      password: "",
      loading: false, // Variável de loading para o botão
      rules: {
        email: [
          (v) => !!v || "E-mail é obrigatório", // Verifica se o campo não está vazio
          (v) => /.+@.+\..+/.test(v) || "E-mail inválido", // Verifica se o e-mail tem um formato válido
        ],
        password: [
          (v) => !!v || "Senha é obrigatória",
          (v) => v.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
        ],
      },
    };
  },

  methods: {
    toast(msg) {
      this.alerta = true;

      this.msgAlerta = msg;
      setTimeout(() => {
        this.alerta = false;
      }, 2000);
    },

    async createAccount() {
      this.loading = true;
      try {
        // Criação do usuário no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password,
        );
        const user = userCredential.user;
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
          }),
        );
        // Atualizar o nome de exibição do usuário no Firebase Auth
        await updateProfile(user, {
          displayName: this.nome, // O displayName pode ser atribuído conforme o campo fornecido
        });

        // Salvar o usuário no Firestore na coleção "usuarios"
        await setDoc(doc(db, "usuarios", user.uid), {
          email: this.email,
          displayName: this.nome,
          contato: this.contato,
          createdAt: new Date(), // Pode adicionar outras informações que desejar
        });

        this.loading = false;
        this.toast("Sua conta foi Criada! Seja Bem-vindo(a)");
        setTimeout(() => {
          this.$router.push("/perfil");
        }, 1000);
      } catch (error) {
        this.loading = false;
        this.handleError(error);
      }
    },

    // Função para tratar os erros
    handleError(error) {
      const errorCode = error.code;

      switch (errorCode) {
        case "auth/email-already-in-use":
          this.toast(
            "A conta já existe. Tente fazer login ou use um e-mail diferente.",
          );
          break;
        case "auth/weak-password":
          this.toast("A senha deve ter pelo menos 6 caracteres.");
          break;
        case "auth/invalid-email":
          this.toast("O endereço de e-mail não é válido.");
          break;
        default:
          this.toast("Ocorreu um erro desconhecido. Tente novamente.");
      }
    },
  },
};
</script>
<style scoped>
/* Estilos conforme seu layout */
</style>
