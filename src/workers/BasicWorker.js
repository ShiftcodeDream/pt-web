
const LAST_FETCH_KEY = 'lastFetch';
onmessage = (e) => {
  console.log({ workerReception: e.data });
  postMessage({ resp: e.data, last: LAST_FETCH_KEY });
}
