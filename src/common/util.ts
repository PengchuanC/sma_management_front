import numeral from 'numeral';

numeral.nullFormat('-');
numeral.zeroFormat('-');

export function numeralNum(num: number) {
  if (Math.abs(num) <= 2) {
    return numeral(num).format('0.0000');
  }
  return numeral(num).format('0,0.00');
}
