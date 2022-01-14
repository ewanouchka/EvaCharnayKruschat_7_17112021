<template>
  <div class="thread">
    <router-link to="/"
      ><img
        alt="logo left Groupomania"
        src="../assets/icon-left-font.svg"
        class="thread__logo"
    /></router-link>
    <h1>Fil d'actualité</h1>
    <section><Messages /></section>
    <section><TextEditor /></section>
  </div>
</template>


<script>
import Messages from "@/components/Messages.vue";
import TextEditor from "@/components/TextEditor.vue";

export default {
  name: "Thread",
  components: {
    Messages,
    TextEditor,
  },
  data: function () {
    return {};
  },
  methods: {},
};
</script>



<style lang="scss">
.thread__logo {
  width: 40rem;
  height: 10rem;
  object-fit: cover;
}

@media all and (min-width: 426px) and (max-width: 767px) {
  .thread__logo {
    width: 400px;
    height: 15rem;
  }
}

@media all and (min-height: 641px) and (max-height: 823px) {
  .thread__logo {
    width: 400px;
    height: 15rem;
  }
}

@media all and (max-width: 425px) {
  .thread__logo {
    width: 270px;
    height: 9rem;
    padding-right: 10px;
  }
}

h1 {
  margin: 0;
}
</style>