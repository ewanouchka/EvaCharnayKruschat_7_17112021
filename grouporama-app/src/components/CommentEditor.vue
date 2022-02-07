<template>
  <div id="text-editor">
    <form class="text-editor">
      <div>
        <label for="Content"
          >Votre commentaire :
          <span class="error-visible" id="error-message-Post"></span>
        </label>
        <textarea
          placeholder="Votre post"
          name="Content"
          id="Content"
          rows="5"
          class="post-input"
          v-model="commContent"
          required
        />
      </div>
      <button
        v-if="contextPost === 'commSubmit'"
        @click.prevent="commSubmit"
        class="button"
        id="comm-submit"
      >
        Envoyer votre commentaire
      </button>
      <button
        v-if="contextPost === 'commEdit'"
        @click.prevent="commEdit"
        class="button"
        id="comm-edit"
      >
        Editer votre commentaire
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
  name: "CommentEditor",
  components: {
    Popup,
  },
  data: function () {
    return {
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      commSent: false,
      commEdited: false,
      contextPost: "Contexte",
      commContent: "",
      inputValidity: false,
      messageId: "",
    };
  },
  methods: {
    checkContext() {
      const messageId = this.$route.params.messageId;
      const commentId = this.$route.params.commentId;

      if (messageId) {
        this.contextPost = "commSubmit";
        this.commContent = "";
      }
      if (commentId) {
        this.contextPost = "commEdit";
        this.getOriginalComment();
      }
    },
    showPopup(newMessage, newDetail) {
      this.isPopupVisible = true;
      this.msg = newMessage;
      this.detail = newDetail;
    },
    closePopup() {
      this.isPopupVisible = false;
      if (this.commEdited) {
        const messageId = this.$route.params.messageId;
        this.$router.push({
          name: "PostDetail",
          params: { messageId },
        });
      }
      if (this.commSent) {
        this.$router.go();
      }
    },
    getOriginalComment() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      const commentId = this.$route.params.commentId;
      const messageId = this.$route.params.messageId;
      (async () => {
        try {
          const oneComment = await fetch(
            `http://localhost:3000/api/messages/${messageId}/comments/${commentId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          const oneCommentBack = await oneComment.json();

          this.commContent = oneCommentBack.commentaire.content;
        } catch (error) {
          this.showPopup("Impossible d'accéder au commentaire.", `${error}.`);
        }
      })();
    },
    checkTextValidity(text) {
      // on supprime les espaces au début et à la fin de la chaîne
      text = text.trim();

      // on bloque si des champs requis sont manquants
      if (!text || text.length <= 3) {
        this.showPopup(
          "Les informations saisies ne sont pas valides.",
          `Assurez-vous que tous les champs sont correctement renseignés :\n- Le titre et le contenu doivent comporter au moins 3 caractères autres que des espaces.`
        );
      } else {
        return (this.inputValidity = true);
      }
    },
    commSubmit() {
      this.checkTextValidity(this.commContent);
      if (this.inputValidity) {
        (async () => {
          try {
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            const messageId = this.$route.params.messageId;

            await fetch(
              `http://localhost:3000/api/messages/${messageId}/comments`,
              {
                method: "POST",
                body: JSON.stringify({
                  content: this.commContent,
                  messageId: messageId,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );

            this.commSent = true;

            this.showPopup("Votre commentaire est enregistré", ``);
          } catch (error) {
            this.showPopup("Une erreur est survenue :", `${error}`);
          }
        })();
      }
    },
    commEdit() {
      this.checkTextValidity(this.commContent);

      if (this.inputValidity) {
        (async () => {
          try {
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            const messageId = this.$route.params.messageId;
            const commentId = this.$route.params.commentId;

            await fetch(
              `http://localhost:3000/api/messages/${messageId}/comments/${commentId}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  commentId: `${commentId}`,
                  content: this.commContent,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );

            this.commEdited = true;

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
.text-editor input {
  border: 1px solid var(--color-light);
  margin: 0.5rem;
  padding: 0.25rem;
  align-self: stretch;
  background: var(--color-transparent);
  border-radius: 0.5rem;
  text-align: justify;
  font-family: var(--font-text);
}
.text-editor textarea {
  border: 1px solid var(--color-light);
  margin: 0.5rem;
  padding: 0.25rem;
  align-self: stretch;
  background: var(--color-transparent);
  border-radius: 0.5rem;
  text-align: justify;
  font-family: var(--font-text);
}
</style>