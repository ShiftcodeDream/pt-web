import './App.css';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import Horaires from './Horaires';
import About from './About';
import Preferences from './Preferences';

function App() {
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
