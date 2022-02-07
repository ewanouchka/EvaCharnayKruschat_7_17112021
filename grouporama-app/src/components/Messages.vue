<template>
  <div id="posts">
    <ul v-if="messages === ''" class="posts-container">
      <li>Aucune participation n'a été postée pour le moment.</li>
    </ul>
    <ul v-else class="posts-container">
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
          <router-link
            title="répondre au message"
            :to="{ name: 'PostDetail', params: { messageId: item.id } }"
          >
            <i class="fas fa-reply post-options__icons"></i>
          </router-link>
          <span v-if="showActions(item.UserId, isAdmin) === true">
            <router-link
              title="éditer le message"
              :to="{ name: 'EditPost', params: { messageId: item.id } }"
            >
              <i class="fas fa-pencil-alt post-options__icons"></i>
            </router-link>
            <i
              @click.prevent="deletePost(item.id)"
              class="fas fa-trash-alt post-options__icons"
              title="supprimer le message"
            ></i>
          </span>
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
import Popup from "@/components/Popup.vue";

export default {
  name: "Posts",
  components: {
    Popup,
  },
  data() {
    return {
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      isLoggedIn: true,
      messages: "",
      reqSent: false,
      isAdmin: false,
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
      if (this.reqSent) {
        this.$router.go();
      }
      if (this.isLoggedIn == false) {
        localStorage.removeItem("userAuth");
        this.$router.push({
          name: "Home",
        });
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
          this.isAdmin = postsJSON.isAdmin;

          if (postsJSON.messages.length > 0) {
            for (const message of postsJSON.messages) {
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

            this.messages = postsJSON.messages;
          }
        } catch (error) {
          this.showPopup(
            "Impossible d'accéder au fil d'actualité.",
            `${error}.`
          );
        }
      })();
    },
    showActions(postUserId, isAdmin) {
      const userId = JSON.parse(localStorage.getItem("userAuth")).userId;
      if (isAdmin === true) {
        return true;
      }

      if (postUserId === userId) {
        return true;
      }
    },
    deletePost(messageId) {
      (async () => {
        try {
          const userToken = JSON.parse(localStorage.getItem("userAuth")).token;

          const deletionSent = await fetch(
            `http://localhost:3000/api/messages/${messageId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          const deletionBackSent = await deletionSent.json();

          if (deletionBackSent.error) {
            this.showPopup(
              "Une erreur est survenue :",
              `${deletionBackSent.error}`
            );
          } else {
            this.reqSent = true;
            this.showPopup("Message supprimé !", "");
          }
        } catch (error) {
          this.showPopup("Une erreur est survenue :", `${error}`);
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
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.post-options__icons {
  margin: 0 0.75rem 0 0;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: var(--color-secondary);
  }
}
</style>