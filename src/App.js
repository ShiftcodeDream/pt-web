import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import dayjs from 'dayjs';

import './App.css';
import Horaires from './components/Horaires';
import About from './components/About';
import Preferences from './components/Preferences';
import {setConfigValue} from './lib/storage';

require('dayjs/locale/fr');

function App() {
  dayjs.locale('fr');
  console.log("create worker");
  const BasicWorker = new Worker(new URL("./workers/BasicWorker.js", import.meta.url), {type:'module'});
  BasicWorker.onmessage = e => console.log(e.data);

  function sendMessage(force){
    console.log("sending");
    BasicWorker.postMessage({do:true, force});
  }

  return (
    <>
      <button onClick={()=>sendMessage(false)}>Send Message</button>
      <button onClick={()=>sendMessage(true)}>Force update</button>
      <button onClick={()=>setConfigValue('lastFetch', dayjs().add(-6,'hour').toISOString())}>Outdate last update</button>
    <Tabs>
      <TabList>
        <Tab>Horaires</Tab>
        <Tab>A propos</Tab>
        <Tab>Préférences</Tab>
      </TabList>

      <TabPanel><Horaires /></TabPanel>
      <TabPanel><About /></TabPanel>
      <TabPanel><Preferences /></TabPanel>
    </Tabs>
      </>
  );
}

export default App;
