<template>
  <div class="profile">
    <h1>{{ msg }}</h1>
    <p>
      UC
    </p>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
