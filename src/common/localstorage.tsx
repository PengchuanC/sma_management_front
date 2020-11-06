import { createContext } from 'react';

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
