<template>
  <div id="text-editor">
    <form class="text-editor">
      <div>
        <label for="Title"
          >Titre du post :
          <span class="error-visible" id="error-message-Title"></span>
        </label>
        <input
          placeholder="Titre du post"
          name="Title"
          id="Title"
          type="text"
          class="post-input"
          required
        />
        <label for="Post"
          >Votre post :
          <span class="error-visible" id="error-message-Post"></span>
        </label>
        <textarea
          placeholder="Votre post"
          name="Content"
          id="Content"
          rows="5"
          class="post-input"
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
      contextPost: "Rien",
    };
  },
  methods: {
    checkContext() {
      const pathName = window.location.pathname;
      if (pathName === "/thread") {
        this.contextPost = "postSubmit";
      }
      if (pathName === "/editpost/") {
        this.contextPost = "postEdit";
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
        console.log(this.postSent);
        window.location.replace("/thread");
      }
    },
    postSubmit() {
      const inputValues = document.querySelectorAll(".post-input");
      const getInputValue = (inputId) => {
        const inputValue = document.querySelector(`#${inputId}`).value;
        return inputValue;
      };

      const checkAllValidity = () => {
        let validity = true;
        for (const inputValue of inputValues) {
          if (inputValue.validity.valid == false) {
            validity = false;
            inputValue.classList.add("input-invalid");
          }
        }
        return validity;
      };
      checkAllValidity();

      if (checkAllValidity()) {
        (async () => {
          try {
            const userId = JSON.parse(localStorage.getItem("userAuth")).userId;
            this.userId = userId;
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            const postSent = await fetch("http://localhost:3000/api/messages", {
              method: "POST",
              body: JSON.stringify({
                title: getInputValue("Title"),
                content: getInputValue("Content"),
                attachment: null,
              }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            });
            console.log(postSent);

            const postBackSent = await postSent.json();
            console.log(postBackSent);
            this.postSent = true;

            this.showPopup("Votre message est enregistré", ``);
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
    postEdit() {
      const inputValues = document.querySelectorAll(".post-input");
      const getInputValue = (inputId) => {
        const inputValue = document.querySelector(`#${inputId}`).value;
        return inputValue;
      };

      const checkAllValidity = () => {
        let validity = true;
        for (const inputValue of inputValues) {
          if (inputValue.validity.valid == false) {
            validity = false;
            inputValue.classList.add("input-invalid");
          }
        }
        return validity;
      };
      checkAllValidity();

      if (checkAllValidity()) {
        (async () => {
          try {
            const userId = JSON.parse(localStorage.getItem("userAuth")).userId;
            this.userId = userId;
            const userToken = JSON.parse(
              localStorage.getItem("userAuth")
            ).token;
            const messageId = new URL(location.href).searchParams.get(
              "messageId"
            );
            this.messageId = messageId;
            const postSent = await fetch(
              `http://localhost:3000/api/messages/${messageId}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  title: getInputValue("Title"),
                  content: getInputValue("Content"),
                  attachment: null,
                }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userToken}`,
                },
              }
            );
            console.log(postSent);

            const postBackSent = await postSent.json();
            console.log(postBackSent);
            this.postSent = true;

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