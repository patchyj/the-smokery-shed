import axios from 'axios';
import { clearErrors, returnErrors } from './errorActions';
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_STARTED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  REGISTER_STARTED,
  REGISTER_SUCCESS,
  REGISTER_FAILED
} from './types';
import { IAuthFunction, IConfigHeaders } from '../../types/interfaces';

const config: IConfigHeaders = {
  headers: {
    'Content-type': 'application/json'
  }
};

// Check token & load user
export const loadUser = () => async (dispatch: Function, getState: Function) => {
  // User loading
  dispatch({ type: USER_LOADING });

  try {
    const response = await axios.get('/api/auth/user', tokenConfig(getState));
    dispatch({ type: USER_LOADED, payload: response.data });
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status));
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = ({ name, email, password, password2 }: IAuthFunction, history: any) => async (
  dispatch: Function
) => {
  dispatch({ type: REGISTER_STARTED });
  // Request body
  const body = JSON.stringify({ name, email, password, password2 });

  try {
    const response = await axios.post('/api/auth/register', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data
    });
    dispatch(clearErrors());
    history.push('/');
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAILED'));
    dispatch({ type: REGISTER_FAILED, errors: err.response.data });
  }
};

// Login User
export const login = ({ email, password }: IAuthFunction, history: any) => async (dispatch: Function) => {
  dispatch({ type: LOGIN_STARTED });
  // Request body
  const body = JSON.stringify({ email, password });

  try {
    const response: any = await axios.post('/api/auth/login', body, config);
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    dispatch(clearErrors());
    history.push('/');
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAILED'));
    dispatch({ type: LOGIN_FAILED, errors: err.response.data });
  }
};

// Logout User
export const logout = () => ({ type: LOGOUT_SUCCESS });

// Setup config/headers and token
export const tokenConfig = (getState: Function) => {
  // Get token from localstorage
  const token = getState().auth.token;

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};
