<template>
  <div class="login">
      <h1>Bienvenue !</h1>
      <p>Connectez-vous à votre compte utilisateur</p>
      <form id="login-form">
    <label for="Email" class="form-label">Votre e-mail : <span class="error-visible" id="error-message-Email"></span>
    </label>
    <input placeholder="contact@groupomania.com" name="Email" id="Email" class="form-input" type="email" required pattern="^[a-zA-Z0-9]+[a-zA-Z\-\.\_]*@{1}[a-zA-Z0-9]+[\.]{1}[a-zA-Z]{2,}$">
    <!-- oninput="checkValidity(this)" -->
    
    <label for="Password" class="form-label">Votre mot de passe : <span class="error-visible" id="error-message-Email"></span>
    </label>
    <input placeholder="123456AzErTy" name="Password" id="Password" class="form-input" type="email" required pattern="^[a-zA-Z0-9]+[a-zA-Z\-\.\_]*@{1}[a-zA-Z0-9]+[\.]{1}[a-zA-Z]{2,}$">
    
    <button class="button" id="login-submit">Connexion</button>
      <router-link to="/signup" class="create-account">Vous n'avez pas encore de compte ?</router-link>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#login-form{
    display:flex;
    justify-content: center;
    align-self: center;
    flex-wrap: wrap;
    max-width:40rem;
}

.create-account{
    width:100%;
}

</style>
