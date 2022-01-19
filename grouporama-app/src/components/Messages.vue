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
        <div class="post-options">
          <i class="fas fa-reply post-options__icons"></i>
          <span v-if="showActions(item.UserId, userId, isAdmin) === true">
            <i class="fas fa-pencil-alt post-options__icons"></i>
            <i class="fas fa-trash-alt post-options__icons"></i>
          </span>
        </div>
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
      const userId = JSON.parse(localStorage.getItem("userAuth")).userId;
      this.userId = userId;
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

          if (postsJSON.error) {
            this.isLoggedIn = false;
            this.showPopup(
              `Erreur : ${postsJSON.error}`,
              "Votre session a peut-être expiré ? Essayez de vous reconnecter."
            );
          }

          if (postsJSON) {
            // voir une méthode js pour le faire en direct

            for (const message of postsJSON) {
              const postDate = new Date(message.createdAt);
              const dateOptions = {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              };
              message.createdAt = postDate.toLocaleDateString(
                "fr-FR",
                dateOptions
              );
            }

            this.messages = postsJSON;
          }
        } catch (error) {
          this.showPopup(
            "Impossible d'accéder au fil d'actualité.",
            `${error}.`
          );
        }
      })();
    },
    showActions(postUser, userId, isAdmin) {
      isAdmin = false;
      console.log("postUser");
      console.log(postUser);
      console.log("userId");
      console.log(userId);
      console.log("isAdmin");
      console.log(isAdmin);
      // route pour fetch dans le token utilisateur l'info admin ?
      if (isAdmin === true) {
        return true;
      }

      if (postUser === userId) {
        return true;
      } /*

      if (postUser !== userId) {
        return false;
      }*/
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
  flex-wrap: wrap;
  justify-content: space-between;
}
h2 {
  margin: 0;
  border-bottom: 1px solid var(--color-primary);
  font-size: 1.25rem;
  width: 100%;
}
h3 {
  width: 100%;
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
  font-style: italic;
}
p {
  width: 100%;
  margin: 0.5rem;
  padding: 0.25rem;
  align-self: stretch;
  background: var(--color-transparent);
  border-radius: 0.5rem;
  text-align: justify;
}
.post-options {
  margin: 0 0 0.25rem 1rem;
}
.post-options__icons {
  margin: 0 0.75rem 0 0;
}
.post-likes {
  margin: 0 1rem 0.25rem 0;
}
</style>