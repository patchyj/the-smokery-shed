import React, { useState } from 'react';
import { IAuthFunction } from '../../types/interfaces';

export interface ITextInputProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange(e: any): void;
  type?: string;
  classNames?: string;
  error?: string;
  required?: boolean;
}

export interface IAuthUserProps {
  name?: string;
  email: string;
  password: string;
  password2: string;
}

export interface IAuthFormProps {
  type: EAuthType;
  handleSubmit(user: any): void;
  errors: any;
}

export enum EAuthType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}

export const TextInput = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = 'text',
  classNames,
  error,
  required
}: ITextInputProps) => (
  <div className={`field ${classNames} ${error ? 'error' : ''}`}>
    <label>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    {error && <small className="ui error">{error}</small>}
  </div>
);

export default ({ type, handleSubmit, errors = {} }: IAuthFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleNameChange = (e: any) => setName(e.target.value);
  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => setPassword(e.target.value);
  const handlePassword2Change = (e: any) => setPassword2(e.target.value);

  const handleOnSubmit = (e: any) => {
    const user: IAuthFunction = { email, password };
    if (EAuthType.REGISTER) {
      user.name = name;
      user.password2 = password2;
    }

    handleSubmit(user);
  };

  return (
    <div className="ui centered grid">
      <div className="ten wide column">
        {type === EAuthType.REGISTER ? <h3>Register</h3> : type === EAuthType.LOGIN ? <h3>Login</h3> : ''}
        <div className="ui large form">
          {type === EAuthType.REGISTER && (
            <TextInput
              label="Name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
              classNames="eight wide column"
              error={errors.name}
              required
            />
          )}
          <TextInput
            label="Email"
            name="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            classNames="eight wide column"
            error={errors.email}
            required
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            classNames="eight wide column"
            error={errors.password || errors.noMatch}
            required
          />
          {type === EAuthType.REGISTER && (
            <TextInput
              label="Password Confirmation"
              name="password2"
              type="password"
              placeholder="Password Confirmation"
              value={password2}
              onChange={handlePassword2Change}
              classNames="eight wide column"
              error={errors.password2 || errors.noMatch}
              required
            />
          )}
          <button className="ui button" type="submit" onClick={handleOnSubmit}>
            {type === EAuthType.REGISTER ? <h3>Sign Up</h3> : type === EAuthType.LOGIN ? <h3>Login</h3> : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
