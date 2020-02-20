import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Logout from './auth/Logout';
import { IAppNavbar, IAuthReduxProps } from '../types/interfaces';

const AppNavbar = ({ auth }: IAppNavbar) => {
  const authLinks = <Logout />;

  const guestLinks = (
    <Fragment>
      <Link to="/auth/login" className="item">
        Login
      </Link>
      <Link to="/auth/register" className="item">
        Register
      </Link>
    </Fragment>
  );

  return (
    <div className="ui menu">
      <div className="ui container">
        <div className="header item">Your Site name</div>
        <div className="right item">
          {auth && auth.isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAuthReduxProps) => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(AppNavbar);
