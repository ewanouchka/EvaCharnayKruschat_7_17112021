<template>
  <div id="app">
    <Nav />
    <router-view class="main-section" />
    <footer>
      {{ copyright }}
    </footer>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";

export default {
  name: "App",
  components: {
    Nav,
  },
  computed: {
    copyright() {
      const currentYear = new Date().getFullYear();
      return `Groupomania©${currentYear}`;
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}

:root {
  --color-primary: rgb(28, 28, 87);
  --color-primary-transparent: rgba(28, 40, 155, 0.15);
  --color-secondary: rgb(247, 128, 128);
  --color-secondary-transparent: rgb(252, 230, 230);
  --color-secondary-dark: rgb(226, 46, 46);
  --color-secondary-gradient: linear-gradient(
    -165deg,
    var(--color-lighter),
    var(--color-secondary) 25%,
    var(--color-secondary-dark) 60%,
    var(--color-secondary-dark)
  );
  --color-transparent: rgba(255, 255, 255, 0.95);
  --color-lighter: rgb(255, 255, 255);
  --color-light: rgb(199, 199, 199);
  --color-medium: rgb(128, 128, 128);
  --color-dark: rgb(56, 56, 56);
  --color-darker: rgb(0, 0, 0);
  --font-text: Avenir, Helvetica, Arial, sans-serif;
  --font-title: Avenir, Helvetica, Arial, sans-serif;
  --font-size: 16px;
  --padding-top-bottom: 1rem;
  --footer-size: 1.25rem;
  --header-size: 2rem;
}

a {
  text-decoration: none;
  color: var(--color-primary);
  transition: all 0.3s ease-in-out;

  &:hover {
    color: var(--color-secondary);
  }
}

.router-link-active {
  margin: auto;
}

#app {
  font-family: var(--font-text);
  font-size: var(--font-size);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-dark);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.home__logo {
  width: 40rem;
  height: 25rem;
  object-fit: cover;
}

@media all and (min-width: 426px) and (max-width: 767px) {
  .home__logo {
    width: 400px;
    height: 15rem;
  }
}

@media all and (min-height: 641px) and (max-height: 823px) {
  .home__logo {
    width: 400px;
    height: 15rem;
  }
}

@media all and (max-width: 425px) {
  .home__logo {
    width: 270px;
    height: 9rem;
  }
}

@media all and (max-height: 640px) {
  .home__logo {
    width: 270px;
    height: 9rem;
  }
}

button {
  margin: 1rem;
  border: none;
  border-radius: 2rem;
  background: var(--color-secondary-gradient);
  box-shadow: 0 0 0.5rem var(--color-light);
  height: 2rem;
  padding: 0 1rem;
  color: var(--color-lighter);
  font-weight: bold;
  transition: all 0.3s ease-in-out;

  &:hover {
    color: var(--color-light);
    box-shadow: 0 0 0.5rem var(--color-medium);
  }
}

.main-section {
  height: calc(
    100vh - var(--header-size) - var(--footer-size) - 4 *
      var(--padding-top-bottom)
  );
  width: 50rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.form-label {
  width: 100%;
  margin: 1rem 0 0 0;
  font-weight: bold;
  font-family: var(--font-text);
}
.form-input {
  width: 100%;
  margin: 0 1rem;
  border: 1px solid var(--color-light);
  border-radius: 3px;
  text-align: center;
  font-family: var(--font-text);

  &:focus-visible {
    border: 1px solid var(--color-primary);
    outline: transparent auto 0px;
  }
}

.input-invalid {
  background: var(--color-secondary-transparent);
  border: 1px solid var(--color-secondary);
}

footer {
  width: 100%;
  height: var(--footer-size);
  padding: var(--padding-top-bottom);
  background: var(--color-secondary);
  color: var(--color-dark);
}
</style>
