import {useEffect, useState} from 'react';
import getDatabase from '../schema';
import {getConfigValue, getTides, setConfigValue, storeTides} from '../lib/storage';
import {mockupTides} from '../lib/tides';
import dayjs from 'dayjs';

/**
 * Composant à afficher pour voir le résultat des tests
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Tests(){
  const [resultat, setResultat] = useState([]);

  async function runTests(){
    let result = [], retour;
    // Test 1 : accès à la base de données
    let db = await (getDatabase().catch(e => console.error(e)));
    assert(db, "get Database");
    assert(db && db.objectStoreNames.contains('prefs'), "prefs store available");

    // Test 2 : enregistrement et restitution d'une valeur dans le gestionnaire de configuration
    await setConfigValue('aaa', "trois").catch(e => console.error(e));
    retour = await getConfigValue('aaa').catch(e => console.error(e));
    assert(retour === "trois", "valeur de retour 1");

    // Test 3 : essai d'enregistrement d'un objet dans le gestionnaire de configuration
    await setConfigValue('bbb', JSON.stringify({un:1, deux: 'deux'})).catch(e => console.error(e));
    retour = await getConfigValue('bbb').catch(e => console.error(e));
    info("Retour=" + retour);
    retour = JSON.parse(retour);
    assert(retour.un === 1 && retour.deux === "deux", "valeur de retour 2");

    // Test 4 : demande une valeur de paramètre qui n'existe pas
    retour = await getConfigValue('nexistepas');
    assert(retour === null, "Recherche de valeur inexistante");

    // Test 5 : demande une valeur de paramètre qui n'existe pas, avec valeur par défaut
    retour = await getConfigValue('nexistepas', 'valeurParDefaut');
    assert(retour === 'valeurParDefaut', "Recherche de valeur inexistante avec valeur par défaut");

    mockupTides()
      .then(storeTides)
      .then(() => getTides())
      .then(t => console.log({tides:t, format:t.map(y => y.format("DD/MM/YYYY HH:mm")) }))
    ;

    setResultat(result);

    function assert(condition, texte) {
      result.push({statut : condition?"OK":"KO", nom:texte});
    }
    function info(texte){
      result.push({statut:'INFO', nom:texte});
    }
  }

  return (<>
    <h1>Horaires</h1>
    <input type="button" onClick={runTests} value="tests" />
    <pre>
      {resultat.map((t,i) =>
        <p style={{color: t.statut==='OK' ? '#2da823' : t.statut==='INFO' ? '#4891fa' : '#dd46ad'}} key={i}>
          {t.statut} - {t.nom}
        </p>
      )}
    </pre>
  </>)
}

function mockupTides(){
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