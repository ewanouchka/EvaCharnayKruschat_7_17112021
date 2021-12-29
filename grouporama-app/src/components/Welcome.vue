<template>
  <div class="welcome">
    <h1>{{ welcome }} {{ authentifiedUser }} !</h1>
    <div>
      Voici les dernières actualités :
      <div id="welcome__actu">bloc dernier message à voir</div>
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
    };
  },
  methods: {
    getUserName() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      const userId = JSON.parse(localStorage.getItem("userAuth")).userId;
      (async () => {
        try {
          const userProfile = await fetch("http://localhost:3000/api/profile", {
            method: "POST",
            body: JSON.stringify({
              userId: `${userId}`,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });

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
#welcome__actu {
  width: 80%;
  min-height: 10rem;
  margin: auto;
  border: 1px solid var(--color-primary);
}
</style>
