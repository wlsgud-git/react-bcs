export class DateControl {
  constructor() {}

  CurrentDate() {
    let date = new Date();
    return date;
  }

  CurrentDateString() {
    return this.CurrentDate().toString();
  }

  SecondAdd(addSecond) {
    const date = this.CurrentDate();
    const re = date.setSeconds(date.getSeconds() + addSecond);
    return re;
  }

  MinuteAdd(addMinute) {
    const date = this.CurrentDate();
    const re = date.setMinutes(date.getMinutes() + addMinute);
    return re;
  }

  HourAdd(addHour) {
    const date = this.CurrentDate();
    const re = date.setHours(date.getHours() + addHour);
    return re;
  }
}
