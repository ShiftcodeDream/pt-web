export default function DisplayHour({heure, actif, next}){
  const cn = ['horaire'];
  if(actif)
    cn.push('horaireActif');
  else if(next)
    cn.push('horaireNext');

  return (
    <div className={cn.join(' ')}>{heure.format('HH:mm')}</div>
  );
}
