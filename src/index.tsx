import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import logo from './assets/PikPng.com_rick-and-morty-logo_1058513.png';

import './index.css';
import SearchComponent from './components/Search';
import ResultsComponent from './components/Result';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh', flexGrow: 1 }}
      >
        <Link to="/">
          <img src={logo} alt="Back to Homepage" className="logo" />
        </Link>
        <Switch>
          <Route path="/" component={SearchComponent} exact />
          <Route path="/search-results" component={ResultsComponent} />
        </Switch>
      </Grid>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);