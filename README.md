# Application Pont Tournant
## Détails techniques
Le but de cette application est de créer une application web déployable en tant qu'application sur un smartphone
(principe de PWA)

Le stockage des préférences utilisateurs et des horaires des manœuvres se fait dans le indexed database
du navigateur, de façon à rester accessibles aux workers.

Un service worker gère la mise en cache du code.
Le TideWorker télécharge régulièrement les horaires des manœuvres
Le NotificationWorker créée les notifications pour alerter l'utilisateur d'une manœuvre à venir.

## Développement
### Scripts
`npm start`
[http://localhost:3000](http://localhost:3000)

`npm test`
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

`npm run build`
