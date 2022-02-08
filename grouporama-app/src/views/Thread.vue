<template>
  <div class="thread">
    <router-link to="/"
      ><img
        alt="logo left Groupomania"
        src="../assets/icon-left-font.svg"
        class="thread__logo"
    /></router-link>
    <a class="button-link" href="#Text-Editor">Poster un message</a>
    <h1>Fil d'actualité</h1>
    <section id="Messages"><Messages /></section>
    <h2>Poster un message</h2>
    <section id="Text-Editor"><TextEditor /></section>
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
};
</script>



<style scoped lang="scss">
.thread {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.thread__logo {
  width: 40rem;
  height: 10rem;
  object-fit: cover;
}

.thread h1 {
  margin: 0;
  align-self: center;
  flex: 1;
}

.thread section {
  width: 100%;
}

#Messages {
  min-height: 40vh;
}

.thread h2 {
  width: 100%;
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
    height: 6rem;
    padding: 0 20px 0 0;
  }
  .thread {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .thread h1 {
    width: 100%;
  }
  .thread button {
    margin: 0 1rem 1rem 1rem;
  }
}
</style>