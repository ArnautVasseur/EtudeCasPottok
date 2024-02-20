- Pour initialiser et utiliser ce repository, vous devez tout simplement le cloner sur VSCode ou le télécharger directement sur votre machine.

- Les bibliothèques du firestore sont stockées dans le dossier "FirestoreDataCollections" sous format JSON.
( Vous pouvez Importer / Exporter des données en JSON de votre Firestore en utilisant FireFoo par exemple )

- Une fois le firestore crée avec les bibiliothèques, comme cette étude de cas fut réalisée sur un environnement Node.js, lancez cette commande dans un terminal dans le répertoire du projet:
- npm install -g firebase-tools
- firebase init functions

- A la suite de l'exécution de la dernière commande, suivez les instructions d'initalisation,
- Choisissez votre projet firebase auparavant crée
- Choisissez la langue Typescript
- Et installez les dépendances avec npm comme indiqué dans le terminal

- Remplacez le contenu du fichier index.ts par le contenu du fichier algorithme.ts
( Vous pouvez supprimer algorithme.ts maintenant )

- lancer cette commande pour vous connecter à votre firestore auparavant crée:
- firebase login

- Vous pouvez maintenant lancer cette commande dans votre terminal:
- firebase deploy --only functions

- Copiez l'URL générée lors du déploiement depuis la console Firebase.
- Utilisez un outil comme Postman ou simplement votre navigateur pour tester l'URL et voir les résultats de l'algorithme.
