import {useEffect, useState} from 'react';

export default function WeekDaySelector({values, onChange}){
  const [days, setDays] = useState([]);
  const semaine = "LMMJVSD".split('');

  useEffect(() => {
    setDays(values ?? Array(7).fill(false));
  }, [values]);

  function onDayClick(index){
    setDays(current => {
      const n = [...current];
      n[index] = !n[index];
      setTimeout(()=>onChange(n), 1);
      return n;
    })
  }

  return (
    <div className="flex-around jours-semaine">
      {semaine.map((j, ind) => (
        <div className={days[ind] ? 'selected':''} onClick={()=>onDayClick(ind)} key={`wd-${ind}`}>{j}</div>
      )) }
    </div>
  )
}
