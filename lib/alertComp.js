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
    return '<div class="timerange">' +
      '<div class="head">' +
        '<input type="checkbox" ' + (this.active?'checked ':'') + 'id="chk-' + this.id + '" />' +
        '<label for="chk-' + this.id + '">Notification activée</label>' +
      '</div><div>' +
        '<label for="from-"' + this.id + '">Plage horaire : </label>' +
        '<input type="time" id="from-' + this.id + '" value="' + this.from.format('HH:mm') + '" step="300"/>' +
        '<label for="to-"' + this.id + '"> - </label>' +
        '<input type="time" id="to-' + this.id + '" value="' + this.to.format('HH:mm') + '" step="300"/>' +
      '</div><div><label>Jours de la semaine :</label></div><div class="flex-around jours-semaine">' +
        semaine.map((j, ind) =>
          '<div id="jour-' + this.id + '-' + ind + '"' + (this.days[ind] ? ' class="selected"':'') + '>' + j + '</div>'
        ).join('') +
      '</div>' +
      '<div>' +
        '<input type="text" id="descr-' + this.id + '" maxlength="50" class="w-100 description" placeholder="Description" ' +
        'value="' + this.description + '" style="text-align: left" />' +
      '</div>' +
      '</div>';
  }
}
