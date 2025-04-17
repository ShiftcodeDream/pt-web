import dayjs from 'dayjs';

/**
 * Returns string with first letter upper cased
 *
 * @param texte : texte à modifier
 */
export function firstUpperCase(texte){
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/**
 * Returns a dayjs now with hours and minutes set by parameter
 * @param time : time with a hh:mm or hh:mm:ss format
 */
export function timeToDayjs(time){
  let t = time.split(':');
  if(t.length === 2)
    t.push(0);
  return dayjs().hour(t[0]).minute(t[1]).second(t[2]);
}
