<template>
  <div class="popup-container" id="popup">
    <div class="popup-bloc">
      <div class="popup-bloc__msg">{{ msg }}</div>
      <pre class="popup-bloc__detail">{{ detail }}</pre>
      <button class="button close" @click="$emit('close')" id="close-popup">
        Fermer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Popup",
  props: ["msg", "detail"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.popup-container {
  background: var(--color-transparent);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
}

.popup-bloc {
  height: auto;
  width: 280px;
  background: var(--color-lighter);
  border-radius: 3rem;
  box-shadow: 0 0 0.5rem var(--color-primary);
  font-family: var(--font-text);
  color: var(--color-dark);
  text-align: center;
  padding: 2rem;
}

.popup-bloc__msg {
  font-weight: bold;
}

.popup-bloc__detail,
pre {
  text-align: justify;
  font-weight: normal;
  font-family: inherit;
  width: 100%;
  white-space: pre-wrap;
}
</style>
