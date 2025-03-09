import './App.css';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import dayjs from 'dayjs';
import Horaires from './components/Horaires';
import About from './components/About';
import Preferences from './components/Preferences';

function App() {
  dayjs.locale('fr');

  return (
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
  );
}

export default App;
