<template>
  <div id="text-editor">
    <h2>Poster un message</h2>
    <div class="text-editor">
      <div>
        <label for="Title"
          >Titre du post :
          <span class="error-visible" id="error-message-Title"></span>
        </label>
        <input
          placeholder="Titre du post"
          name="Title"
          id="Title"
          type="text"
          required
        />
        <label for="Post"
          >Votre post :
          <span class="error-visible" id="error-message-Post"></span>
        </label>
        <textarea
          placeholder="Votre post"
          name="Post"
          id="Post"
          rows="5"
          required
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextEditor",
};
// ajouter bouton submit et créer la fonction (+ route backend)
</script>

<style scoped lang="scss">
#text-editor h2 {
  margin: 2rem 0 0 0;
}
.text-editor {
  padding: 0;
}
.text-editor div {
  background: var(--color-secondary-transparent);
  border-radius: 0.5rem;
  margin: 0 0 1rem 0;
  padding: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.text-editor label {
  width: 100%;
  margin: 1rem 0 0 0;
  font-weight: bold;
  text-align: left;
  padding: 0 0 0 1.25rem;
}
.text-editor input {
  border: 1px solid var(--color-light);
  margin: 0.5rem;
  padding: 0.25rem;
  align-self: stretch;
  background: var(--color-transparent);
  border-radius: 0.5rem;
  text-align: justify;
  font-family: var(--font-text);
}
.text-editor textarea {
  border: 1px solid var(--color-light);
  margin: 0.5rem;
  padding: 0.25rem;
  align-self: stretch;
  background: var(--color-transparent);
  border-radius: 0.5rem;
  text-align: justify;
  font-family: var(--font-text);
}
</style>