import packageJson from '../package.json';
// Version de l'application
export const APP_VERSION = packageJson.version;
// API de téléchargement des horaires de marées
export const ENV_NAME = process.env.NODE_ENV;
export const URL_MAREES = ENV_NAME === 'production'
  ? "https://pont-tournant.infinityfreeapp.com/marees.php"
  : "http://localhost/PTWeb/marees.php";
// Clé de configuration du dernier chargement des marées
export const LAST_FETCH_KEY = 'lastFetch';
// Intervalle minimal en heures entre deux téléchargements des horaires de marée
export const FETCH_DATA_HOURS_INTERVAL = 4;
// Case à cocher "m'avertir des nouvelles notifications"
export const NOTIF_ENABLED_KEY = 'NotifEnabled';
// Délai de prévenance avant que le pont ne tourne
export const NOTIF_DELAY_KEY = 'DelaiNotif';
