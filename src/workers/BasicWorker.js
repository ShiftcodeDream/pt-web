import dayjs from 'dayjs';

const LAST_FETCH_KEY = 'lastFetch';
onmessage = (e) => {
  // ignores all other messages
  if(e.data.do) {
    console.log({ workerReception: e.data });
    postMessage({ resp: e.data, last: LAST_FETCH_KEY, today: dayjs().toISOString() });
  }
}
