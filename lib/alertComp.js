class AlertComp{
  constructor(id, onChange=()=>{}, onDelete=()=>{}){
    this.id = id;
    this.active = true;
    this.from = dayjs();
    this.to = dayjs();
    this.days = new Array(7).fill(false);
    let jourSemaine = (dayjs().day()+6)%7; // du lundi au dimanche
    this.days[jourSemaine] = true;
    this.onChange = onChange;
    this.onDelete = onDelete;
  }
  render(){
    const semaine = "LMMJVSD".split('');
    return '<div class="timerange">' +
      '<div class="head">' +
        '<input type="checkbox" ' + (this.active?'checked ':'') + 'id="chk-' + this.id + '" />' +
        '<label for="chk-' + this.id + '">Notification activée</label>' +
      '</div><div class="flex-around">' +
        '<label for="from-"' + this.id + '">Entre</label>' +
        '<input type="time" id="from-' + this.id + '" value="' + this.from.format('HH:mm') + '" step="300"/>' +
        '<label for="to-"' + this.id + '">et</label>' +
        '<input type="time" id="to-' + this.id + '" value="' + this.to.format('HH:mm') + '" step="300"/>' +
      '</div><label>Jours de la semaine :</label><div class="flex-around jours-semaine">' +
        semaine.map((j, ind) =>
          '<div' + (this.days[ind] ? ' class="selected"':'') + '>' + j + '</div>'
        ).join('') +
      '</div>' +
      '</div>';
  }
}
