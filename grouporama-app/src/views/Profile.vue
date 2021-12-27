<template>
  <div class="profile">
    <img
      alt="logo above Groupomania"
      src="../assets/icon-above-font.svg"
      class="home__logo"
    />
    <h1>{{ userFirstName }} {{ userLastName }}</h1>
    <p>{{ userEmail }}</p>
  </div>
</template>

<script>
export default {
  name: "Profile",
  props: ["userSurname", "userName", "email"],
  data: function () {
    return {
      welcome: "Bienvenue",
      userFirstName: this.userSurname,
      userLastName: this.userName,
      userEmail: this.email,
    };
  },
  methods: {
    getUserProfile() {
      const userToken = JSON.parse(localStorage.getItem("userAuth")).token;
      (async () => {
        try {
          const userProfile = await fetch("http://localhost:3000/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          });
          const userProfileJSON = await userProfile.json();
          console.log(userProfileJSON);

          if (userProfileJSON) {
            this.userFirstName = userProfileJSON.first_name;
            this.userLastName = userProfileJSON.last_name;
            this.userEmail = userProfileJSON.email;
            return;
          }
        } catch (error) {
          console.log("impossible d'accéder au profil utilisateur");
        }
      })();
    },
  },
  beforeMount() {
    this.getUserProfile();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
