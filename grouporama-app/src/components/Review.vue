<template>
  <div class="review">
    <h1>{{ message.title }}</h1>
    <ul class="posts-container">
      <li class="post-bloc">
        <h3>
          par <span v-html="message.User.first_name"></span>&nbsp;<span
            v-html="message.User.last_name"
          ></span
          >, le
          <span v-html="message.createdAt"></span>
        </h3>
        <img
          v-if="message.attachment"
          :src="message.attachment"
          class="imagePost"
          alt="image illustration"
        />
        <p>{{ message.content }}</p>
        <div class="post-options">
          <a href="#bottom" title="répondre au message"
            ><i class="fas fa-reply post-options__icons"></i>
          </a>
          <span v-if="showActions(message.UserId, isAdmin) === true">
            <router-link
              title="éditer le message"
              :to="{
                name: 'EditPost',
                params: { messageId: message.id },
              }"
            >
              <i class="fas fa-pencil-alt post-options__icons"></i>
            </router-link>
            <i
              @click.prevent="deletePost(message.id)"
              class="fas fa-trash-alt post-options__icons"
              title="supprimer le message"
            ></i>
          </span>
        </div>
      </li>
    </ul>
    <h2>Commentaires</h2>
    <ul class="comments-container">
      <li v-for="item in message.Comments" :key="item.id">
        <div class="post-options">
          <span v-if="showActions(item.UserId, isAdmin) === true">
            <router-link
              title="éditer le commentaire"
              :to="{
                name: 'EditComm',
                params: { messageId: message.id, commentId: item.id },
              }"
            >
              <i class="fas fa-pencil-alt post-options__icons"></i>
            </router-link>
            <i
              @click.prevent="deleteComm(item.id)"
              class="fas fa-trash-alt post-options__icons"
              title="supprimer le message"
            ></i>
          </span>
        </div>
        <h3>
          par <span v-html="item.User.first_name"></span>&nbsp;<span
            v-html="item.User.last_name"
          ></span
          >, le
          <span v-html="item.createdAt"></span>
        </h3>
        <p>{{ item.content }}</p>
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
import Popup from "@/components/Popup.vue";

export default {
  name: "Review",
  components: {
    Popup,
  },
  data() {
    return {
      isPopupVisible: false,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
      isLoggedIn: true,
      message: { User: { first_name: null, last_name: null } },
      postDelete: false,
      commDelete: false,
      isAdmin: false,
    };
  },
  methods: {
    showPopup(newMessage, newDetail) {
      console.log("showpopup");
      this.isPopupVisible = true;
      this.msg = newMessage;
      this.detail = newDetail;
    },
    closePopup() {
      this.isPopupVisible = false;
      if (this.commDelete) {
        this.$router.go();
      }
      if (this.postDelete) {
        this.$router.push({
          name: "Thread",
        });
      }
      if (this.isLoggedIn == false) {
        localStorage.removeItem("userAuth");
        this.$router.push({
          name: "Home",
        });
      }
    },
    getMessage() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      const messageId = this.$route.params.messageId;

      (async () => {
        try {
          const posts = await fetch(
            `http://localhost:3000/api/messages/${messageId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          const postsJSON = await posts.json();
          this.isAdmin = postsJSON.isAdmin;

          if (postsJSON.message) {
            const postDate = new Date(postsJSON.message.createdAt);
            const postComments = postsJSON.message.Comments;
            const dateOptions = {
              weekday: "short",
              year: "numeric",
              month: "long",
              day: "numeric",
            };
            postsJSON.message.createdAt = postDate.toLocaleDateString(
              "fr-FR",
              dateOptions
            );
            for (const comment of postComments) {
              const commDate = new Date(comment.createdAt);

              comment.createdAt = commDate.toLocaleDateString(
                "fr-FR",
                dateOptions
              );
            }

            this.message = postsJSON.message;
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
      //this.userId = userId;
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
            this.postDelete = true;
            this.showPopup("Message supprimé !", "");
          }
        } catch (error) {
          this.showPopup("Une erreur est survenue :", `${error}`);
        }
      })();
    },
    deleteComm(commentId) {
      (async () => {
        try {
          const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
          const messageId = this.$route.params.messageId;

          const deletionSent = await fetch(
            `http://localhost:3000/api/messages/${messageId}/comments/${commentId}`,
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
            this.commDelete = true;
            this.showPopup("Commentaire supprimé !", "");
          }
        } catch (error) {
          this.showPopup("Une erreur est survenue :", `${error}`);
        }
      })();
    },
  },
  beforeMount() {
    this.getMessage();
  },
};
</script>

<style scoped lang="scss">
.posts-container {
  padding: 0;
}
.posts-container h1 {
  margin: 0;
  align-self: center;
  flex: 1;
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
.post-bloc h3 {
  width: 100%;
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
  font-style: italic;
}
.post-bloc p {
  width: 100%;
  margin: 0.5rem;
  padding: 0.25rem;
  align-self: stretch;
  background: var(--color-transparent);
  border-radius: 0.5rem;
  text-align: justify;
}
.post-bloc .post-options {
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

.comments-container {
  padding: 0;
  margin: 0;
}

.comments-container h3 {
  width: calc(100% - 60px);
  margin: 0;
  font-size: 0.9rem;
  font-weight: normal;
  font-style: italic;
  text-align: left;
  padding: 0.25rem;
}
.comments-container li {
  background: var(--color-light);
  position: relative;
  padding: 0 0 1rem 0.25rem;
  font-size: 0.9rem;
}
.comments-container p {
  width: 100%;
  margin: 0;
  padding: 0.25rem;
  align-self: stretch;
  text-align: justify;
}
.comments-container .post-options {
  margin: 0.25rem -0.35rem 0 0;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  right: 0;
}

.imagePost {
  max-width: 500px;
  margin: auto;
}
</style>