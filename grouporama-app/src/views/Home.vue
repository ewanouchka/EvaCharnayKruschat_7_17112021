<template>
  <div class="home">
    <img alt="logo above Groupomania" src="../assets/icon-above-font.svg" class="home__logo">
    <section v-if="isLoggedIn === false"><Login/></section>
    <section v-else><Welcome /></section>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'
import Welcome from '@/components/Welcome.vue'

export default {
  name: 'Home',
  components: {
    Login, Welcome
  }, 
  data: 
    function() {
      return {
        isLoggedIn: 'false'
      };
    },
  methods: {
    checkAuth () {
      try { 
        const verify = JSON.parse(localStorage.getItem("userAuth"));
        if (!verify || verify.token == undefined) {
          return this.isLoggedIn = false;
        } else {
          return this.isLoggedIn = true;
        }
      }
      catch (error) { console.log(error);}
    } 
  }, beforeMount(){
    this.checkAuth();
 }
}
</script>

<style lang="scss">
.home__logo {
  width:40rem;
  height:25rem;
  object-fit: cover;
  }

@media all and (min-width: 426px) and (max-width: 767px) {
.home__logo {
  width:400px;
  height:15rem;
  }
}

@media all and (min-height: 641px) and (max-height: 823px) {
.home__logo {
  width:400px;
  height:15rem;
  }
}

@media all and (max-width: 425px) {
.home__logo {
  width:270px;
  height:9rem;
  }
}

@media all and (max-height: 640px) {
.home__logo {
  width:270px;
  height:9rem;
  }
}

</style>