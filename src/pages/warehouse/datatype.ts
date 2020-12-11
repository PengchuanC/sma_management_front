// 单只基金交易历史记录
interface fundTradeType {
  date: string;
  buy_amount: number;
  amount: number;
  fee: number;
}

// 调仓结果
interface changeResultType {
  key: number;
  secucode: string;
  secuname?: string;
  operate: string;
  amount: number;
  fee: number;
}
