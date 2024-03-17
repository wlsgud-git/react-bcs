export function displayTime(time) {
  let minute = Math.floor(time / 60);
  let second = time % 60;

  minute = minute < 10 ? `0${minute}` : `${minute}`;
  second = second < 10 ? `0${second}` : `${second}`;

  return `${minute}:${second}`;
}
