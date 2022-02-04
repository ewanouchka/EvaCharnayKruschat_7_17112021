<template>
  <div class="signup">
    <router-link to="/"
      ><img
        alt="logo above Groupomania"
        src="../assets/icon-above-font.svg"
        class="home__logo"
    /></router-link>
    <h1>Enregistrez votre compte utilisateur</h1>
    <p>Veuillez remplir tous les champs</p>
    <form id="signup-form">
      <label for="Name" class="form-label"
        >Votre nom : {{ name.pattern }}</label
      >
      <input
        placeholder="Dupont"
        name="Name"
        v-model="name"
        class="form-input"
        type="text"
        required
        pattern="^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z '-]{2,}$"
      />

      <label for="Surname" class="form-label">Votre prénom : </label>
      <input
        placeholder="Dominique"
        name="Surname"
        v-model="surname"
        class="form-input"
        type="text"
        required
        pattern="^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z '-]{2,}$"
      />

      <label for="Email" class="form-label">Votre e-mail : </label>
      <input
        placeholder="contact@groupomania.com"
        name="Email"
        v-model="email"
        class="form-input"
        type="email"
        required
        pattern="^[a-zA-Z0-9]+[a-zA-Z._-]*@{1}[a-zA-Z0-9]+[.]{1}[a-zA-Z]{2,}$"
      />

      <!-- oninput="checkValidity(this)" -->
      <label for="Password" class="form-label">Votre mot de passe : </label>
      <input
        placeholder="123456AzErTy*"
        name="Password"
        v-model="password"
        class="form-input"
        type="password"
        required
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_+=-])[A-Za-z\d@$!%*?&()_+=-]{8,}$"
      />

      <label for="Repeat-Password" class="form-label"
        >Répétez votre mot de passe :
      </label>
      <input
        placeholder="123456AzErTy*"
        name="Repeat-Password"
        v-model="repeatedPassword"
        class="form-input"
        type="password"
        required
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_+=-])[A-Za-z\d@$!%*?&()_+=-]{8,}$"
      />

      <button @click.prevent="signupSubmit" class="button" id="signup-submit">
        S'enregistrer
      </button>
    </form>
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
  name: "Signup",
  components: {
    Popup,
  },
  data() {
    return {
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      name: "",
      surname: "",
      email: "",
      password: "",
      repeatedPassword: "",
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
        this.$router.push({
          name: "Home",
        });
        this.$router.go();
      }
    },
    checkTextValidity(text, pattern) {
      // on supprime les espaces au début et à la fin de la chaîne
      text = text.trim();
      // on bloque si des champs requis sont manquants
      if (!text || text.length <= 3 || !pattern.test(text)) {
        return false;
      } else {
        return true;
      }
    },
    checkValiditySignup() {
      // constantes pattern de validation
      const nameRegex = new RegExp(
        `^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z '-]{2,}$`
      );
      const emailRegex = new RegExp(
        `^[a-zA-Z0-9]+[a-zA-Z._-]*@{1}[a-zA-Z0-9]+[.]{1}[a-zA-Z]{2,}$`
      );
      const passwordRegex = new RegExp(
        `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&()_+=-])[A-Za-z\\d@$!%*?&()_+=-]{8,}$`
      );

      if (
        !this.checkTextValidity(this.name, nameRegex) ||
        !this.checkTextValidity(this.surname, nameRegex) ||
        !this.checkTextValidity(this.email, emailRegex) ||
        !this.checkTextValidity(this.password, passwordRegex) ||
        !this.checkTextValidity(this.repeatedPassword, passwordRegex)
      ) {
        this.inputValidity = false;
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          "Assurez-vous que tous les champs sont correctement renseignés :\n- Le nom et le prénom doivent comporter au moins deux caractères alphabétiques, sans caractère numérique.\n- L'email doit être valide.\n- Le mot de passe doit contenir au moins huit caractères dont une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&()_+=-)."
        );
        return;
      }
      if (this.password !== this.repeatedPassword) {
        this.inputValidity = false;
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          "- Le mot de passe ressaisi doit être identique au premier."
        );
      } else {
        this.inputValidity = true;
      }
    },
    signupSubmit() {
      this.checkValiditySignup();

      if (this.inputValidity) {
        (async () => {
          try {
            const signupSent = await fetch(
              "http://localhost:3000/api/auth/signup",
              {
                method: "POST",
                body: JSON.stringify({
                  first_name: this.surname,
                  last_name: this.name,
                  email: this.email,
                  password: this.password,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const signupBacksent = await signupSent.json();

            if (!signupBacksent.userId) {
              this.showPopup(
                "Une erreur est survenue :",
                `${signupBacksent.error}`
              );
            } else {
              const userAuth = {
                userId: signupBacksent.userId,
                token: signupBacksent.token,
              };
              localStorage.setItem("userAuth", JSON.stringify(userAuth));

              this.showPopup("Utilisateur enregistré !", "");
            }
          } catch (error) {
            this.showPopup(
              "Impossible d'enregistrer cet utilisateur.",
              "Il est possible que le serveur rencontre des difficultés, ou bien cet e-mail est déjà enregistré. Veuillez vérifier votre saisie et renouveler votre demande."
            );
          }
        })();
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#signup-form {
  display: flex;
  justify-content: center;
  align-self: center;
  flex-wrap: wrap;
  background: var(--color-primary-transparent);
  border-radius: 0.5rem;
}
</style>
