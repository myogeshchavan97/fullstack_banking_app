import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { initiateUpdateProfile } from '../actions/profile';
import { validateFields } from '../utils/common';
import { resetErrors } from '../actions/errors';

class Profile extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    email: '',
    errorMsg: '',
    isSubmitted: false
  };

  componentDidMount() {
    const { profile } = this.props;
    if (!_.isEmpty(profile)) {
      const { first_name, last_name, email } = profile;
      this.setState({
        first_name,
        last_name,
        email
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.errors, this.props.errors)) {
      this.setState({
        errorMsg: this.props.errors
      });
    }
    if (!_.isEqual(prevProps.profile, this.props.profile)) {
      const { first_name, last_name, email } = this.props.profile;
      this.setState({ first_name, last_name, email });
    }
  }

  componentWillUnmount() {
    this.props.dispatch(resetErrors());
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { first_name, last_name } = this.state;
    const profileData = {
      first_name,
      last_name
    };

    const fieldsToValidate = [{ first_name }, { last_name }];

    const allFieldsEntered = validateFields(fieldsToValidate);
    if (!allFieldsEntered) {
      this.setState({
        errorMsg: {
          update_error: 'Please enter all the fields.'
        }
      });
    } else {
      this.setState({ isSubmitted: true, errorMsg: '' });
      this.props.dispatch(initiateUpdateProfile(profileData));
    }
  };

  handleOnChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { errorMsg, first_name, last_name, email, isSubmitted } = this.state;
    return (
      <div className="col-md-6 offset-md-3">
        <Form onSubmit={this.handleSubmit} className="profile-form">
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
            <span className="label-value">{email}</span>
          </Form.Group>
          <Form.Group controlId="first_name">
            <Form.Label>First name:</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              placeholder="Enter your first name"
              value={first_name}
              onChange={this.handleOnChange}
            />
          </Form.Group>
          <Form.Group controlId="last_name">
            <Form.Label>Last name:</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              placeholder="Enter your last name"
              value={last_name}
              onChange={this.handleOnChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps)(Profile);
