import {useEffect, useState} from 'react';
import {getConfigValue, setConfigValue} from '../lib/storage';

export default function Preferences(){
  const NOTIF_ENABLED_KEY = 'NotifEnabled';
  const NOTIF_DELAY_KEY = 'DelaiNotif';
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifDelay, setNotifDelay] = useState(10);

  useEffect(() => {
    setNotifEnabled(getConfigValue(NOTIF_ENABLED_KEY) === 'true');
    const delai = getConfigValue(NOTIF_DELAY_KEY);
    if(delai !== null && !isNaN(parseInt(delai)))
      setNotifDelay(delai);
  }, []);
  function toggleEnabled(){
    setNotifEnabled(n=>!n);
  }

  useEffect(() => {
    setConfigValue(NOTIF_ENABLED_KEY, notifEnabled ? 'true' : 'false');
  }, [notifEnabled]);

  useEffect(() => {
    setConfigValue(NOTIF_DELAY_KEY, notifDelay);
  }, [notifDelay]);

  return (<>
    <h2>Configuration des notifications</h2>
    <p>
      <input type="checkbox" id="preventMe" checked={notifEnabled} onChange={toggleEnabled}/>
      <label htmlFor="preventMe">Me prévenir avant que le pont tourne</label>
    </p>
    <div hidden={!notifEnabled}>
      <p className="separateur">
        <label htmlFor="delai">Délai de prévenance en minutes</label>
        <input type="number" value={notifDelay} onChange={e=>setNotifDelay(e.target.value)} min="0" max="120" step="10"/>
      </p>
      <p>
        <button id="ajouterAlerte">+ Ajouter</button>
      </p>
      <div id="listeAlertes"></div>
    </div>
  </>);
}
