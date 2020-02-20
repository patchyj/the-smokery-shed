import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../flux/actions/authActions';

export default () => {
  const dispatch = useDispatch();
  return <span onClick={() => dispatch(logout())}>Logout</span>;
};
