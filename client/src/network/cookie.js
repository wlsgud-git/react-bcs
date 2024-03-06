export class Cookies {
  constructor() {}

  set_cookie(name, value, unixTime) {
    var date = new Date();
    date.setTime(date.getTime() + unixTime);
    document.cookie =
      encodeURIComponent(name) +
      "=" +
      encodeURIComponent(value) +
      ";expires=" +
      date.toUTCString() +
      ";path=/";
  }

  //쿠키 값 가져오는 함수
  get_cookie(name) {
    var value = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    return value ? value[2] : null;
  }

  //쿠키 삭제하는 함수
  delete_cookie(name) {
    document.cookie =
      encodeURIComponent(name) + "=; expires=Thu, 01 JAN 1999 00:00:10 GMT";
  }
}
