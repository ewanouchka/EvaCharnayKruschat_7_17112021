<template>
  <div class="profile">
    <router-link to="/"
      ><img
        alt="logo above Groupomania"
        src="../assets/icon-above-font.svg"
        class="home__logo"
    /></router-link>
    <section>
      <div v-if="isEditVisible === true" id="profile-edit">
        <h1>Modifier votre profil</h1>
        <form id="profile-form">
          <label for="name">Votre nom :</label>
          <input
            placeholder="Dupont"
            id="name"
            v-model="name"
            class="form-input"
            type="text"
          />
          <label for="surname">Votre prénom : </label>
          <input
            placeholder="Dominique"
            id="surname"
            v-model="surname"
            class="form-input"
            type="text"
          />

          <label for="email">Votre e-mail : </label>
          <input
            placeholder="contact@groupomania.com"
            id="email"
            v-model="email"
            class="form-input"
            type="email"
          />

          <label for="password">Votre mot de passe : </label>
          <input
            placeholder="123456AzErTy*"
            id="password"
            v-model="password"
            class="form-input"
            type="password"
          />

          <label for="repeat-password">Répétez votre mot de passe : </label>
          <input
            placeholder="123456AzErTy*"
            id="repeat-password"
            v-model="repeatedPassword"
            class="form-input"
            type="password"
          />

          <button @click.prevent="confirmEdit" class="button" id="edit-profile">
            Enregistrer les modifications
          </button>
        </form>
      </div>

      <div v-else-if="isSupprVisible === true" id="profile-suppr">
        <h1>Supprimer votre compte</h1>
        <form id="profile-form">
          <label for="password">Saisissez votre mot de passe : </label>
          <input
            placeholder="123456AzErTy*"
            id="password"
            v-model="password"
            class="form-input"
            type="password"
            required
          />

          <label for="repeat-password">Répétez votre mot de passe : </label>
          <input
            placeholder="123456AzErTy*"
            id="repeat-password"
            v-model="repeatedPassword"
            class="form-input"
            type="password"
            required
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
          <h1>{{ surname }} {{ name }}</h1>
          <p>{{ email }}</p>
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
  data: function () {
    return {
      name: "",
      surname: "",
      email: "",
      password: "",
      repeatedPassword: "",
      isEditVisible: false,
      isSupprVisible: false,
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      isLoggedIn: true,
      isDeleted: false,
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
      if (this.isDeleted) {
        this.$router.push({
          name: "Home",
        });
        localStorage.removeItem("userAuth");
        this.$router.go();
      }
      if (this.isLoggedIn == false) {
        localStorage.removeItem("userAuth");
        this.$router.push({
          name: "Home",
        });
      } else {
        this.getUserProfile();
      }
    },
    checkTextValidity(text, pattern) {
      // on supprime les espaces au début et à la fin de la chaîne
      text = text.trim();
      // on bloque si des champs requis sont manquants
      if (text && !pattern.test(text)) {
        return false;
      } else {
        return true;
      }
    },
    checkValidityEdit() {
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
        !this.name &&
        !this.surname &&
        !this.email &&
        !this.password &&
        !this.repeatedPassword
      ) {
        this.inputValidity = false;
        this.showPopup("Aucune modification apportée.", "");
        return;
      }
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
          "Le mot de passe ressaisi doit être identique au premier."
        );
      } else {
        this.inputValidity = true;
      }
    },
    checkValiditySuppr() {
      // constantes pattern de validation
      const passwordRegex = new RegExp(
        `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&()_+=-])[A-Za-z\\d@$!%*?&()_+=-]{8,}$`
      );

      if (!this.password || !this.repeatedPassword) {
        this.inputValidity = false;
        this.showPopup("Veuillez renseigner tous les champs.", "");
        return;
      }
      if (
        !this.checkTextValidity(this.password, passwordRegex) ||
        !this.checkTextValidity(this.repeatedPassword, passwordRegex)
      ) {
        this.inputValidity = false;
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          "Le mot de passe doit contenir au moins huit caractères dont une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&()_+=-)."
        );
        return;
      }
      if (this.password !== this.repeatedPassword) {
        this.inputValidity = false;
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          "Le mot de passe ressaisi doit être identique au premier."
        );
        return;
      } else {
        this.inputValidity = true;
      }
    },
    showEdit() {
      this.isEditVisible = true;
    },
    confirmEdit() {
      this.checkValidityEdit();

      if (this.inputValidity) {
        (async () => {
          try {
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            const userId = this.$route.params.userId;

            const updateSent = await fetch(
              `http://localhost:3000/api/profiles/${userId}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  userId: `${userId}`,
                  first_name: this.surname,
                  last_name: this.name,
                  email: this.email,
                  password: this.password,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
            const updateBackSent = await updateSent.json();

            if (updateBackSent.error) {
              this.showPopup(
                "Une erreur est survenue :",
                `${updateBackSent.error}`
              );
            } else {
              this.showPopup("Les modifications sont enregistrées !", "");
            }
          } catch (error) {
            this.showPopup("Une erreur est survenue :", `${error}`);
          }
        })();
        this.isEditVisible = false;
      }
    },
    showSuppr() {
      this.isSupprVisible = true;
    },
    confirmSuppr() {
      this.checkValiditySuppr();

      if (this.inputValidity) {
        (async () => {
          try {
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            const userId = this.$route.params.userId;

            const deletionSent = await fetch(
              `http://localhost:3000/api/profiles/${userId}`,
              {
                method: "DELETE",
                body: JSON.stringify({
                  userId: `${userId}`,
                  password: this.password,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
            const deletionBackSent = await deletionSent.json();

            if (deletionBackSent.error) {
              this.showPopup(
                "Une erreur est survenue :",
                `${deletionBackSent.error}`
              );
            } else {
              this.isDeleted = true;
              this.showPopup("Utilisateur supprimé !", "");
            }
          } catch (error) {
            this.showPopup("Une erreur est survenue :", `${error}`);
          }
        })();
        this.isSupprVisible = false;
      }
    },
    getUserProfile() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      const userId = this.$route.params.userId;

      (async () => {
        try {
          const userProfile = await fetch(
            `http://localhost:3000/api/profiles/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          const userProfileJSON = await userProfile.json();

          if (userProfileJSON.error) {
            this.isLoggedIn = false;
            this.showPopup(
              `Erreur : ${userProfileJSON.error}`,
              "Votre session a peut-être expiré ? Essayez de vous reconnecter."
            );
          }

          if (userProfileJSON) {
            this.surname = userProfileJSON.first_name;
            this.name = userProfileJSON.last_name;
            this.email = userProfileJSON.email;
          }
        } catch (error) {
          this.showPopup(
            "Impossible d'accéder au profil utilisateur.",
            `${error}.`
          );
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
  background: var(--color-primary-transparent);
  border-radius: 0.5rem;
}
</style>
