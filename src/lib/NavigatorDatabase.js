/*
Fonctions génériques pour utiliser les fonctions Indexed Database des navigateurs web
à l'aide de promesses
*/

/**
 * Opens an indexed database
 *
 * @param DatabaseName
 * @param DatabaseVersion
 * @param onUpgradeNeeded Called if database has to be created / updated when version changes
 * @returns {Promise<unknown>}
 */
export function openIndexedDatabase(DatabaseName, DatabaseVersion, onUpgradeNeeded = (e)=>{}){
  return new Promise((success,reject) => {
    let dbReq = indexedDB.open(DatabaseName, DatabaseVersion);
    dbReq.onupgradeneeded = onUpgradeNeeded;
    dbReq.onsuccess = e => success(e.target.result);
    dbReq.onerror = e => reject('error opening indexed database ' + e.target.errorCode);
  });
}

/**
 * Insère l'objet data dans le magasin d'objet ObjectStore de la base Database
 * @param Database Connexion à la Database
 * @param ObjectStore String nom du objectstore
 * @param data object contenant les données
 * @returns {Promise<unknown>}
 */
export function insertData(Database, ObjectStore, data){
  return new Promise((success, reject) => {
    let tx = Database.transaction([ObjectStore], 'readwrite');
    let store = tx.objectStore(ObjectStore);
    tx.oncomplete = success;
    tx.onerror = reject;
    store.add(data);
  });
}

/**
 * Effectue une mise à jour ou création si l'objet n'existe pas
 *
 * @param Database Base de données
 * @param StoreName Nom du magasin d'objets
 * @param data données sous forme d'objet
 */
export function putValue(Database, StoreName, data){
  return new Promise((success, fail) => {
    let requete = Database
      .transaction([StoreName], 'readwrite')
      .objectStore(StoreName)
      .put(data);
    requete.onsuccess = (event) => success(event.target.result);
    requete.onerror = fail;
  });
}

/**
 * Récupère un objet par la clé définie par un index
 *
 * @param Database Base de données
 * @param StoreName Nom du magasin d'objets (équivalent de la table)
 * @param IndexName Nom de l'index permettant de retrouver l'objet
 * @param key clé de l'index
 * @returns {Promise<unknown>}
 */
export function getValue(Database, StoreName, IndexName, key){
  return new Promise((success, fail) => {
    let requete = Database
      .transaction([StoreName], "readonly")
      .objectStore(StoreName)
      .index(IndexName)
      .get(key);
    requete.onsuccess = (event) => success(event.target.result);
    requete.onerror = fail;
  });
}
