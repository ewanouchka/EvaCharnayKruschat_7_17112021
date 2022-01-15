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
      <label for="Name" class="form-label">Votre nom :</label>
      <input
        placeholder="Dupont"
        name="Name"
        id="Name"
        class="form-input"
        type="text"
        required
        pattern="^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z '-]{2,}$"
      />
      <span class="error-visible" id="error-message-Name"></span>

      <label for="Surname" class="form-label">Votre prénom : </label>
      <input
        placeholder="Dominique"
        name="Surname"
        id="Surname"
        class="form-input"
        type="text"
        required
        pattern="^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z '-]{2,}$"
      />

      <label for="Email" class="form-label">Votre e-mail : </label>
      <input
        placeholder="contact@groupomania.com"
        name="Email"
        id="Email"
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
        id="Password"
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
        id="Repeat-Password"
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
        window.location = "../";
      }
    },
    signupSubmit() {
      const inputValues = document.querySelectorAll(".form-input");
      const getInputValue = (inputId) => {
        const inputValue = document.querySelector(`#${inputId}`).value;
        return inputValue;
      };

      const checkAllValidity = () => {
        let validity = true;
        if (getInputValue("Password") !== getInputValue("Repeat-Password")) {
          validity = false;
        }
        for (const inputValue of inputValues) {
          if (inputValue.validity.valid == false) {
            validity = false;
            inputValue.classList.add("input-invalid");
          }
        }
        return validity;
      };
      checkAllValidity();

      if (checkAllValidity()) {
        (async () => {
          try {
            const signupSent = await fetch(
              "http://localhost:3000/api/auth/signup",
              {
                method: "POST",
                body: JSON.stringify({
                  first_name: getInputValue("Surname"),
                  last_name: getInputValue("Name"),
                  email: getInputValue("Email"),
                  password: getInputValue("Password"),
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
      } else {
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          "Assurez-vous que tous les champs sont correctement renseignés :\n- Le nom et le prénom doivent comporter au moins deux caractères alphabétiques, sans caractère numérique.\n- L'email doit être valide.\n- Le mot de passe doit contenir au moins huit caractères dont une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&()_+=-).\n- Le mot de passe ressaisi doit être identique au premier."
        );
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
