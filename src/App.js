import {useEffect, useState} from 'react';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import dayjs from 'dayjs';

import './App.css';
import Horaires from './components/Horaires';
import About from './components/About';
import Preferences from './components/Preferences';

require('dayjs/locale/fr');

function App() {
  dayjs.locale('fr');
  const [refreshNeeded, setRefreshNeeded] = useState(1);

  const TidesWorker = new Worker(new URL("./workers/TidesWorker.js", import.meta.url), {type:'module'});
  const NotificationsWorker = new Worker(new URL("./workers/NotificationsWorker.js", import.meta.url), {type:'module'});

  useEffect(() => {
    // When TidesWorker succeeded to download tides, ask Horaires component to refresh
    TidesWorker.onmessage = e => {
      if(e.data && e.data.success)
        setRefreshNeeded(n=>n+1);
    }
    // On page load, force tides download, then asks for refresh (if needed) every 15 minutes
    TidesWorker.postMessage({do:true, force:true});
    setInterval(() => TidesWorker.postMessage({do:true, force:false}), 15*60*1000);
    // Launches NotificationsWorker
    NotificationsWorker.postMessage({start:true});
    // eslint-disable-next-line
  }, []);

  return (
    <Tabs focusTabOnClick={false}>
      <TabList>
        <Tab>Horaires</Tab>
        <Tab>A propos</Tab>
        <Tab>Préférences</Tab>
      </TabList>

      <TabPanel><Horaires pleaseRefresh={refreshNeeded}/></TabPanel>
      <TabPanel><About /></TabPanel>
      <TabPanel><Preferences notifWorker={NotificationsWorker}/></TabPanel>
    </Tabs>
  );
}

export default App;
