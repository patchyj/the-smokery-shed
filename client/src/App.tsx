import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './flux/store';
import AppNavbar from './components/AppNavbar';
import { loadUser } from './flux/actions/authActions';
import AuthContainer from './components/auth/AuthContainer';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <AppNavbar />
        <Switch>
          <Route path={'/auth'} component={AuthContainer} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
