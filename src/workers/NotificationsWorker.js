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
import dayjs from 'dayjs';
import {NOTIF_DELAY_KEY, NOTIF_ENABLED_KEY} from '../config';
import {getConfigValue, getTides, getTimeranges, setTideNotified} from '../lib/storage';
import {timeToDayjs} from '../lib/utils';

require('dayjs/locale/fr');
dayjs.locale('fr');

let workerInterval = 0;
const doTheJob = async () => {
  if(await getConfigValue(NOTIF_ENABLED_KEY) === 'false'){
    stop();
    return;
  }

  // Recherche des horaires pour lesquels une notification doit être lancée
  const delai = await getConfigValue(NOTIF_DELAY_KEY);
  const now = dayjs();
  const limite = now.add(delai, 'minute');

  let tide = await getTides()
    .then(tides => tides.find(tid => !tid.notifSent && tid.t.isAfter(now) && tid.t.isBefore(limite)));
  // Pas d'horaire : stopper le traitement
  if(!tide)
    return;
  // Est-ce que l'horaire trouvé fait partie des plages horaires définies par l'utilisateur?
  const jourSemaine = (tide.t.day()+6) % 7;
  const timeRanges = await getTimeranges(true);
  let result = timeRanges.find(tr =>
      tr.weekDays[jourSemaine]  // Le jour de la semaine de l'horaire correspond aux critères de la plage horaires
      && timeToDayjs(tr.from).isBefore(tide.t) // et l'horaire de la manoeuvre est inclu dans la plage horaire concernée
      && timeToDayjs(tr.to).isAfter(tide.t.add(1, 'minute'))
  );
  // Si au moins une plage horaire active correspond aux critères, alors on envoie une notification
  if(result){
    new Notification("Manoeuvre du pont tournant le " + tide.t.format('D MMMM'),
      {body:"Le pont va tourner à " + tide.t.format("HH:mm") + " si un bateau se présente."} );
    setTideNotified(tide);
  }
}

onmessage = e => {
  if(e.data.start && workerInterval === 0){
    workerInterval = setInterval(doTheJob, 60000);
  }
  if(e.data.stop && workerInterval !== 0){
    stop();
  }
  if(e.data.start || e.data.stop || e.data.status) {
    postMessage({ running: workerInterval !== 0 });
  }
}

function stop(){
  clearInterval(workerInterval);
  workerInterval = 0;
}
