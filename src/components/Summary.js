import React from 'react';
import { connect } from 'react-redux';

class Summary extends React.Component {
  render() {
    return (
      <div>
        <p>Summary Page</p>
      </div>
    );
  }
}

export default connect()(Summary);
