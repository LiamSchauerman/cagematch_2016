import React, { Component } from 'react';
import classNames from 'classNames';
import styles from '../styles/main.scss';

/**
 * the left side of the page. primary content
 */
class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className="gifPlaceholder" />
        <div className="aboutPlaceholder" />
      </div>
    );
  }
}

export default Home;