<template>
  <div class="login">
    <h1>Bienvenue !</h1>
    <p>Connectez-vous à votre compte utilisateur</p>
    <form id="login-form">
      <label for="email">Votre e-mail : </label>
      <input
        placeholder="contact@groupomania.com"
        id="email"
        v-model="email"
        class="form-input"
        type="email"
        required
      />
      <!-- oninput="checkValidity(this)" -->

      <label for="password">Votre mot de passe : </label>
      <input
        placeholder="1234AzErTy*"
        id="password"
        v-model="password"
        class="form-input"
        type="password"
        required
      />

      <button @click.prevent="loginSubmit" class="button" id="login-submit">
        Connexion
      </button>
    </form>
    <router-link to="/signup" class="bottom-link"
      >Vous n'avez pas encore de compte ?</router-link
    >
    <Popup
      v-if="isPopupVisible === true"
      @close="closePopup"
      :msg="msg"
      :detail="detail"
    />
  </div>
</template>

<script>
import Popup from "@/components/Popup.vue";

export default {
  name: "Login",
  components: {
    Popup,
  },
  data() {
    return {
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      email: "",
      password: "",
      inputValidity: false,
    };
  },
  methods: {
    showPopup(newMessage, newDetail) {
      this.isPopupVisible = true;
      this.msg = newMessage;
      this.detail = newDetail;
    },
    closePopup() {
      this.isPopupVisible = false;
      if (localStorage.getItem("userAuth")) {
        this.$router.go();
      }
    },
    checkTextValidity(text, pattern) {
      // on supprime les espaces au début et à la fin de la chaîne
      text = text.trim();
      // on bloque si des champs requis sont manquants
      if (!text || !pattern.test(text)) {
        return false;
      } else {
        return true;
      }
    },
    checkValidityLogin() {
      // constantes pattern de validation
      const emailRegex = new RegExp(
        `^[a-zA-Z0-9]+[a-zA-Z._-]*@{1}[a-zA-Z0-9]+[.]{1}[a-zA-Z]{2,}$`
      );
      const passwordRegex = new RegExp(
        `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&()_+=-])[A-Za-z\\d@$!%*?&()_+=-]{8,}$`
      );

      if (
        !this.checkTextValidity(this.email, emailRegex) ||
        !this.checkTextValidity(this.password, passwordRegex)
      ) {
        this.inputValidity = false;
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          `Assurez-vous que tous les champs sont correctement renseignés :\n- L'email doit être valide.\n- Le mot de passe doit contenir au moins huit caractères dont une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&()_+=-).`
        );
        return;
      } else {
        this.inputValidity = true;
      }
    },
    loginSubmit() {
      this.checkValidityLogin();

      if (this.inputValidity) {
        (async () => {
          try {
            const loginSent = await fetch(
              "http://localhost:3000/api/auth/login",
              {
                method: "POST",
                body: JSON.stringify({
                  email: this.email,
                  password: this.password,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const loginBacksent = await loginSent.json();

            if (!loginBacksent.userId) {
              this.showPopup(
                "Une erreur est survenue :",
                `${loginBacksent.error}`
              );
            } else {
              const userAuth = {
                userId: loginBacksent.userId,
                token: loginBacksent.token,
              };
              localStorage.setItem("userAuth", JSON.stringify(userAuth));

              this.showPopup("Vous êtes maintenant connecté !", "");
            }
          } catch (error) {
            this.showPopup("Une erreur est survenue :", `${error}`);
          }
        })();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#login-form {
  display: flex;
  justify-content: center;
  align-self: center;
  flex-wrap: wrap;
  background: var(--color-primary-transparent);
  border-radius: 0.5rem;
  margin: 0 0 1rem 0;
}
</style>
