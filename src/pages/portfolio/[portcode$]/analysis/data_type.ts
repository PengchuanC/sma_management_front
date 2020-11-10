
// 基金组合业绩表现
interface performanceType {
  acc_return_yield: {p: number, b: number},
  annualized_return_yield: {p: number, b: number},
  daily_change: {
    p: {mean: number, max: number, min: number, win_ratio: number},
    b: {mean: number, max: number, min: number, win_ratio: number}
  },
  trading_day_count: {
    p: {win: number, lose: number, draw: number},
    b: {win: number, lose: number, draw: number}
  },
  annualized_volatility: {
    p: {vol: number, downside_vol: number},
    b: {vol: number, downside_vol: number}
  },
  max_drawback: {
    p: {start: string, end: string, drawback: number},
    b: {start: string, end: string, drawback: number}
  },
  sharpe_ratio: {
    p: number,
    b: number
  },
  calmar_ratio: {
    p: number,
    b: number
  },
  sortino_ratio: {
    p: number,
    b: number
  },
  var: {
    p: number,
    b: number
  },
  cvar: {
    p: number,
    b: number
  }
}


// 基金组合收益贡献
interface contributeType {
  total_profit: number,
  equity: number,
  bond: number,
  alter: number,
  money: number,
}
