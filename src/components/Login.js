import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { initiateLogin } from '../actions/auth';
import { resetErrors } from '../actions/errors';
import { validateFields } from '../utils/common';
import { Link } from 'react-router-dom';

const Login = (props) => {
  const [state, setState] = useState({
    email: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const processOnMount = useCallback(() => {
    return () => props.dispatch(resetErrors());
  }, [props]);

  useEffect(() => {
    processOnMount();
  }, [processOnMount]);

  useEffect(() => {
    setErrorMsg(props.errors);
  }, [props, props.errors]);

  const handleLogin = (event) => {
    event.preventDefault();
    const { email, password } = state;
    const fieldsToValidate = [{ email }, { password }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({
        signin_error: 'Please enter all the fields.'
      });
    } else {
      setErrorMsg({
        signin_error: ''
      });
      // login successful
      props.dispatch(initiateLogin(email, password));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value
    });
  };

  return (
    <div className="login-page">
      <h1>Banking Application</h1>
      <div className="login-form">
        <Form onSubmit={handleLogin}>
          {errorMsg && errorMsg.signin_error && (
            <p className="errorMsg centered-message">{errorMsg.signin_error}</p>
          )}
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="action-items">
            <Button variant="primary" type="submit">
              Login
            </Button>
            <Link to="/register" className="btn btn-secondary">
              Create account
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  errors: state.errors
});

export default connect(mapStateToProps)(Login);
