<template>
  <nav id="nav">
    <div class="nav-links">
      <router-link to="/">Accueil</router-link> |
      <router-link to="/profile">Profil</router-link> |
      <router-link to="/thread">Fil d'actualité</router-link>
    </div>
    <button @click.prevent="logOut" class="nav-button">Se déconnecter</button>
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
      window.location.reload();
    },
    logOut() {
      localStorage.removeItem("userAuth");
      this.showPopup("Vous êtes bien déconnecté !", "");
    },
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

.nav-button {
  margin: 0 1rem;
}
</style>
