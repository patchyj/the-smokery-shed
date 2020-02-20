import React from 'react';
import { Switch, Route, useRouteMatch, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthForm, { EAuthType } from './AuthForm';

import { login, register } from '../../flux/actions/authActions';

export interface IAuthFormComponentProps {
  type: EAuthType;
  history?: any;
}

function genHandles(type: EAuthType) {
  switch (type) {
    case EAuthType.LOGIN:
      return {
        func: login,
        authType: 'login'
      };
    case EAuthType.REGISTER:
      return {
        func: register,
        authType: 'register'
      };
    default:
      return {
        func: () => {},
        authType: ''
      };
  }
}

const Form = ({ type, history }: IAuthFormComponentProps) => {
  const dispatch = useDispatch();
  const { authType, func } = genHandles(type);

  const { authErrors } = useSelector((state: any) => ({
    authErrors: (state.auth.errors && state.auth.errors[authType]) || {}
  }));

  return <AuthForm type={type} handleSubmit={body => dispatch(func(body, history))} errors={authErrors} />;
};

const NotFound = () => {
  return (
    <div className="ui container">
      <h3>Not Found</h3>
    </div>
  );
};

const AuthContainer = (props: any) => {
  const { path } = useRouteMatch();

  return (
    <div style={{ padding: '3rem 0' }}>
      <Switch>
        <Route exact path={`${path}/login`} component={() => <Form {...props} type={EAuthType.LOGIN} />} />
        <Route exact path={`${path}/register`} component={() => <Form {...props} type={EAuthType.REGISTER} />} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default withRouter(AuthContainer);
