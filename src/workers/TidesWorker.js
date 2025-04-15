import dayjs from 'dayjs';
import {getConfigValue, setConfigValue} from '../lib/storage';
const LAST_FETCH_KEY = 'lastFetch';

const TidesWorker = {
  onmessage: async event => {
    console.log({ received: event.data });
    let lastFetch = await getConfigValue(LAST_FETCH_KEY).then(n => dayjs(n));
    const now = dayjs();
    if (event.data.force || lastFetch.isBefore(now.add(-4, 'hours'))) {
      lastFetch = now;
      setConfigValue(LAST_FETCH_KEY, lastFetch.toISOString());
    }
    postMessage({ lastFetch });
  }
}
export default TidesWorker;
