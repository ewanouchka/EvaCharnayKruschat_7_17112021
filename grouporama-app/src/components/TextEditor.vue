<template>
  <div id="text-editor">
    <form class="text-editor">
      <div>
        <label for="title">Titre du post : </label>
        <input
          placeholder="Titre du post"
          id="title"
          type="text"
          class="post-input"
          v-model="postTitle"
          required
        />
        <label for="content">Votre post : </label>
        <textarea
          placeholder="Votre post"
          id="content"
          rows="5"
          class="post-input"
          v-model="postContent"
          required
        />
      </div>
      <button
        v-if="contextPost === 'postSubmit'"
        @click.prevent="postSubmit"
        class="button"
        id="post-submit"
      >
        Envoyer le message
      </button>
      <button
        v-if="contextPost === 'postEdit'"
        @click.prevent="postEdit"
        class="button"
        id="post-edit"
      >
        Editer le message
      </button>
    </form>
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
  name: "TextEditor",
  components: {
    Popup,
  },
  data: function () {
    return {
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      postSent: false,
      postEdited: false,
      contextPost: "Rien",
      postTitle: "",
      postContent: "",
      inputValidity: false,
    };
  },
  methods: {
    checkContext() {
      if (this.$route.path === "/thread") {
        this.contextPost = "postSubmit";
        this.postTitle = "";
        this.postContent = "";
      }
      if (this.$route.path.includes("/editpost/")) {
        this.contextPost = "postEdit";
        this.getOriginalText();
      }
    },
    showPopup(newMessage, newDetail) {
      this.isPopupVisible = true;
      this.msg = newMessage;
      this.detail = newDetail;
    },
    closePopup() {
      this.isPopupVisible = false;
      if (this.postSent) {
        this.$router.go();
      }
      if (this.postEdited) {
        const messageId = this.$route.params.messageId;
        this.$router.push({
          name: "PostDetail",
          params: { messageId: `${messageId}` },
        });
      }
    },
    getOriginalText() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      const messageId = this.$route.params.messageId;
      (async () => {
        try {
          const oneMessage = await fetch(
            `http://localhost:3000/api/messages/${messageId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          const oneMessageBack = await oneMessage.json();

          this.postTitle = oneMessageBack.message.title;
          this.postContent = oneMessageBack.message.content;
        } catch (error) {
          this.showPopup("Impossible d'accéder au message.", `${error}.`);
        }
      })();
    },
    checkTextValidity(text) {
      // on supprime les espaces au début et à la fin de la chaîne
      text = text.trim();

      // on bloque si des champs requis sont manquants
      if (!text || text.length <= 3) {
        return false;
      } else {
        return true;
      }
    },
    checkValidityPost() {
      if (
        !this.checkTextValidity(this.postTitle) ||
        !this.checkTextValidity(this.postContent)
      ) {
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          `Assurez-vous que tous les champs sont correctement renseignés :\n- Le titre et le contenu doivent comporter au moins 3 caractères autres que des espaces.`
        );
      } else this.inputValidity = true;
    },
    checkValidityEdit() {
      if (
        !this.checkTextValidity(this.postTitle) &&
        !this.checkTextValidity(this.postContent)
      ) {
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          `Assurez-vous que tous les champs sont correctement renseignés :\n- Le titre et le contenu doivent comporter au moins 3 caractères autres que des espaces.`
        );
      } else this.inputValidity = true;
    },
    postSubmit() {
      this.checkValidityPost();
      if (this.inputValidity) {
        (async () => {
          try {
            const userId = JSON.parse(localStorage.getItem("userAuth")).userId;
            this.userId = userId;
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            await fetch("http://localhost:3000/api/messages", {
              method: "POST",
              body: JSON.stringify({
                title: this.postTitle,
                content: this.postContent,
                attachment: null,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            });

            this.postSent = true;

            this.showPopup("Votre message est enregistré", ``);
          } catch (error) {
            this.showPopup("Une erreur est survenue :", `${error}`);
          }
        })();
      }
    },
    postEdit() {
      this.checkValidityEdit();
      if (this.inputValidity) {
        (async () => {
          try {
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            const messageId = this.$route.params.messageId;

            await fetch(`http://localhost:3000/api/messages/${messageId}`, {
              method: "PUT",
              body: JSON.stringify({
                title: this.postTitle,
                content: this.postContent,
                attachment: null,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            });

            this.postEdited = true;

            this.showPopup("Votre modification est enregistrée", ``);
          } catch (error) {
            this.showPopup("Une erreur est survenue :", `${error}`);
          }
        })();
      } else {
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          `Assurez-vous que tous les champs sont correctement renseignés :\n- Le titre et le contenu doivent comporter au moins 3 caractères.`
        );
      }
    },
  },
  beforeMount() {
    this.checkContext();
  },
};
</script>

<style scoped lang="scss">
#text-editor h2 {
  margin: 2rem 0 0 0;
}
.text-editor {
  padding: 0;
}
.text-editor div {
  background: var(--color-secondary-transparent);
  border-radius: 0.5rem;
  margin: 0 0 1rem 0;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.text-editor label {
  width: 100%;
  margin: 1rem 0 0 0;
  font-weight: bold;
  text-align: left;
  padding: 0 0 0 1.25rem;
}
.text-editor input,
.text-editor textarea {
  border: 1px solid var(--color-medium);
  margin: 0.5rem;
  padding: 0.25rem;
  align-self: stretch;
  background: var(--color-transparent);
  border-radius: 0.5rem;
  text-align: justify;
  font-family: var(--font-text);
}
</style>