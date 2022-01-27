<template>
  <div class="post-detail">
    <router-link to="/"
      ><img
        alt="logo left Groupomania"
        src="../assets/icon-left-font.svg"
        class="post-detail__logo"
    /></router-link>
    <h1>Un message</h1>

    <section id="Review"><Review /></section>
    <section id="Comments"><Comments /></section>
  </div>
</template>

<script>
import Review from "@/components/Review.vue";
import Comments from "@/components/Comments.vue";

export default {
  name: "EditPost",
  components: {
    Review,
    Comments,
  },
  data: function () {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="scss">
// revoir le css responsive
.post-detail {
  /*display: flex;
  flex-wrap: wrap;
  align-items: space-between;*/
}

.post-detail__logo {
  width: 40rem;
  height: 10rem;
  object-fit: cover;
}

.post-detail h1 {
  margin: 0;
  align-self: center;
  flex: 1;
}

.post-detail section {
  width: 100%;
}

@media all and (min-width: 426px) and (max-width: 767px) {
  .post-detail__logo {
    width: 400px;
    height: 15rem;
  }
}

@media all and (min-height: 641px) and (max-height: 823px) {
  .post-detail__logo {
    width: 400px;
    height: 15rem;
  }
}

@media all and (max-width: 425px) {
  .post-detail__logo {
    width: 270px;
    height: 6rem;
    padding: 0 20px 0 0;
  }
  .post-detail {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .post-detail h1 {
    width: 100%;
  }
  .post-detail button {
    margin: 0 1rem 1rem 1rem;
  }
}
</style>