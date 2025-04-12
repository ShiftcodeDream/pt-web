import { render, screen } from '@testing-library/react';
import App from './App';
import {openIndexedDatabase} from './lib/NavigatorDatabase';
import getDatabase, {DATABASE_NAME, DATABASE_VERSION, updateDatabaseSchema} from './schema';
import {getConfigValue, setConfigValue} from './lib/storage';

// Permet d'avoir un objet window.indexedDB dans node.js, qui se comporte comme celui d'un navigateur web
require("fake-indexeddb/auto");

let db;
it('DB instantiate', () => {
  return openIndexedDatabase(DATABASE_NAME, DATABASE_VERSION, updateDatabaseSchema)
    .then(d => db = d)
    .catch(e => console.error(e))
    .finally(() => {
      expect(db).toBeDefined();
      expect(db.objectStoreNames.contains('prefs')).toBeTruthy();
    });
});

it('DB conection', () => expect(getDatabase()).resolves.toBeDefined())

let result;
it('DB preferences by key', () =>
{
  return setConfigValue('aaa', { un: 1, deux: 'deux' })
    .then(() => getConfigValue('aaa')
      .then(v => result = v)
      .finally(() => {
        expect(result).toBeDefined();
        expect(result).toHaveProperty('un', 1);
        expect(result).toHaveProperty('deux', 'deux');
      })
    )
});
