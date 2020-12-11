import { createContext } from 'react';
import moment from 'moment';

export default class Cache {
  static getDefaultPortcode(): string {
    return localStorage.getItem('defaultPortfolio') as string;
  }

  static dumpPortfolio(portcode: string) {
    localStorage.setItem('defaultPortfolio', portcode);
  }
}

export const PortfolioContext = createContext({
  portCode: 'SA5001',
  setPortCode: (portcode: string) => {},
});

// 日期上下文管理器，用于管理日期状态
export const AnalysisTabContext = createContext({
  date: moment(new Date()),
  setDate: (date: moment.Moment) => {},
});

// 回测日期上下文管理器，用于管理日期状态
export const BacktestContext = createContext({
  date: moment(new Date()),
  setDate: (date: moment.Moment) => {},
});
