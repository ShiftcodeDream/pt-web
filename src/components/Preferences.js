import {useEffect, useState} from 'react';
import {getConfigValue, setConfigValue} from '../lib/storage';
import TimeRange from './TimeRange';

export default function Preferences(){
  const NOTIF_ENABLED_KEY = 'NotifEnabled';
  const NOTIF_DELAY_KEY = 'DelaiNotif';
  const TIMERANGES_KEY = 'TimeRanges';
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifDelay, setNotifDelay] = useState(10);
  const [timeRanges, setTimeRanges] = useState();

  useEffect(() => {
    setNotifEnabled(getConfigValue(NOTIF_ENABLED_KEY) === 'true');
    const delai = getConfigValue(NOTIF_DELAY_KEY);
    if(delai !== null && !isNaN(parseInt(delai)))
      setNotifDelay(delai);
    let ranges = getConfigValue(TIMERANGES_KEY);
    if(ranges !== null)
      setTimeRanges(JSON.parse(ranges));
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
  useEffect(() => {
    if(timeRanges !== undefined) {
      setConfigValue(TIMERANGES_KEY, JSON.stringify(timeRanges));
    }
  }, [timeRanges]);

  function addTimeRange() {
    setTimeRanges(current => [...current, {active: true}]);
  }

  function onChangeTimeRange(index, values) {
    setTimeRanges(current => {
      const n = [...current];
      n[index] = values;
      return n;
    })
  }

  function onDeleteTimerange(index){
    setTimeRanges(current => current.filter((k, i)=> i !== index));
  }

  return (<>
    <h2>Configuration des notifications</h2>
    <p>
      <input type="checkbox" id="preventMe" checked={notifEnabled} onChange={toggleEnabled}/>
      <label htmlFor="preventMe">Me prévenir</label>
      <input type="number" value={notifDelay} step="10"
             onChange={e => setNotifDelay(e.target.value)} min="0" max="120"/>
      <label htmlFor="preventMe">minutes avant que le pont tourne dans l'une des plages horaires suivantes :</label>
    </p>
    <div hidden={!notifEnabled}>
      <p style={{textAlign:'right'}}><button onClick={addTimeRange}>+ Ajouter une plage horaire</button></p>
      <div id="listeAlertes">
        {timeRanges && timeRanges.length>0 && timeRanges.map((t, ind) =>
          <TimeRange value={t} key={'tr' + ind} cle={'tr' + ind}
                     onChange={ vals => onChangeTimeRange(ind, vals)}
                     onDelete={()=>onDeleteTimerange(ind)}
          />
        )}
      </div>
    </div>
  </>);
}
