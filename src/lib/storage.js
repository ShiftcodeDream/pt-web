import dayjs from 'dayjs';
import getDatabase from '../schema';
import {deleteByKey, getAll, getValue, putValue} from './PromisedIndexedDb';

/**
 * Enregistre les marées
 * @param tides Tableau d'objets DayJs représentant les horaires des manoeuvres potentielles du pont
 * @returns {Promise<Awaited<unknown>[]>}
 */
export function storeTides(tides) {
  return getDatabase()
    .then(db => {
      return Promise.all(tides.map(t =>
        putValue(db, 'tide', { t: t.toISOString() })
      ))
    });
}

/**
 * Supprime un horaire de marées
 * @param tide
 * @returns {Promise<*>}
 */
export function deleteTide(tide){
  // console.log({todelete: tide, iso:tide.t})
  return getDatabase()
    .then(db => deleteByKey(db, 'tide', tide.t.toISOString() ));
}
/**
 * Retourne tous les horaires de manoeuvre potentiels enregistrés dans la database
 * sous la forme d'un tableau d'objets Dayjs
 * @returns {*}
 */
export function getTides(){
  return getDatabase()
    .then(db => getAll(db, 'tide'))
    .then(tides => tides.map(d => ({t: dayjs(d.t), notifSent:d.notifSent === true})));
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
    .then(result => result!==undefined ? result.value : defaultValue);
}

export function getTimeranges(activeOnly = false){
  const req = getDatabase()
    .then(db => getAll(db, 'range'));
  return activeOnly
    ? req.then(r => r.filter(t => t.active===true))
    : req;
}

/**
 * Ajoute ou modifie une tranche horaire en fonction de son id
 * @param range
 * @returns {Promise<unknown>}
 */
export function putRange(range){
  return getDatabase()
    .then(db => putValue(db, 'range', range));
}

/**
 * Supprime une tranche horaire par son identifiant
 * @param id
 * @returns {Promise<unknown>}
 */
export function deleteRange(id){
  return getDatabase()
    .then(db => deleteByKey(db, 'range', id));
}
