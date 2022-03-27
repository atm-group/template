import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, matchPath } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routeConfig';
import './gobal.less';
import north from '../config/north.config';
import { North } from '@zblock/north';

north.init({
  sentry: {
    integrations: [
      new North.BrowserTracing({
        routingInstrumentation: North.Sentry.reactRouterV4Instrumentation(history, routes as any, matchPath),
      }),
    ],
  }
});

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {renderRoutes(routes)}
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
)