<template>
  <div class="error404">
    <router-link to="/"
      ><img
        alt="logo above Groupomania"
        src="../assets/icon-above-font.svg"
        class="home__logo"
    /></router-link>
    <h1>Erreur 404</h1>
    <section>
      <p>Cette page n'est pas accessible :(</p>
      <router-link to="/" class="back-home">Retour à l'accueil</router-link>
    </section>
  </div>
</template>


<script>
export default {
  name: "Error404",
  data: function () {
    return {};
  },
  methods: {},
};
</script>



<style scoped lang="scss">
.back-home {
  width: 100%;
}
</style>