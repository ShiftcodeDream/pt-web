import dayjs from 'dayjs';

import {getConfigValue, setConfigValue, storeTides} from '../lib/storage';
import {FETCH_DATA_HOURS_INTERVAL, LAST_FETCH_KEY} from '../config';
import {downloadTides} from '../lib/tides';

/**
 * Ce worker télécharge les horaires des marées dans le cas où cela fait plus de
 * quatre heures qu'il n'a pas téléchargé les marées.
 * Message d'entrée : {
 *   do: doit être égal à true
 *   force: si force est vrai, force le téléchargement, même si le dernier téléchargement
 *   date de moins de quatre heures
 * }
 *
 * Message de sortie : {
 *   updated: vaut true si un téléchargement a été tenté
 *   success: vaut true si le téléchargement a réussi
 *   last : dayjs du dernier téléchargement réussi
 * }
 *
 */
onmessage = async e => {
  // ignores all other messages
  if(e.data.do) {
    let now = dayjs();
    let last = await getConfigValue(LAST_FETCH_KEY).then(d => dayjs(d));
    let updated = e.data.force || !last.isValid() || last.isBefore(now.add(-FETCH_DATA_HOURS_INTERVAL, 'hour'));
    let success = false;
    if(updated){
      await downloadTides()
        .then(storeTides)
        .then(() => {
          last = now;
          success = true;
          setConfigValue(LAST_FETCH_KEY, last.toISOString());
        })
        .catch(e => {
          console.error(e);
          success = false;
        });
    }
    postMessage({ updated, success, last });
  }
}
