import React, { Component } from 'react';
import classNames from 'classNames';
import styles from '../../styles/main.scss';

class Header extends Component {
  render() {
    console.log(styles);
    console.log(styles.header);
    return (
      <div className="header">
        3MD - Medical Printing Services
      </div>
    );
  }
}

export default Header;