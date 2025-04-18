import {useEffect, useState} from 'react';
import {getTides} from '../lib/storage';
import dayjs from 'dayjs';
import DayTitle from './DayTitle';
import DisplayHour from './DisplayHour';

export default function Horaires({pleaseRefresh}){
  const [tides, setTides] = useState([]);
  const [liste, setListe] = useState([]);

  useEffect(() => {
    getTides().then(rep => setTides(rep.map(t => t.t)));
  }, [pleaseRefresh]);

  useEffect(makeList, [tides]);
  
  function makeList() {
    let old = 0, next=false, nextDetected=false, actif=false;
    const now = dayjs();
    let result = [];
    tides.forEach((v,i) => {
      // Date change detection
      if(old !== v.get('date')) {
        result.push(
          <DayTitle day={v} key={'d' + i}/>
        );
      }
      old = v.get('date');
      // Next & active movements detection
      next=false;
      if(!nextDetected && v.isAfter(now)){
        next = true;
        nextDetected = true;
      }
      actif = (now.isAfter(v.add(-2, 'minute')) && now.isBefore(v.add(15,'minute')));
      // Finally, display time
      result.push(
        <DisplayHour heure={v} key={'h'+i} actif={actif} next={next}/>
      );
    });
    setListe(result);
  }
  
  return (
    <><h1>Horaires de fermeture du pont</h1>
    {liste!==null && liste.length
      ? liste
      : "Pas d'horaire connu pour le moment"
    }
    </>
  );
}
