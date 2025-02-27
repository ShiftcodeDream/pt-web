function downloadTides(){
  return fetch('marees.php')
    .then(resp=>resp.text())
    .then(computeTideDataFromWeb);
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
