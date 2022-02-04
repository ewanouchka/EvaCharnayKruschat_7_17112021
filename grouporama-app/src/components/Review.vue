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
        <p>{{ message.content }}</p>
        <div class="post-options">
          <router-link
            title="répondre au message"
            :to="{
              name: `CommentEditor`,
            }"
            ><i class="fas fa-reply post-options__icons"></i>
          </router-link>
          <span v-if="showActions(message.UserId, isAdmin) === true">
            <router-link
              title="éditer le message"
              :to="{
                name: 'EditPost',
                params: { messageId: message.id },
                children: CommentEditor,
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
    <ul class="comments-container">
      <h2>Commentaires</h2>
      <li v-for="item in message.Comments" :key="item.id">
        <h3>
          par <span v-html="item.User.first_name"></span>&nbsp;<span
            v-html="item.User.last_name"
          ></span
          >, le
          <span v-html="item.createdAt"></span>
        </h3>
        <p>{{ item.content }}</p>
        <div class="post-options">
          <span v-if="showActions(item.UserId, isAdmin) === true">
            <router-link
              title="éditer le commentaire"
              :to="{ name: 'EditComm', params: { commentId: item.id } }"
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
      message: { User: { first_name: null, last_name: null } },
      reqSent: false,
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
      if (this.reqSent) {
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
      console.log(messageId);
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

          /*if (postsJSON.error) {
            console.log("if postJSON.error");
            console.log(this.showPopup());
            this.isLoggedIn = false;
            this.showPopup(
              `Erreur : ${postsJSON.error}`,
              "Votre session a peut-être expiré ? Essayez de vous reconnecter."
            );
          }*/

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
          console.log("On arrive là (catch error) ?");
          console.log(
            this.showPopup(
              "Impossible d'accéder au fil d'actualité.",
              `${error}.`
            )
          );

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
            // voir pour faire un popup de confirmation avant suppression
            // revoir avec suppression des commentaires associés avant la suppression du message
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
    this.getMessage();
  },
};
</script>

<style scoped lang="scss">
.posts-container h1 {
  margin: 0;
  align-self: center;
  flex: 1;
}
</style>