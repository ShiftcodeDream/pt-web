import {firstUpperCase} from '../lib/utils';

export default function DayTitle({day}){
  return (
  <p className="day">
    {firstUpperCase(day.format('dddd D MMMM YYYY'))}
  </p>
  );
}
