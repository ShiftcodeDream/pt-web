/**
 * Renvoie true si l'application a l'autorisation d'envoyer des notifications
 * Renvoie false si l'utilisateur l'a expressément refusé.
 *
 * @returns {boolean}
 */
export function isNotificationGranted() {
  return ("Notification" in window) && (Notification.permission !== "denied");
}

/**
 * Demande l'autorisation d'envoyer des notifications
 * Retourne une promesse livrant un booléen :
 * true si l'autorisation a été accordée
 * false si l'autorisation est refusée par l'utilisateur
 */
export function askNotificationAuthorization(){
  return Notification.requestPermission()
    .then(permission => permission === "granted");
}
