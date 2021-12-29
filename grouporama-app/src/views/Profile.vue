<template>
  <div class="profile">
    <img
      alt="logo above Groupomania"
      src="../assets/icon-above-font.svg"
      class="home__logo"
    />
    <section>
      <div v-if="isEditVisible === true" id="profile-edit">
        <h1>Modifier votre profil</h1>
        <form id="profile-form">
          <label for="Nom" class="form-label">Votre nom :</label>
          <input
            placeholder="Dupont"
            name="Name"
            id="Name"
            class="form-input"
            type="text"
            pattern="^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z '-]{2,}$"
          />
          <span class="error-visible" id="error-message-Name"></span>

          <label for="Prénom" class="form-label"
            >Votre prénom :
            <span class="error-visible" id="error-message-Surname"></span>
          </label>
          <input
            placeholder="Dominique"
            name="Surname"
            id="Surname"
            class="form-input"
            type="text"
            pattern="^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z '-]{2,}$"
          />

          <label for="Email" class="form-label"
            >Votre e-mail :
            <span class="error-visible" id="error-message-Email"></span>
          </label>
          <input
            placeholder="contact@groupomania.com"
            name="Email"
            id="Email"
            class="form-input"
            type="email"
            pattern="^[a-zA-Z0-9]+[a-zA-Z._-]*@{1}[a-zA-Z0-9]+[.]{1}[a-zA-Z]{2,}$"
          />

          <label for="Password" class="form-label"
            >Votre mot de passe :
            <span class="error-visible" id="error-message-Password"></span>
          </label>
          <input
            placeholder="123456AzErTy*"
            name="Password"
            id="Password"
            class="form-input"
            type="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_+=-])[A-Za-z\d@$!%*?&()_+=-]{8,}$"
          />

          <label for="RepeatPassword" class="form-label"
            >Répétez votre mot de passe :
            <span
              class="error-visible"
              id="error-message-Repeat-Password"
            ></span>
          </label>
          <input
            placeholder="123456AzErTy*"
            name="Repeat-Password"
            id="Repeat-Password"
            class="form-input"
            type="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_+=-])[A-Za-z\d@$!%*?&()_+=-]{8,}$"
          />

          <button @click.prevent="confirmEdit" class="button" id="edit-profile">
            Enregistrer les modifications
          </button>
        </form>
      </div>

      <div v-else-if="isSupprVisible === true" id="profile-suppr">
        <h1>Supprimer votre compte</h1>
        <form id="profile-form">
          <label for="Password" class="form-label"
            >Saisissez votre mot de passe :
            <span class="error-visible" id="error-message-Password"></span>
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

          <label for="RepeatPassword" class="form-label"
            >Répétez votre mot de passe :
            <span
              class="error-visible"
              id="error-message-Repeat-Password"
            ></span>
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

          <button
            @click.prevent="confirmSuppr"
            class="button"
            id="suppr-profile"
          >
            Supprimer votre compte
          </button>
        </form>
      </div>

      <div v-else id="profile-content">
        <h1>Votre profil</h1>
        <div class="profile-card">
          <h1>{{ userFirstName }} {{ userLastName }}</h1>
          <p>{{ userEmail }}</p>
        </div>

        <button @click.prevent="showEdit" class="button" id="show-edit">
          Modifier votre profil
        </button>

        <button @click.prevent="showSuppr" class="button" id="show-suppr">
          Supprimer votre compte
        </button>
      </div>
    </section>
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
  name: "Profile",
  components: {
    Popup,
  },
  props: ["userSurname", "userName", "email"],
  data: function () {
    return {
      welcome: "Bienvenue",
      userFirstName: this.userSurname,
      userLastName: this.userName,
      userEmail: this.email,
      isEditVisible: false,
      isSupprVisible: false,
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
        console.log(localStorage.getItem("userAuth"));
      }
    },
    showEdit() {
      this.isEditVisible = true;
    },
    confirmEdit() {
      this.isEditVisible = false;
    },
    showSuppr() {
      this.isSupprVisible = true;
    },
    confirmSuppr() {
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
            inputValue.classList.add("input-invalid");
          }
        }
        return validity;
      };
      checkAllValidity();

      if (checkAllValidity()) {
        (async () => {
          try {
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            const deletionSent = await fetch(
              "http://localhost:3000/api/auth/deleteUser",
              {
                method: "POST",
                body: JSON.stringify({
                  userId: JSON.parse(localStorage.getItem("userAuth")).userId,
                  password: getInputValue("Password"),
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
            const deletionBackSent = await deletionSent.json();

            console.log("deletionSent");
            console.log(deletionSent);
            console.log("deletionBackSent");
            console.log(deletionBackSent);
          } catch (error) {
            this.showPopup("Une erreur est survenue :", `${error}`);
          }
        })();
        this.isSupprVisible = false;
      } else {
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          `Assurez-vous que tous les champs sont correctement renseignés :\n- Le mot de passe doit contenir au moins huit caractères dont une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&()_+=-).\n- Le mot de passe répété doit être identique au premier.`
        );
      }
    },
    getUserProfile() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      const userId = JSON.parse(localStorage.getItem("userAuth")).userId;

      (async () => {
        try {
          const userProfile = await fetch("http://localhost:3000/api/profile", {
            method: "POST",
            body: JSON.stringify({
              userId: `${userId}`,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });

          const userProfileJSON = await userProfile.json();

          if (userProfileJSON) {
            this.userFirstName = userProfileJSON.first_name;
            this.userLastName = userProfileJSON.last_name;
            this.userEmail = userProfileJSON.email;
            return;
          }
        } catch (error) {
          console.log("impossible d'accéder au profil utilisateur");
        }
      })();
    },
  },
  beforeMount() {
    this.getUserProfile();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.profile-card {
  border: 2px solid var(--color-secondary);
  border-radius: 0.5rem;
  width: 66%;
  margin: auto;
}

#profile-form {
  display: flex;
  justify-content: center;
  align-self: center;
  flex-wrap: wrap;
  max-width: 40rem;
  background: var(--color-primary-transparent);
  border-radius: 0.5rem;
}
</style>
