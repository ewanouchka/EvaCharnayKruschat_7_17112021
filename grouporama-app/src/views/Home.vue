<template>
  <div class="home">
    <router-link to="/"
      ><img
        alt="logo above Groupomania"
        src="../assets/icon-above-font.svg"
        class="home__logo"
    /></router-link>
    <section v-if="isLoggedIn === false"><Login /></section>
    <section v-else><Welcome /></section>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import Welcome from "@/components/Welcome.vue";

export default {
  name: "Home",
  components: {
    Login,
    Welcome,
  },
  data: function () {
    return {
      isLoggedIn: "false",
    };
  },
  methods: {
    checkAuth() {
      try {
        const verify = JSON.parse(localStorage.getItem("userAuth"));
        if (!verify || verify.token == undefined || verify.token == "") {
          return (this.isLoggedIn = false);
        } else {
          return (this.isLoggedIn = true);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  beforeMount() {
    this.checkAuth();
  },
};
</script>

<style lang="scss">
</style>