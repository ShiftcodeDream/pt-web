import {openIndexedDatabase} from './lib/PromisedIndexedDb';

export const DATABASE_NAME="PontTournant";
export const DATABASE_VERSION = 1;
export function updateDatabaseSchema(e){
  const db = e.target.result;
  // Préférences cle/valeur
  db.createObjectStore('prefs', { keyPath: "key"});
  // Horaires des manoeuvres
  db.createObjectStore('tide', { keyPath: "t" });
  // Plage de temps d'alerte (définies dans les préférences)
  db.createObjectStore('range', { keyPath: "id", autoIncrement : true});
}

export default function getDatabase(){
  return openIndexedDatabase(DATABASE_NAME, DATABASE_VERSION, updateDatabaseSchema);
}