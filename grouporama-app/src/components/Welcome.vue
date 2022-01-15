<template>
  <div class="welcome">
    <h1>{{ welcome }} {{ authentifiedUser }} !</h1>
    <div>
      Voici les dernières actualités :

      <ul class="actu-container">
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
          <div class="post-likes">
            <i class="fas fa-heart"></i> {{ item.likes }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  props: ["userSurname"],
  data: function () {
    return {
      welcome: "Bienvenue",
      authentifiedUser: this.userSurname,
      messages: [
        {
          id: "1",
          title: "titre",
          content: "contenu",
          likes: 0,
          createdAt: "2022-01-01",
          updatedAt: "2022-01-01",
          User: { first_name: "Prénom", last_name: "Nom" },
        },
      ],
    };
  },
  methods: {
    // voir méthode et route pour appel dernier message seul
    getUserName() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      const userId = JSON.parse(localStorage.getItem("userAuth")).userId;

      (async () => {
        try {
          const userProfile = await fetch(
            `http://localhost:3000/api/profile/${userId}`,
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
          console.log("impossible d'accéder au profil utilisateur");
        }
      })();
    },
  },
  beforeMount() {
    this.getUserName();
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
  width: 80%;
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
