function storeTides(tides){
  localStorage.setItem('tides',
    JSON.stringify(tides.map(t => t.format("YYYY-MM-DD HH:mm")))
  );
}

function getTides(){
  return JSON.parse(localStorage.getItem('tides'))
    .map(d => dayjs(d, "YYYY-MM-DD HH:mm"));
}
