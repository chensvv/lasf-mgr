export function toThousands (num) {
  // eslint-disable-next-line no-redeclare
  // eslint-disable-next-line one-var
  var num = (num || 0).toString(),
  result = ''
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result;
}
