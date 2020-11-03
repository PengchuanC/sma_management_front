import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Allocate from '../pages/allocate/index';
import PortfolioList from '../pages/portfolio/list';

function BasicRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={PortfolioList} />
        <Route path='/allocate' component={Allocate} />
        <Route path='/portfolio' component={PortfolioList} />
      </Switch>
    </Router>
  );
}

export default BasicRouter;
