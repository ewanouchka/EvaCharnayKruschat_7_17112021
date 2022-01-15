<template>
  <div id="posts">
    <ul class="posts-container">
      <li v-for="item in messages" :key="item.id" class="post-bloc">
        <h2>{{ item.title }}</h2>
        <h3>
          par <span v-html="item.User.first_name"></span>&nbsp;<span
            v-html="item.User.last_name"
          ></span
          >, le
          <span v-html="item.createdAt"></span>
        </h3>
        <p>{{ item.content }}</p>
        <div class="post-likes">
          <i class="fas fa-heart"></i> {{ item.likes }}
        </div>
      </li>
    </ul>

    <Popup
      v-if="isPopupVisible === true"
      @close="closePopup"
      :msg="msg"
      :detail="detail"
    />
  </div>
</template>

<script>
// ajouter bouton page suivante pour offset suivant/précédent
// supprimer le choix du nombre de messages par pages -> limite 10 fixe
// ajouter fonction like + anim coeur
// ajouter boutons modifier/supprimer + fonctions backend
// voir les droits admins pour ces fonctions modif/suppr
import Popup from "@/components/Popup.vue";

export default {
  name: "Posts",
  components: {
    Popup,
  },
  data() {
    return {
      isPopupVisible: false,
      isLoggedIn: true,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      messages: "La liste de messages est vide",
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
      if (this.isLoggedIn == false) {
        localStorage.removeItem("userAuth");
        window.location.replace("/");
      }
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

          if (postsJSON) {
            // pour voir les infos --> voir pour map sur l'array de messages
            for (const message of postsJSON) {
              const day = message.createdAt.substr(8, 2);
              const month = message.createdAt.substr(5, 2);
              const year = message.createdAt.substr(0, 4);
              message.createdAt = day + "/" + month + "/" + year;
            }

            this.messages = postsJSON;
          }

          if (postsJSON.error) {
            this.isLoggedIn = false;
            this.showPopup(
              `Erreur : ${postsJSON.error}`,
              "Votre session a peut-être expiré ? Essayez de vous reconnecter."
            );
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
.posts-container {
  padding: 0;
}
.post-bloc {
  background: var(--color-primary-transparent);
  border-radius: 0.5rem;
  margin: 0 0 1rem 0;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  margin: 0;
  border-bottom: 1px solid var(--color-primary);
  font-size: 1.25rem;
  width: 80%;
}
h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
  font-style: italic;
}
p {
  margin: 0.5rem;
  padding: 0.25rem;
  align-self: stretch;
  background: var(--color-transparent);
  border-radius: 0.5rem;
  text-align: justify;
}
.post-likes {
  align-self: flex-end;
  margin: 0 1rem 0 0;
}
</style>