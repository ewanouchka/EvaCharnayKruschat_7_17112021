<template>
  <div class="login">
    <h1>Bienvenue !</h1>
    <p>Connectez-vous à votre compte utilisateur</p>
    <form id="login-form">
      <label for="Email" class="form-label"
        >Votre e-mail : <span class="error-visible" id="error-message-Email"></span>
      </label>
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

      <label for="Password" class="form-label"
        >Votre mot de passe : <span class="error-visible" id="error-message-Password"></span>
      </label>
      <input
        placeholder="123456AzErTy*"
        name="Password"
        id="Password"
        class="form-input"
        type="password"
        required
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_+=-])[A-Za-z\d@$!%*?&()_+=-]{8,}$"
      />

      <button @click.prevent="loginSubmit" class="button" id="login-submit">Connexion</button>
      <router-link to="/signup" class="create-account">Vous n'avez pas encore de compte ?</router-link>
    </form>
    <Popup v-if="isPopupVisible === true" @close="closePopup" :msg="msg" :detail="detail" />
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
        msg: "message de base",
        detail: "detail de base",
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
        if(localStorage.getItem("userAuth")) {
              window.location.reload();
        }
      },
    loginSubmit() {
      const inputValues = document.querySelectorAll(".form-input");
      const getInputValue = (inputId) => {
        const inputValue = document.querySelector(`#${inputId}`).value;
        return inputValue;
      };

      const checkAllValidity = () => {
        let validity = true;
        for (const inputValue of inputValues) {
          if (inputValue.validity.valid == false) {
            validity = false;
          }
        }
        return validity;
      };
      checkAllValidity();

      if (checkAllValidity()) {
        (async () => {
          try {
            const loginSent = await fetch("http://localhost:3000/api/auth/login", {
              method: "POST",
              body: JSON.stringify({
                email: getInputValue("Email"),
                password: getInputValue("Password"),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const loginBacksent = await loginSent.json();

            if (!loginBacksent.userId) {
              this.showPopup("Une erreur est survenue :", `${loginBacksent.error}`);
            } else {
              const userAuth = {
                userId: loginBacksent.userId,
                token: loginBacksent.token,
              };
              localStorage.setItem("userAuth", JSON.stringify(userAuth));

        this.showPopup("Vous êtes maintenant connecté !", "");
            }
          } catch (error) {this.showPopup("Une erreur est survenue :", `${error}`);
          }
        })();
      } else {
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          `Assurez-vous que tous les champs sont correctement renseignés :\n- L'email doit être valide.\n- Le mot de passe doit contenir au moins huit caractères dont une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&()_+=-).`
        );
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
  max-width: 40rem;
}

.create-account {
  width: 100%;
}
</style>
