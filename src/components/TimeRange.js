import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import WeekDaySelector from './WeekDaySelector';

export default function TimeRange({value, onChange, onDelete}){
  const defaults = getDefaultHours();
  const [active, setActive] = useState(true);
  const [from, setFrom] = useState(defaults[0]);
  const [to, setTo] = useState(defaults[1]);
  const [weekDays, setWeekDays] = useState(Array(7).fill(false));
  const [description, setDescription] = useState('');

  useEffect(() => {
    const defaults = getDefaultHours();
    setActive(value.active === undefined ? false : value.active);
    setFrom(value.from ?? defaults[0]);
    setTo(value.to ?? defaults[1]);
    if(value.weekDays) {
      setWeekDays(value.weekDays);
    } else {
      const d = Array(7).fill(false);
      d[(dayjs().day()+6) % 7] = true;
      setWeekDays(d);
    }
    setDescription(value.description ?? '');
  }, [value]);

  function changes(params){
    onChange(Object.assign({},{active, from, to, weekDays, description, id:value.id}, params));
  }

  return (
    <div className="timerange">
      <div className={active ? 'head_on' : 'head_off'}>
        <div>
          <input type="checkbox" checked={active} onChange={()=>changes({active: !active})} id={value.id + '-act'}/>
          <label htmlFor={value.id + '-act'}>Notification {active ? 'activée' : 'désactivée'}</label>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon" onClick={onDelete}>
            <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
          </svg>
        </div>
      </div>
      <div>
        <label>Plage horaire : </label>
        <input type="time" value={from} onChange={e=>changes({from: e.target.value})} step="300" className="timeSelector"/>
        <label> - </label>
        <input type="time" value={to} onChange={e=>changes({to: e.target.value})} step="300" className="timeSelector"/>
      </div>
      <div><label>Jours de la semaine :</label></div>
        <WeekDaySelector values={weekDays} onChange={wd=>changes({weekDays: wd})} />
      <div>
        <input type="text" value={description} maxLength="50" className="w-100 description" placeholder="Description"
               onChange={e => changes({description: e.target.value.substring(0,50)})}  />
      </div>
    </div>
  )
}

function getDefaultHours(){
  let d = dayjs();
  d = d.subtract(d.minute() % 5, 'minute');
  return [
    d.format("HH:mm"),
    d.add(15,'minute').format("HH:mm")
  ];
}

export function getDefaultValues(){
  const defaults = getDefaultHours();
  const d = Array(7).fill(false);
  d[(dayjs().day()+6) % 7] = true;

  return {
    active: true,
    from: defaults[0],
    to: defaults[1],
    weekDays: d,
    description: ''
  }
}
