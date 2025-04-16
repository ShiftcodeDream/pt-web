// TODO : delete
function notifyMe() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification("Hi there!");
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification("Hi there!");
        // …
      }
    });
  }
  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}

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

/**
 * Envoie une notification si l'application est autorisée
 *
 * @param title Titre
 * @param message Corps du message
 * @returns {Notification|null}
 */
export function sendNotification(title, message=""){
  return isNotificationGranted()
    ? new Notification(title, {body:message})
    : null;
}
