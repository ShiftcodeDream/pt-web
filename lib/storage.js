import dayjs from 'dayjs';

export function storeTides(tides){
  localStorage.setItem('tides',
    JSON.stringify(tides.map(t => t.format("YYYY-MM-DD HH:mm")))
  );
}

export function getTides(){
  return JSON.parse(localStorage.getItem('tides'))
    .map(d => dayjs(d, "YYYY-MM-DD HH:mm"));
}

export const setConfigValue = (key,value) => localStorage.setItem(key,value);
export const getConfigValue = key => localStorage.getItem(key);
