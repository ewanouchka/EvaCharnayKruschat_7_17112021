<template>
  <div class="popup-container" id="popup">
    <div class="popup-bloc">
    <div class="popup-bloc__msg">{{ msg }}</div>
    <div class="popup-bloc__detail">
      {{ detail }}
    </div>
    <button class="button" id="close-popup">Fermer</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  data: 
    function() {
      return {
        msg: "Aïe aïe aïe",
        detail: "Le popup est vide",
      };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.popup-container {
  background: var(--color-transparent);
  width: 100vw;
  height: 100vh;
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}

.popup-container-visible {
  display:flex;
}

.popup-bloc {
  height: auto;
  width: 35%;
  background: var(--color-lighter);
  border-radius: 3rem;
  box-shadow: 0 0 0.5rem var(--color-primary);
  font-family: var(--font-text);
  text-align: center;
  padding: 2rem;
}

.popup-bloc div{
 font-weight:bold;
}

.popup-bloc p{
 text-align: justify;
 font-weight:normal;
}
</style>
