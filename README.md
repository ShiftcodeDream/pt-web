# Application Pont Tournant
## Détails techniques
Le but de cette application est de créer une application web déployable en tant qu'application sur un smartphone
(principe de PWA)

Le stockage des préférences utilisateurs et des horaires des manœuvres se fait dans le indexed database
du navigateur, de façon à rester accessibles aux workers.

Un service worker gère la mise en cache du code.
Le TideWorker télécharge régulièrement les horaires des manœuvres
Le NotificationWorker créée les notifications pour alerter l'utilisateur d'une manœuvre à venir.

## A propos des workers
Les workers utilisés ont besoin de code commun au projet et de bibliothèques inclues dans le dossier node_modules (dayjs notamment).
A partir d'un projet `create-react-app`, il a fallu exécuter `npm run eject` afin de pouvoir modifier la configuration de webpack.
Ainsi, le code de chaque worker (TidesWorker, NotificationsWorker) doit être construit comme un module à part entière, aves les bibliothèques et code requis.
En conséquence, la configuration de webpack a été modifiée afin de construire le build principal du projet, plus deux
builds complémentaires; un par worker. La partie "Entry" de webpack.config.js contient donc trois entrées au lieu d'une.
Cette configuration des webpack nous oblige à "dupliquer" dans chaque module la bibliothèque dayjs.

## Développement
### Scripts
`npm start`
[http://localhost:3000](http://localhost:3000)

`npm test`
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

`npm run build`
