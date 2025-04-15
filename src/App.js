import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import dayjs from 'dayjs';

import './App.css';
import Horaires from './components/Horaires';
import About from './components/About';
import Preferences from './components/Preferences';

require('dayjs/locale/fr');

function App() {
  dayjs.locale('fr');
  console.log("create worker");
  const BasicWorker = new Worker(new URL("./workers/BasicWorker.js", import.meta.url), {type:'module'});
  BasicWorker.onmessage = e => console.log({appReception: e.data});

  function sendMessage(){
    console.log("sending");
    BasicWorker.postMessage({do:true});
  }

  return (
    <><button onClick={sendMessage}>Send Message</button>
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
