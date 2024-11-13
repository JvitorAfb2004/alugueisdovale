<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container fluid class="login-container">
    <v-row justify="center">
      <!-- Card de Login -->
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-row justify="center" class="mb-6">
            <h1 class="text-center font-weight-bold">Entrar</h1>
          </v-row>

          <!-- Formulário -->
          <v-form v-model="valid" class="mb-4">
            <v-text-field
              label="Email"
              type="email"
              v-model="email"
              outlined
              dense
              class="mb-4"
              variant="outlined"
            />
            <v-text-field
              label="Senha"
              type="password"
              v-model="password"
              dense
              class="mb-4"
              variant="outlined"
            />
            <!-- Botão Login -->
            <v-btn @click="login" block class="mb-4 btn" large> Entrar </v-btn>

            <!-- Link para criar conta -->
            <v-row justify="center">
              <v-btn
                href="/register"
                link
                style="box-shadow: none; margin-top: 20px; font-size: 9pt"
              >
                Não tem uma conta?
                <span class="font-weight-bold">Crie uma</span>
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Importe a configuração do Firebase

export default {
  data() {
    return {
      alerta: false,
      msgAlerta: "",
      email: "",
      password: "",
      valid: false,
    };
  },

  methods: {
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password,
        );
        const user = userCredential.user;

        // Salvar informações no localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
          }),
        );
        this.toast("Seja bem-vindo novamente!");
        setTimeout(() => {
          this.$router.push("/");
        }, 1000);
      } catch (error) {
        this.handleError(error);
      }
    },

    handleError(error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case "auth/invalid-credential":
          this.toast("Email ou Senha incorreta!");
          break;
        case "auth/user-not-found":
          this.toast("Usuário não encontrado.");
          break;
        case "auth/wrong-password":
          this.toast("Senha incorreta.");
          break;
        default:
          this.toast("Ocorreu um erro desconhecido.");
      }

      console.error(errorMessage); // Exibe o erro no console
    },

    toast(msg) {
      this.alerta = true;

      this.msgAlerta = msg;
      setTimeout(() => {
        this.alerta = false;
      }, 2000);
    },
  },
};
</script>

<style scoped>
/* Estilos para centralizar o layout */
.login-container {
  box-shadow: none !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Card de Login */
.v-card {
  background-color: #ffffff;
  border-radius: 15px !important;
  box-shadow: none !important;
}

/* Estilos para os campos de input */
.v-text-field {
  border-radius: 4px;
}

/* Estilos para o título */
h1 {
  color: #333;
  font-size: 24px;
  font-weight: bold;
}
</style>
