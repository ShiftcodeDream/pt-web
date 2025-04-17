import dayjs from 'dayjs';
import getDatabase from '../schema';
import {deleteByKey, getAll, getAllKeys, getValue, putValue} from './PromisedIndexedDb';

/**
 * Enregistre les marées, sauf si elle est déjà présente pour ne pas modifier son statut "notifSent"
 * @param tides Tableau d'objets DayJs représentant les horaires des manoeuvres potentielles du pont
 * @returns {Promise<Awaited<unknown>[]>}
 */
export function storeTides(tides) {
  let db;
  return getDatabase()
    .then(d => db = d)
    .then(() => getAllKeys(db, 'tide'))
    .then(existingKeys => Promise.all(
      tides
        .map(t => t.toISOString())
        .filter(t => ! existingKeys.includes(t))
        .map(t => putValue(db, 'tide', {
          t,
          notifSent: false
        }))
    ));
}

/**
 * Supprime un horaire de marées
 * @param tide
 * @returns {Promise<*>}
 */
export function deleteTide(tide){
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
    .then(tides => tides.map(d => ({
      t: dayjs(d.t),
      notifSent: d.notifSent})
    ));
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

/**
 * Permet d'indiquer qu'un horaire de manoeuvre a été fait
 * l'objet d'une notification
 *
 * @param tide l'horaire de manoeuvre en question
 * @returns {Promise<unknown>}
 */
export function setTideNotified(tide){
  console.log({done:tide});
  return getDatabase()
    .then(db => putValue(db, 'tide', {
      t: tide.t.toISOString(),
      notifSent: true
    }));
}
