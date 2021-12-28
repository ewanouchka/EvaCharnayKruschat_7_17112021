<template>
  <div class="profile">
    <img
      alt="logo above Groupomania"
      src="../assets/icon-above-font.svg"
      class="home__logo"
    />
    <section>
      <div v-if="isEditVisible === true" id="profile-edit">
        <h1>Editer votre profil</h1>
        <form id="profile-form">
          <label for="Nom" class="form-label">Votre nom :</label>
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
            required
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
            required
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

          <button @click.prevent="closeEdit" class="button" id="edit-profile">
            Enregistrer les modifications
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

        <button @click.prevent="showEdit" class="button" id="show-edit">
          Supprimer votre compte
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Profile",
  props: ["userSurname", "userName", "email"],
  data: function () {
    return {
      welcome: "Bienvenue",
      userFirstName: this.userSurname,
      userLastName: this.userName,
      userEmail: this.email,
      isEditVisible: false,
    };
  },
  methods: {
    showEdit() {
      this.isEditVisible = true;
    },
    closeEdit() {
      this.isEditVisible = false;
    },
    getUserProfile() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      (async () => {
        try {
          const userProfile = await fetch("http://localhost:3000/api/profile", {
            method: "POST",
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
