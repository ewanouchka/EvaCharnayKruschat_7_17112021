<template>
  <div class="home">
    <img alt="logo above Groupomania" src="../assets/icon-above-font.svg" class="home__logo">
    <section v-if="checkAuth === true">Profile<Profile /></section>
    <section v-else>Login<Login/></section>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'

export default {
  name: 'Home',
  components: {
    Login
  }, 
  methods: {
    checkAuth () {
      // voir comment implémenter ici la vérification de l'authentification
      try { console.log("fonction"); }
      catch (error) { console.log(error);}
      return false;
    } 
  }, beforeMount(){
    this.checkAuth();
 },
}
</script>

<style lang="scss">
.home__logo {
  width:40rem;
  height:25rem;
  object-fit: cover;
  }

@media all and (max-width: 425px) {
.home__logo {
  width:270px;
  height:9rem;
  }
}
@media all and (min-width: 426px) and (max-width: 768px) {
.home__logo {
  width:400px;
  height:15rem;
  }
}

</style>