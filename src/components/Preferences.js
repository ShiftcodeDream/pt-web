import {useEffect, useState} from 'react';
import {deleteRange, getConfigValue, getTimeranges, putRange, setConfigValue} from '../lib/storage';
import TimeRange, {getDefaultValues} from './TimeRange';
import {NOTIF_ENABLED_KEY, NOTIF_DELAY_KEY} from '../config';
import {askNotificationAuthorization, isNotificationGranted} from '../lib/notif';

export default function Preferences({notifWorker}){
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifDelay, setNotifDelay] = useState(10);
  const [timeRanges, setTimeRanges] = useState([]);

  useEffect(() => {
    getConfigValue(NOTIF_ENABLED_KEY, true).then(r => setNotifEnabled(r=== 'true'));
    getConfigValue(NOTIF_DELAY_KEY, 10).then(setNotifDelay);
    getTimeranges().then(setTimeRanges);
  }, []);

  async function toggleEnabled(){
    let newState = !notifEnabled;
    // On demande l'autorisation d'envoyer des notifications
    // Si l'autorisation est refusée, on décoche la case à cocher.
    if(newState && !isNotificationGranted()){
      newState = await askNotificationAuthorization();
      if(!newState)
        alert("Votre appareil n'accepte pas les notifications");
    }
    setNotifEnabled(newState);
    // Démarre ou stoppe le notification worker en fonction de l'état de la préférence utilisateur
    if(newState)
      notifWorker.postMessage({start: true});
    else
      notifWorker.postMessage({stop: true});
    setConfigValue(NOTIF_ENABLED_KEY, newState ? 'true' : 'false');
  }

  function onChangeNotifDelay(event){
    let newValue = parseInt(event.target.value);
    setNotifDelay(newValue);
    if(isNaN(newValue)){
      newValue = 10;
    } else {
      if(newValue < 10)  newValue = 10;
      if(newValue > 120) newValue = 120;
    }
    setConfigValue(NOTIF_DELAY_KEY, newValue);
  }

  function addTimeRange() {
    putRange(getDefaultValues())
      .then(createdId =>
        setTimeRanges(current => [...current, {active: true, id:createdId}])
      );
  }

  function onChangeTimeRange(id, values) {
    setTimeRanges(current =>
      current.map(t => {
        if (t.id === id) {
          t = values;
          putRange(t);
        }
        return t;
      })
    );
  }

  function onDeleteTimerange(id){
    deleteRange(id);
    setTimeRanges(current => current.filter(k => k.id !== id));
  }

  return (<>
    <h2>Configuration des notifications</h2>
    <p>
      <input type="checkbox" id="preventMe" checked={notifEnabled} onChange={toggleEnabled}/>
      <label htmlFor="preventMe">Me prévenir</label>
      <input type="number" value={notifDelay} onChange={onChangeNotifDelay}
             min="0" max="120" step="10"/>
      <label htmlFor="preventMe">minutes avant que le pont tourne dans l'une des plages horaires suivantes :</label>
    </p>
    <div hidden={!notifEnabled}>
      <p style={{textAlign:'right'}}>
        <button onClick={addTimeRange}>+ Ajouter une plage horaire</button>
      </p>
      <div id="listeAlertes">
        {timeRanges && timeRanges.length>0 && timeRanges.map(t =>
          <TimeRange value={t} key={t.id}
                     onChange={ vals => onChangeTimeRange(t.id, vals)}
                     onDelete={()=>onDeleteTimerange(t.id)}
          />
        )}
      </div>
    </div>
  </>);
}
