import React from 'react';
import { connect } from 'react-redux';
import { initiateLogout } from '../actions/auth';

class Logout extends React.Component {
  componentDidMount() {
    const { history, dispatch } = this.props;
    dispatch(initiateLogout()).then(() => history.push('/'));
  }

  render() {
    return null;
  }
}

export default connect()(Logout);
