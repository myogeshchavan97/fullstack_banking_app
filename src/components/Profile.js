import React, { useState, useEffect, useRef, useCallback } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { initiateUpdateProfile } from '../actions/profile';
import { validateFields } from '../utils/common';
import { resetErrors } from '../actions/errors';

const Profile = (props) => {
  const [state, setState] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const propsRef = useRef(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const processOnMount = useCallback(() => {
    const { profile } = props;
    if (!_.isEmpty(profile) && !propsRef.current) {
      const { first_name, last_name, email } = profile;
      setState({
        ...state,
        first_name,
        last_name,
        email
      });
      propsRef.current = true;
    }
    return () => {
      props.dispatch(resetErrors());
    };
  }, [props, state]);

  useEffect(() => {
    processOnMount();
  }, [processOnMount]);

  useEffect(() => {
    setState(props.profile);
  }, [props, props.profile]);

  useEffect(() => {
    setErrorMsg(props.errors);
  }, [props, props.errors]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { first_name, last_name } = state;
    const profileData = {
      first_name,
      last_name
    };

    const fieldsToValidate = [{ first_name }, { last_name }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      setErrorMsg({
        update_error: 'Please enter all the fields.'
      });
    } else {
      setIsSubmitted(true);
      setErrorMsg('');
      props.dispatch(initiateUpdateProfile(profileData));
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value
    });
  };

  return (
    <div className="col-md-6 offset-md-3">
      <Form onSubmit={handleSubmit} className="profile-form">
        {errorMsg && errorMsg.update_error ? (
          <p className="errorMsg centered-message">{errorMsg.update_error}</p>
        ) : (
          isSubmitted && (
            <p className="successMsg centered-message">
              Profile updated successfully.
            </p>
          )
        )}
        <Form.Group controlId="email">
          <Form.Label>Email address:</Form.Label>
          <span className="label-value">{state.email}</span>
        </Form.Group>
        <Form.Group controlId="first_name">
          <Form.Label>First name:</Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            placeholder="Enter your first name"
            value={state.first_name || ''}
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.Group controlId="last_name">
          <Form.Label>Last name:</Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            placeholder="Enter your last name"
            value={state.last_name || ''}
            onChange={handleOnChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps)(Profile);
