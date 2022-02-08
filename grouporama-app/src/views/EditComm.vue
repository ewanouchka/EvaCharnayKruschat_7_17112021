<template>
  <div class="editpost">
    <router-link to="/"
      ><img
        alt="logo left Groupomania"
        src="../assets/icon-left-font.svg"
        class="editpost__logo"
    /></router-link>
    <h1>Editer un commentaire</h1>

    <section id="Comment-Editor"><CommentEditor /></section>
    <router-link to="/thread" class="back-to-thread"
      >Retour au fil d'actualité</router-link
    >
  </div>
</template>

<script>
import CommentEditor from "@/components/CommentEditor.vue";

export default {
  name: "EditComm",
  components: {
    CommentEditor,
  },
};
</script>

<style scoped lang="scss">
.editpost__logo {
  width: 40rem;
  height: 10rem;
  object-fit: cover;
}

.editpost h1 {
  margin: 0;
  align-self: center;
  flex: 1;
}

.editpost section,
.back-to-thread {
  width: 100%;
}

@media all and (min-width: 426px) and (max-width: 767px) {
  .editpost__logo {
    width: 400px;
    height: 15rem;
  }
}

@media all and (min-height: 641px) and (max-height: 823px) {
  .editpost__logo {
    width: 400px;
    height: 15rem;
  }
}

@media all and (max-width: 425px) {
  .editpost__logo {
    width: 270px;
    height: 6rem;
    padding: 0 20px 0 0;
  }
  .editpost {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .editpost h1 {
    width: 100%;
  }
  .editpost button {
    margin: 0 1rem 1rem 1rem;
  }
}
</style>