import dayjs from 'dayjs';
import getDatabase from '../schema';
import {clearObjectStore, getAll, getValue, putValue} from './PromisedIndexedDb';

/**
 * Enregistre les marées
 * @param tides Tableau d'objets DayJs représentant les horaires des manoeuvres potentielles du pont
 * @returns {Promise<Awaited<unknown>[]>}
 */
export function storeTides(tides) {
  return getDatabase()
    .then(db => clearObjectStore(db, 'tide'))
    .then(db => Promise.all(tides.map(t =>
      putValue(db, 'tide', { t: t.toISOString() })
    )));
}

/**
 * Retourne tous les horaires de manoeuvre potentiels enregistrés dans la database
 * sous la forme d'un tableau d'objets Dayjs
 * @returns {*}
 */
export function getTides(){
  return getDatabase()
    .then(db => getAll(db, 'tide'))
    .then(tides => tides.map(d => dayjs(d.t)));
}

/**
 * Enregistre un couple clé / valeur dans l'indexed Database du navigateur
 * @param key
 * @param value
 * @returns {Promise<*>}
 */
export const setConfigValue = (key,value) => {
  return getDatabase()
    .then(db => putValue(db, 'prefs', { key, value }));
}
/**
 * Renvoie la valeur enregistrée correspondant à la clé
 * @param key Clé de la valeur
 * @param defaultValue Valeur par défaut si la clé n'existe pas
 * @returns {Promise<*>}
 */
export const getConfigValue = (key, defaultValue=null) => {
  return getDatabase()
    .then(db => getValue(db, 'prefs', key))
    .then(result => {console.log({key:key,result:result,default:defaultValue,isPresent:result!==undefined,returned:result!==undefined ? result.value : defaultValue}); return result!==undefined ? result.value : defaultValue});
}

export function getTimeranges(activeOnly = false){
  if(activeOnly){
    // TODO : sélection avec critères
  }else {
    return getDatabase()
      .then(db => getAll(db, 'range'))
  }
}
