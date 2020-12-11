import numeral from 'numeral';
import { message } from 'antd';

numeral.nullFormat('-');
numeral.zeroFormat('-');

export function numeralNum(num: number) {
  if (Math.abs(num) <= 2) {
    return numeral(num).format('0.0000');
  }
  return numeral(num).format('0,0.00');
}

export function formatPercent(num: number) {
  if (Math.abs(num) < 0.00001) {
    return '-';
  }
  return numeral(num).format('0.00%');
}

export function formatNav(num: number) {
  return numeral(num).format('0,000.0000');
}

export const warning = () => {
  message.warning('当前日期小于组合创建日期，数据将不会刷新');
};
