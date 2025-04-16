/**
 * Ce worker est responsable de l'envoi des notifications au moment voulu par l'utilisateur
 * Ce service prend en entrée :
 * {start: true} pour lancer le traitement à intervalle régulier
 * {stop: true} pour stopper le traitement
 * {status: true} pour demander le status en cours
 *
 * A ces trois types de demande, le service répond :
 * {running: true} si le traitement est en cours d'exécution
 * {running: false} si le traitement est stoppé ou pas encore démarré
 *
 */

let workerInterval = 0;
const doTheJob = async () => {

}

onmessage = e => {
  if(e.data.start && workerInterval === 0){
    workerInterval = setInterval(doTheJob, 60000);
  }
  if(e.data.stop && workerInterval !== 0){
    clearInterval(workerInterval);
    workerInterval = 0;
  }
  if(e.data.start || e.data.stop || e.data.status) {
    postMessage({ running: workerInterval !== 0 });
  }
}
