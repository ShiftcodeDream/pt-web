import dayjs from 'dayjs';
import {URL_MAREES} from '../config';

export function downloadTides(){
  return fetch(URL_MAREES)
    .then(resp=>resp.text())
    .then(computeTideDataFromWeb);
}

export function displayTides(tides){
  let old = dayjs('1990-01-01'), next=false, nextDetected=false, actif=false;
  const now = dayjs();
  let result = '';
  tides.forEach(v => {
    // Changement de date
    if(! old.isSame(v, 'day'))
      result += "<h3>" + firstUpperCase(v.format('dddd D MMMM YYYY')) + "</h3>";
    old = v;
    // Next & active
    next = false;
    if(!nextDetected && v.isAfter(now)){
      next = true;
      nextDetected = true;
    }
    actif = (now.isAfter(v.add(-2, 'minute')) && now.isBefore(v.add(15,'minute')));
    // Affiche l'horaire
    let classe = 'horaire';
    if(actif)
      classe += ' horaireActif';
    else if(next)
      classe += ' horaireNext';
    result += '<p class="' + classe + '">' + v.format('HH:mm') + '</p>';
  });
  return result;
}
function computeTideDataFromWeb(tidesData){
  let today = dayjs(), data, cells, result = [];
  // Removes accents to remove UTF-8 multibyte characters
  const texte = tidesData.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Extracts "today" value
  let strToday = extractBetween('<h3 class="orange">', '</h3>', texte);
  if(strToday === null)
    return [];
  strToday = strToday.split('<br />')[1];
  today = fromTextualDate(strToday);

  // Extracts today tide values
  data = extractBetween('<div id="i_donnesJour">', '</div>', texte);
  if (data !== null) {
    cells = splitBetween('<strong>', '</strong>', data);
    if(cells.length>12)
      [10, 12].forEach(addTide);
  }

  // Extracts other days tides
  data = extractBetween('<div id="i_donnesLongue">', '</div>', texte);
  if (data != null) {
    cells = splitBetween('<strong>', '</strong>', data);
    for(let j=3; j<cells.length; j+=7){
      today = today.add(1, 'day');
      [j, j+3].forEach(addTide);
    }
  }

  function addTide(i){
    if (cells[i].length > 0) {
      const v = cells[i].trim().split('h').map(k => parseInt(k));
      let pleineMer = today.hour(v[0]).minute(v[1]);
      if(pleineMer.isValid()) {
        result.push(pleineMer.add(-1, 'hour'));
        result.push(pleineMer.add(1, 'hour'));
      }
    }
  }
  return result;
}
/**
 * Renvoie ce qui est situé entre tagDebut et tagFin, ou null si au moins un des deux tags n'a pas été trouvé
 *
 * @param tagDebut
 * @param tagFin
 * @param texte
 */
function extractBetween(tagDebut, tagFin, texte){
  let indexDebut, indexFin;
  indexDebut = texte.indexOf(tagDebut);
  if(indexDebut < 0)
    return null;
  indexDebut += tagDebut.length;
  indexFin = texte.indexOf(tagFin, indexDebut);
  if(indexFin < 0)
    return null;
  return texte.substring(indexDebut, indexFin);
}
/**
 * Renvoie tout ce qui se situe entre tagDebut et tagFin. Renvoie autant d'éléments
 * de tableau que de couples tagDebut / tagFin trouvés
 *
 * @param tagDebut
 * @param tagFin
 * @param texte
 */
function splitBetween(tagDebut, tagFin, texte){
  const result = [];
  let indexDebut= 0, indexFin;
  while(true) {
    indexDebut = texte.indexOf(tagDebut, indexDebut);
    if (indexDebut < 0)
      return result;
    indexDebut += tagDebut.length;
    indexFin = texte.indexOf(tagFin, indexDebut);
    if (indexFin < 0)
      return result;
    result.push(texte.substring(indexDebut, indexFin));
  }
}
/**
 * Transforme une date "mercredi 30 janvier 2025" en date Dayjs
 * marche aussi pour   "vendredi  3 janvier 2025" (deux espaces à la suite)
 * @param theDate objet dayjs reflétant la date
 */
function fromTextualDate(theDate) {
  const mois = ['','janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre'];
  const v = theDate.trim().split(' ').filter(h=>h.length>0);
  const numMois = mois.indexOf(v[2].toLowerCase());
  return dayjs(v[3] + '-' + numMois + '-' + v[1]);
}

function firstUpperCase(s){
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// TODO : delete
export function mockupTides(){
  return new Promise(ok => {
    ok([
      "2025-04-13T07:01:00.000Z",
      "2025-04-13T09:01:00.000Z",
      "2025-04-13T19:18:00.000Z",
      "2025-04-13T21:18:00.000Z",
      "2025-04-14T07:31:00.000Z",
      "2025-04-14T09:31:00.000Z",
      "2025-04-14T19:45:00.000Z",
      "2025-04-14T21:45:00.000Z",
      "2025-04-15T07:59:00.000Z",
      "2025-04-15T09:59:00.000Z",
      "2025-04-15T20:13:00.000Z",
      "2025-04-15T22:13:00.000Z",
      "2025-04-16T08:27:00.000Z",
      "2025-04-16T10:27:00.000Z",
      "2025-04-16T20:40:00.000Z",
      "2025-04-16T22:40:00.000Z",
      "2025-04-17T08:56:00.000Z",
      "2025-04-17T10:56:00.000Z",
      "2025-04-17T21:09:00.000Z",
      "2025-04-17T23:09:00.000Z",
      "2025-04-18T09:28:00.000Z",
      "2025-04-18T11:28:00.000Z",
      "2025-04-18T21:42:00.000Z",
      "2025-04-18T23:42:00.000Z",
      "2025-04-19T10:07:00.000Z",
      "2025-04-19T12:07:00.000Z",
      "2025-04-19T22:23:00.000Z",
      "2025-04-20T00:23:00.000Z",
      "2025-04-20T10:58:00.000Z",
      "2025-04-20T12:58:00.000Z",
      "2025-04-20T23:22:00.000Z",
      "2025-04-21T01:22:00.000Z",
      "2025-04-21T12:18:00.000Z",
      "2025-04-21T14:18:00.000Z",
      "2025-04-22T00:52:00.000Z",
      "2025-04-22T02:52:00.000Z",
      "2025-04-22T14:07:00.000Z",
      "2025-04-22T16:07:00.000Z",
      "2025-04-23T02:34:00.000Z",
      "2025-04-23T04:34:00.000Z",
      "2025-04-23T15:26:00.000Z",
      "2025-04-23T17:26:00.000Z"
    ].map(t => dayjs(t)))
  });
}