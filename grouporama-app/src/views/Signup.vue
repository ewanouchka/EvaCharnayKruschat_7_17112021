<template>
  <div class="signup">
    <img alt="logo above Groupomania" src="../assets/icon-above-font.svg" class="home__logo">
      <h1>Enregistrez votre compte utilisateur</h1>
      <p>Veuillez remplir tous les champs</p>
      <form id="signup-form">
        <label for="Nom" class="form-label">Votre nom : <span class="error-visible" id="error-message-Email"></span>
    </label>
    <input placeholder="Dupont" name="Name" id="Name" class="form-input" type="text" required pattern="^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z\-\']{2,}$">

   <label for="Prénom" class="form-label">Votre prénom : <span class="error-visible" id="error-message-Email"></span>
    </label>
    <input placeholder="Dominique" name="Surname" id="Surname" class="form-input" type="text" required pattern="^[àáâãäåçèéêëìíîïðòóôõöùúûüýÿa-zA-Z\-\']{2,}$">

        <label for="Email" class="form-label">Votre e-mail : <span class="error-visible" id="error-message-Email"></span>
    </label>
    <input placeholder="contact@groupomania.com" name="Email" id="Email" class="form-input" type="email" required pattern="^[a-zA-Z0-9]+[a-zA-Z\-\.\_]*@{1}[a-zA-Z0-9]+[\.]{1}[a-zA-Z]{2,}$">
   
     <!-- oninput="checkValidity(this)" -->
      <label for="Password" class="form-label">Votre mot de passe : <span class="error-visible" id="error-message-Email"></span>
    </label>
    <input placeholder="123456AzErTy*" name="Password" id="Password" class="form-input" type="text" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$">
  
    <label for="RepeatPassword" class="form-label">Répétez votre mot de passe : <span class="error-visible" id="error-message-Email"></span>
    </label>
    <input placeholder="123456AzErTy*" name="Repeat-Password" id="Repeat-Password" class="form-input" type="text" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$">
    
    <button class="button" id="signup-submit">S'enregistrer</button></form>
  </div>
</template>


<!-- <script>
export default {
  name: 'Signup'
}
</script> -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#signup-form{
    display:flex;
    justify-content: center;
    align-self: center;
    flex-wrap: wrap;
    max-width:40rem;
}

.home__logo {
  width:40rem;
  height:25rem;
  object-fit: cover;
  }

@media all and (max-width: 425px) {
.home__logo {
  width:270px;
  height:9rem;
  }
}
@media all and (min-width: 426px) and (max-width: 768px) {
.home__logo {
  width:400px;
  height:15rem;
  }
}
</style>
