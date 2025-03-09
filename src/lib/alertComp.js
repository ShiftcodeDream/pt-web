class AlertComp{
  constructor(id, onChange=()=>{}, onDelete=()=>{}){
    this.id = id;
    this.active = true;
    this.from = dayjs();
    this.to = dayjs();
    this.days = new Array(7).fill(false);
    let jourSemaine = (dayjs().day()+6)%7; // du lundi au dimanche
    this.days[jourSemaine] = true;
    this.description = "";
    this.onChange = onChange;
    this.onDelete = onDelete;
  }
  render(){
    const semaine = "LMMJVSD".split('');
    const id = this.id;
    return '<div class="timerange">' +
      '<div class="head">' +
        '<div><input type="checkbox" ' + (this.active?'checked ':'') + 'id="act-' + id + '" onchange="onActiveChanged(' + id + ')"/>' +
        '<label for="chk-' + id + '">Notification activée</label></div>' +
        '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></div>' +
      '</div><div>' +
        '<label for="from-"' + id + '">Plage horaire : </label>' +
        '<input type="time" id="from-' + id + '" value="' + this.from.format('HH:mm') + '" step="300"/>' +
        '<label> - </label>' +
        '<input type="time" id="to-' + id + '" value="' + this.to.format('HH:mm') + '" step="300"/>' +
      '</div><div><label>Jours de la semaine :</label></div><div class="flex-around jours-semaine">' +
        semaine.map((j, ind) =>
          '<div id="jour-' + id + '-' + ind + '"' + (this.days[ind] ? ' class="selected"':'') + '>' + j + '</div>'
        ).join('') +
      '</div>' +
      '<div>' +
        '<input type="text" id="descr-' + id + '" maxlength="50" class="w-100 description" placeholder="Description" ' +
        'value="' + this.description + '" style="text-align: left" />' +
      '</div>' +
      '</div>';
  }
}
function onActiveChanged(id){
  alertes[id].active = $("#act-" + id).is(':checked');
  console.log(alertes);
}
