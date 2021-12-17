# GROUPORAMA APP

## P7 - Créer un réseau social d'entreprise

Contexte du proket :

Vous êtes développeur depuis plus d'un an chez CONNECT-E, une petite agence web regroupant une douzaine d'employés. Votre directrice, Stéphanie, invite toute l'agence à prendre un verre pour célébrer une bonne nouvelle ! Elle vient de signer un contrat pour un nouveau projet ambitieux ! 🥂 Le client en question est Groupomania, un groupe spécialisé dans la grande distribution et l'un des plus fidèles clients de l'agence.

Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues. Le département RH de Groupomania a laissé libre cours à son imagination pour les fonctionnalités du réseau et a imaginé plusieurs briques pour favoriser les échanges entre collègues.

Spécifications fonctionnelles : https://s3-eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P7/Groupomania_Specs_FR_DWJ_VF.pdf

## Installation

### Depuis le terminal general

Pour accéder à la base de données, il faudra installer postregesql sur votre poste.
Pour Mac via Homebrew : lancer `brew install postgresql`.

Lancer le serveur : `pg_ctl -D /usr/local/var/postgres start`.
Accéder à postgres : `psql postgres`.

### Dans le dossier frontend "grouporama-app"

Les dépendances suivantes sont requises pour faire tourner le frontend :
dependencies:
"core-js": "^3.6.5",
"vue": "^2.6.11",
"vue-router": "^3.2.0"

devDependencies:
"@vue/cli-plugin-babel": "~4.5.0",
"@vue/cli-plugin-eslint": "~4.5.0",
"@vue/cli-plugin-router": "~4.5.0",
"@vue/cli-service": "~4.5.0",
"babel-eslint": "^10.1.0",
"eslint": "^6.7.2",
"eslint-plugin-vue": "^6.2.2",
"node-sass": "^4.12.0",
"sass-loader": "^8.0.2",
"vue-template-compiler": "^2.6.11"

Lancez `npm run serve` dans ce dossier : le serveur local doit se lancer et le message suivant doit apparaître dans la console :
App running at:

- Local: http://localhost:8080/
- Network: http://192.168.1.42:8080/

Ouvrir le navigateur à l'adresse indiquée.
Utiliser Ctrl+C dans le terminal pour arrêter le serveur local.

### Dans le dossier backend

Les dépendances suivantes sont utilisées pour faire tourner le backend :
"bcrypt": "^5.0.1",
"body-parser": "^1.19.0",
"dotenv": "^10.0.0",
"express": "^4.17.1",
"jsonwebtoken": "^8.5.1",
"multer": "^1.4.3",
"pg": "^8.7.1",
"pg-hstore": "^2.3.4",
"sequelize": "^6.12.0-alpha.1"

Il conviendra d'ajouter un fichier '.env' comportant les variables environnementales requises à la racine du dossier backend. (Ces éléments sont déjà présent dans le dossier .zip transmis pour l'évaluation).

Lancez node server ou nodemon server. La console doit vous indiquer 'Listening on port 3000'. Utiliser Ctrl+C dans le terminal pour arrêter le serveur.
