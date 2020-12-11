// 回测结果数据类型
interface backtestType {
  [key: string]: any;
  key: number;
  date: string;
  cash: number;
  fix: number;
  equal: number;
  increase: number;
  equity: number;
  zz800: number;
  zcf: number;
}

interface backtestPerfType {
  [key: string]: any;
  key: number;
  index: string;
  acc_return_yield: number;
  annualized_return_yield: number;
  vol: number;
  downside_vol: number;
  max_drawback: number;
  sharpe_ratio: number;
  calmar_ratio: number;
  sortino_ratio: number;
  var: number;
  cvar: number;
}

interface portfolioNameType {
  [key: string]: any;
  cash: string;
  fix: string;
  equal: string;
  increase: string;
  equity: string;
  zz800: string;
  zcf: string;
}

// 指数权重
// date	equity_bound_limit	target_risk	sharpe	hs300	zcf	qyz	hb	zz500	hj	zz	hs	equity	bond	alter	cash
interface weightType {
  date: string;
  equity_bound_limit: number;
  target_risk: number;
  hs300: number;
  zcf: number;
  qyz: number;
  hb: number;
  zz500: number;
  hj: number;
  zz: number;
  hs: number;
  equity: number;
  bond: number;
  alter: number;
  cash: number;
}
