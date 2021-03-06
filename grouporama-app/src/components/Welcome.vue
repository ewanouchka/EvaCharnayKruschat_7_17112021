<template>
  <div class="welcome">
    <h1>{{ welcome }} {{ authentifiedUser }} !</h1>
    <div>
      Vos dernières participations :

      <ul v-if="messages === ''" class="actu-container">
        <li>Vous n'avez pas encore de participation.</li>
      </ul>

      <ul v-else class="actu-container">
        <li class="actu-bloc" v-for="item in messages" :key="item.id">
          <h2>{{ item.title }}</h2>
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
  </div>
</template>

<script>
import Popup from "@/components/Popup.vue";

export default {
  name: "Welcome",
  props: ["userSurname"],
  components: {
    Popup,
  },
  data: function () {
    return {
      welcome: "Bienvenue",
      authentifiedUser: this.userSurname,
      messages: "",
      isPopupVisible: false,
      isLoggedIn: true,
      msg: "Aïe... le message est vide",
      detail: "Aïe... le détail est vide",
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
        this.$router.go();
      }
    },
    getPosts() {
      const userId = JSON.parse(localStorage.getItem("userAuth")).userId;
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      (async () => {
        try {
          const posts = await fetch(
            `http://localhost:3000/api/messages/users/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          const postsJSON = await posts.json();

          if (postsJSON.error) {
            this.isLoggedIn = false;
            this.showPopup(
              `Erreur : ${postsJSON.error}`,
              "Votre session a peut-être expiré ? Essayez de vous reconnecter."
            );
          }

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
    getUserName() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      const userId = JSON.parse(localStorage.getItem("userAuth")).userId;

      (async () => {
        try {
          const userProfile = await fetch(
            `http://localhost:3000/api/profiles/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          const userProfileJSON = await userProfile.json();

          if (userProfileJSON) {
            this.authentifiedUser = userProfileJSON.first_name;
            return;
          }
        } catch (error) {
          this.showPopup(
            "Impossible d'accéder au profil utilisateur.",
            `${error}.`
          );
        }
      })();
    },
  },
  beforeMount() {
    this.getUserName();
    this.getPosts();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.welcome > * {
  width: 100%;
}
.actu-container {
  padding: 0;
}
.actu-bloc {
  background: var(--color-primary-transparent);
  border-radius: 0.5rem;
  margin: 0 0 1rem 0;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.actu-bloc h2 {
  margin: 0;
  border-bottom: 1px solid var(--color-primary);
  font-size: 1.25rem;
  width: 100%;
}
.actu-bloc h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
  font-style: italic;
}
.actu-bloc p {
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
