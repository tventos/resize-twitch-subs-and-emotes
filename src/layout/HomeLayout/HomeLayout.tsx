import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Home } from '@src/pages/Home';

export class HomeLayout extends React.Component {
  public render() {
    return (
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    );
  }
}
