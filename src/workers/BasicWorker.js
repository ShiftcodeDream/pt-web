import dayjs from 'dayjs';
import {getConfigValue, setConfigValue} from '../lib/storage';

const LAST_FETCH_KEY = 'lastFetch';
onmessage = async e => {
  // ignores all other messages
  if(e.data.do) {
    let now = dayjs();
    let last = await getConfigValue(LAST_FETCH_KEY).then(d => dayjs(d));
    let updated = e.data.force || !last.isValid() || last.isBefore(now.add(-4, 'hour'));
    if(updated){
      last = now;
      setConfigValue(LAST_FETCH_KEY, now.toISOString());
    }
    postMessage({ updated, last });
  }
}
