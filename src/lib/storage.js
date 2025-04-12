import dayjs from 'dayjs';
import getDatabase from '../schema';
import {getValue, putValue} from './NavigatorDatabase';

export function storeTides(tides){
  localStorage.setItem('tides',
    JSON.stringify(tides.map(t => t.format("YYYY-MM-DD HH:mm")))
  );
}

export function getTides(){
  return JSON.parse(localStorage.getItem('tides'))
    .map(d => dayjs(d, "YYYY-MM-DD HH:mm"));
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
    .then(db => getValue(db, 'prefs','prefs_key', key))
    .then(result => result ? result.value : defaultValue);
}
