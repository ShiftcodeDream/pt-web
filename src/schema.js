import {openIndexedDatabase} from './lib/PromisedIndexedDb';

export const DATABASE_NAME="PontTournant";
export const DATABASE_VERSION = 1;
export function updateDatabaseSchema(e){
  const db = e.target.result;
  let store = db.createObjectStore('prefs', { keyPath: "key"});
  store.createIndex("prefs_key", "key", {unique:true});
  db.createObjectStore('tide', { keyPath: "id", autoIncrement : true});
}

export default function getDatabase(){
  return openIndexedDatabase(DATABASE_NAME, DATABASE_VERSION, updateDatabaseSchema);
}