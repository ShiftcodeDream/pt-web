import {useEffect, useState} from 'react';
import getDatabase from '../schema';
import {getConfigValue, getTides, setConfigValue, storeTides} from '../lib/storage';
import {mockupTides} from '../lib/tides';

export default function Horaires(){
  // TODO : Déplacer ailleurs une fois les tests terminés
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
