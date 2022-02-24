import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routeConfig';
import './gobal.less';


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {renderRoutes(routes)}
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)