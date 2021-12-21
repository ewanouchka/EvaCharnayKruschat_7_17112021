<template>
  <div class="welcome">
    <h1>{{ msg }}</h1>
    <p>
      UC
    </p>
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
        msg: "Welcome",
      };
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
