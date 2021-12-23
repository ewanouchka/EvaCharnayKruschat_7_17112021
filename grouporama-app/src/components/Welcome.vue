<template>
  <div class="welcome">
    <h1>{{ msg }} {{ userSurname }}</h1>
    <div>
      Voici les dernières actualités :
      <div id="welcome__actu">bloc dernier message à voir</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  /*props: {
    msg: String
  },*/

  data: 
    function() {
      return {
        msg: "Bienvenue",
        userSurname: "inconnu", // revoir l'appel du userName avec le profil
      };
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.welcome{
  display:flex;
  flex-direction: column;
  align-items: center;
}
.welcome > *{
  width:100%;
}
#welcome__actu{
  width:80%;
  min-height:10rem;
  margin:auto;
  border: 1px solid var(--color-primary);
}
</style>
