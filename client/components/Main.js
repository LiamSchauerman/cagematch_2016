import React, { Component } from 'react';
import Header from './Header'
import styles from '../styles/main.scss';

class Main extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div>Hello World</div>
      </div>
    );
  }
}

export default Main;
