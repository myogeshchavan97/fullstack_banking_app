import { useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { initiateLogout } from '../actions/auth';

const Logout = (props) => {
  const propsRef = useRef(false);
  const processOnMount = useCallback(() => {
    if (propsRef.current === false) {
      const { history, dispatch } = props;
      dispatch(initiateLogout()).then(() => history.push('/'));
      propsRef.current = true;
    }
  }, [props]);

  useEffect(() => {
    processOnMount();
  }, [processOnMount]);

  return null;
};

export default connect()(Logout);
