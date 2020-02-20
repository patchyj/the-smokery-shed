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
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  errors: {}
};

const setNullFields = (state: any) => ({
  ...state,
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false
});

export default function(state = initialState, action: any) {
  switch (action.type) {
    case LOGIN_STARTED:
    case REGISTER_STARTED:
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        errors: {}
      };
    case LOGIN_FAILED:
      localStorage.removeItem('token');
      return {
        ...setNullFields(state),
        errors: { login: action.errors }
      };
    case REGISTER_FAILED:
      localStorage.removeItem('token');
      return {
        ...setNullFields(state),
        errors: { register: action.errors }
      };
    case AUTH_ERROR:
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...setNullFields(state),
        errors: action.errors
      };
    default:
      return state;
  }
}
