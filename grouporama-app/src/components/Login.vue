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
    <Popup />
  </div>
</template>

<script>
import Popup from "@/components/Popup.vue";

export default {
  name: "Login",
  components: {
    Popup,
  },
  methods: {
    changeMessage(newMessage, newDetail) {
      const popupMessage = document.querySelector(".popup-bloc__msg");
      const popupDetail = document.querySelector(".popup-bloc__detail");
      popupMessage.innerHTML = newMessage;
      popupDetail.innerHTML = newDetail;
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

      const popupContainer = document.querySelector(".popup-container");

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
              popupContainer.classList.add("popup-container-visible");
              this.changeMessage("Une erreur est survenue :", `${loginBacksent.error}`);
              document.querySelector("#close-popup").addEventListener("click", function () {
                popupContainer.classList.remove("popup-container-visible");
              });
            } else {
              const userAuth = {
                userId: loginBacksent.userId,
                token: loginBacksent.token,
              };
              localStorage.setItem("userAuth", JSON.stringify(userAuth));

              popupContainer.classList.add("popup-container-visible");
              this.changeMessage("Vous êtes maintenant connecté !", "");
              document.querySelector("#close-popup").addEventListener("click", function () {
                popupContainer.classList.remove("popup-container-visible");
                window.location.reload();
              });
            }
          } catch (error) {
            popupContainer.classList.add("popup-container-visible");
            this.changeMessage("Une erreur est survenue :", `${error}`);
            document.querySelector("#close-popup").addEventListener("click", function () {
              popupContainer.classList.remove("popup-container-visible");
            });
          }
        })();
      } else {
        popupContainer.classList.add("popup-container-visible");
        this.changeMessage(
          "Les informations saisies ne sont pas valides.",
          `<p>Assurez-vous que tous les champs sont correctement renseignés :</p>
          <p>- L'email doit être valide.</p>
          <p>- Le mot de passe doit contenir au moins huit caractères dont une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&()_+=-).</p>`
        );
        document.querySelector("#close-popup").addEventListener("click", function () {
          popupContainer.classList.remove("popup-container-visible");
        });
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
