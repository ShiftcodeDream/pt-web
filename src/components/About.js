import {APP_VERSION, ENV_NAME} from '../config';

export default function About() {
  return (<div id="cont-apropos">
    <h2>Pont Tournant de Cherbourg</h2>
    <p>Le pont tournant de Cherbourg est susceptible de tourner
      <b> une heure avant</b> et <b>une heure après</b> la pleine mer.
       Le pont ne tournera que si un bâteau se présente pour entrer ou sortir du bassin du commerce. </p>
    <p>Les horaires sont donnés à titre indicatif et susceptibles d'être décalés en fonction de l'avancement ou l'arrivée des navires.</p>
    <p>Pendant toute la durée de la manœuvre, la traversée du pont par les véhicules terrestres et les piétons est
       rendue impossible. Cette manœuvre ne dure en général pas plus de dix minutes. </p>
    <h2>A propos de l'application</h2>
    <p>Si vous avez l'habitude de traverser le pont tournant à certaines heures (pour aller ou revenir du travail par
       exemple),
       renseignez ces horaires dans l'application. Vous recevrez une notification quelques minutes avant la manœuvre.
       Ce délai est paramétrable à votre guise : vous pouvez définir combien de temps avant que la manœuvre n'ait lieu
       vous souhaitez être prévenu. </p>
    <h2>Légende des couleurs</h2>
    <p>Lorsque qu'un horaire est <span className="horaireNext">souligné en vert</span>, il indique la prochaine
    manoeuvre du pont.</p>
    <p>Lorsque qu'un horaire est <span className="horaireActif">souligné en rose</span>, il indique qu'aux vues de
       l'horaire souligné, le pont est probablement tourné actuellement.</p>
    <hr/>
    <p style={{fontSize:14}}>Application Pont Tournant version {APP_VERSION} - {ENV_NAME} - Développé par Matthias Delamare <a href="http://mdelamare.free.fr">http://mdelamare.free.fr</a></p>
  </div>);
}