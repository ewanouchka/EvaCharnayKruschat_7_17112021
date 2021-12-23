<template>
  <div id="app">
    <nav id="nav">
      <div class="nav-links">
        <router-link to="/">Home</router-link> |
        <router-link to="/profile">Profile</router-link> |
        <router-link to="/about">About</router-link> 
      </div>
      <button @click.prevent="logOut" class="nav-button">Se déconnecter</button>
    </nav>
    <router-view class="main-section"/>
    <footer>
      {{ copyright }}
      </footer>
    <Popup />
  </div>
</template>

<script>
import Popup from "@/components/Popup.vue";

export default {
  name: 'App',   
  components: {
    Popup,
  },
	computed: {
		copyright() {
			const currentYear = new Date().getFullYear()
			return `Groupomania©${currentYear}`
		}
  },
  methods: {
    changeMessage(newMessage, newDetail) {
      const popupMessage = document.querySelector(".popup-bloc__msg");
      const popupDetail = document.querySelector(".popup-bloc__detail");
      popupMessage.innerHTML = newMessage;
      popupDetail.innerHTML = newDetail;
    },
    logOut() {
              localStorage.removeItem("userAuth");
      const popupContainer = document.querySelector(".popup-container");
              popupContainer.classList.add("popup-container-visible");
              this.changeMessage("Vous êtes bien déconnecté !", "");
              document.querySelector("#close-popup").addEventListener("click", function () {
                popupContainer.classList.remove("popup-container-visible");
                window.location.reload();
              });

    }
  }
}
</script>

<style lang="scss">
body {
  margin:0;
}

:root{
  --color-primary:rgb(28, 28, 87);
  --color-secondary:rgb(247, 128, 128);
  --color-secondary-dark:rgb(226, 46, 46);
--color-transparent:rgba(255, 255, 255, 0.95);
--color-lighter:rgb(255,255,255);
--color-light:rgb(199, 199, 199);
--color-medium:rgb(128, 128, 128);
--color-dark:rgb(56, 56, 56);
--color-darker:rgb(0,0,0);
--font-text:Avenir, Helvetica, Arial, sans-serif;
--font-title:Avenir, Helvetica, Arial, sans-serif;
--font-size:16px;
--padding-top-bottom:1rem;
--footer-size:1.25rem;
--header-size:2rem;
}

 a {
   text-decoration:none;
    color: var(--color-primary);
  transition: all 0.3s ease-in-out;

    &:hover {
      color: var(--color-secondary);
    }
  }

#app {
  font-family: var(--font-text);
  font-size:var(--font-size);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-dark);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  margin:1rem;
  border:none;
  border-radius: 2rem;
  background:linear-gradient(-165deg, var(--color-lighter), var(--color-secondary) 25%,var(--color-secondary-dark) 60%, var(--color-secondary-dark));
  box-shadow: 0 0 0.5rem var(--color-light);
  height:2rem;
  padding:0 1rem;
  color:var(--color-lighter);
  font-weight:bold;
  transition: all 0.3s ease-in-out;

    &:hover {color:var(--color-light); 
    box-shadow: 0 0 0.5rem var(--color-medium);
 }
}

#nav {
  width:100%;
  background: var(--color-primary);
  height:var(--header-size);
  padding:var(--padding-top-bottom);
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

.main-section {
  height: calc(100vh - var(--header-size) - var(--footer-size) - 4 * var(--padding-top-bottom));
  overflow-x: hidden;
  overflow-y: auto;
}

.form-label{
    width:100%;
    margin:1rem 0 0 0;
    font-weight:bold;
}
.form-input{
    width:100%;
    border:1px solid var(--color-light);
    border-radius:3px;
    text-align: center;

    &:focus-visible {
    border:1px solid var(--color-primary);
    outline: transparent auto 0px;
    }
}

footer {
  width:100%;
    height:var(--footer-size);
  padding:var(--padding-top-bottom);
  background: var(--color-secondary);
    color: var(--color-dark);
}
</style>
