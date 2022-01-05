<template>
  <div class="posts-container" id="posts">
    Les posts à lister (dernier -> 20) <br />
    Titre : {{ titre }} / Contenu : {{ contenu }} / Auteur : {{ auteur }} <br />
    Titre : {{ titre1 }} / Contenu : {{ contenu1 }} / Auteur : {{ auteur1 }}

    <Popup
      v-if="isPopupVisible === true"
      @close="closePopup"
      :msg="msg"
      :detail="detail"
    />
  </div>
</template>

<script>
import Popup from "@/components/Popup.vue";

export default {
  name: "Posts",
  components: {
    Popup,
  },
  props: [
    "postTitle",
    "postContent",
    "postAuthor",
    "postTitle1",
    "postContent1",
    "postAuthor1",
  ],
  data() {
    return {
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      titre: this.postTitle,
      contenu: this.postContent,
      auteur: this.postAuthor,
      titre1: this.postTitle1,
      contenu1: this.postContent1,
      auteur1: this.postAuthor1,
      // reprendre ces data et computed lists...
    };
  },
  methods: {
    showPopup(newMessage, newDetail) {
      this.isPopupVisible = true;
      this.msg = newMessage;
      this.detail = newDetail;
    },
    closePopup() {
      this.isPopupVisible = false;
    },
    getPosts() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      (async () => {
        try {
          const posts = await fetch(`http://localhost:3000/api/messages`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });

          const postsJSON = await posts.json();
          console.log(postsJSON);

          if (postsJSON) {
            // pour voir les infos --> voir pour map sur l'array de messages
            this.titre = postsJSON[0].title;
            this.contenu = postsJSON[0].content;
            const userFirstName = postsJSON[0].User.first_name;
            const userLastName = postsJSON[0].User.last_name;
            this.auteur = userFirstName + " " + userLastName;
            this.titre1 = postsJSON[1].title;
            this.contenu1 = postsJSON[1].content;
            const userFirstName1 = postsJSON[1].User.first_name;
            const userLastName1 = postsJSON[1].User.last_name;
            this.auteur1 = userFirstName1 + " " + userLastName1;

            return;
          }
        } catch (error) {
          this.showPopup(
            "Impossible d'accéder au fil d'actualité.",
            `${error}.`
          );
        }
      })();
    },
  },
  beforeMount() {
    this.getPosts();
  },
};
</script>

<style scoped lang="scss">
</style>