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
 * @param StoreName String nom de l'objectstore
 * @param data object contenant les données
 * @returns {Promise<unknown>}
 */
export function insertData(Database, StoreName, data){
  return new Promise((success, fail) => {
    let requete = Database
      .transaction([StoreName], 'readwrite')
      .objectStore(StoreName)
      .insert(data);
    requete.onsuccess = (event) => success(event.target.result);
    requete.onerror = fail;
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
 * Récupère depuis un object store un objet défini par sa clé
 *
 * @param Database Base de données
 * @param StoreName Nom du magasin d'objets (équivalent de la table)
 * @param key clé de l'index
 * @returns {Promise<unknown>}
 */
export function getValue(Database, StoreName, key){
  return new Promise((success, fail) => {
    let requete = Database
      .transaction([StoreName], "readonly")
      .objectStore(StoreName)
      .get(key);
    requete.onsuccess = (event) => success(event.target.result);
    requete.onerror = fail;
  });
}
/**
 * Récupère depuis un index d'object store un objet par défini par sa clé
 *
 * @param Database Base de données
 * @param StoreName Nom du magasin d'objets (équivalent de la table)
 * @param IndexName Nom de l'index permettant de retrouver l'objet
 * @param key clé de l'index
 * @returns {Promise<unknown>}
 */
export function getIndexedValue(Database, StoreName, IndexName, key){
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

/**
 * Retire tous les éléments d'un object store. Renvoie la database en cas de succès
 * afin de pouvroi chaîner avec d'autrs actions
 * @param Database
 * @param StoreName
 * @returns {Promise<unknown>}
 */
export function clearObjectStore(Database, StoreName){
  return new Promise((success, fail) => {
    let requete = Database
      .transaction([StoreName], 'readwrite')
      .objectStore(StoreName)
      .clear();
    requete.onsuccess = () => success(Database);
    requete.onerror = fail;
  });
}

/**
 * Renvoie tous les objets enregistrés dans un datastore
 * @param Database
 * @param StoreName
 * @returns {Promise<unknown>}
 */
export function getAll(Database, StoreName){
  return new Promise((success, fail) => {
    let requete = Database
      .transaction([StoreName], 'readonly')
      .objectStore(StoreName)
      .getAll();
    requete.onsuccess = (event) => success(event.target.result);
    requete.onerror = fail;
  });

}