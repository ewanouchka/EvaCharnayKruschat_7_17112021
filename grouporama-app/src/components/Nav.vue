<template>
  <nav id="nav">
    <div class="nav-links">
      <router-link to="/">Accueil</router-link>
      <section v-if="isLoggedIn === true" class="nav-links-loggedin">
        |
        <router-link :to="{ name: 'Profile', params: { userId: `${userId}` } }"
          >Profil</router-link
        >
        |
        <router-link to="/thread">Fil d'actualité</router-link>
      </section>
    </div>
    <button
      @click.prevent="logOut"
      v-if="isLoggedIn === true"
      class="nav-button"
    >
      Se déconnecter
    </button>
    <Popup
      v-if="isPopupVisible === true"
      @close="closePopup"
      :msg="msg"
      :detail="detail"
    />
  </nav>
</template>

<script>
import Popup from "@/components/Popup.vue";

export default {
  name: "Nav",
  components: {
    Popup,
  },
  data() {
    return {
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      isLoggedIn: "false",
      userId: null,
    };
  },
  methods: {
    checkAuth() {
      try {
        const verify = JSON.parse(localStorage.getItem("userAuth"));
        const userId = JSON.parse(localStorage.getItem("userAuth")).userId;

        if (!verify || verify.token == undefined || verify.token == "") {
          return (this.isLoggedIn = false);
        } else {
          return (this.isLoggedIn = true), (this.userId = userId);
        }
      } catch (error) {
        console.log(error);
      }
    },
    showPopup(newMessage, newDetail) {
      this.isPopupVisible = true;
      this.msg = newMessage;
      this.detail = newDetail;
    },
    closePopup() {
      this.isPopupVisible = false;
      window.location.replace("/");
    },
    logOut() {
      localStorage.removeItem("userAuth");
      this.showPopup("Vous êtes bien déconnecté !", "");
    },
  },
  beforeMount() {
    this.checkAuth();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#nav {
  width: 100%;
  background: var(--color-primary);
  height: var(--header-size);
  padding: var(--padding-top-bottom);
  color: var(--color-light);
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;

  a {
    font-weight: bold;
    color: var(--color-lighter);
    transition: all 0.3s ease-in-out;

    &:hover {
      color: var(--color-secondary);
    }

    &.router-link-exact-active {
      color: var(--color-secondary);
    }
  }
}

.nav-links {
  align-self: center;
}

.nav-links-loggedin {
  display: inline;
}

.nav-button {
  margin: 0 1rem;
}

@media all and (max-width: 425px) {
  #nav {
    flex-direction: column;
  }

  .nav-button {
    margin: 0.25rem auto;
    width: 55%;
    padding: 0.25rem 0;
  }
}
</style>
