import React, { Component } from 'react';
import Header from './Header'
import Home from './Home';
import NewsWrapper from './NewsWrapper';
import styles from '../styles/main.scss';

class Main extends Component {
  render() {
    return (
      <div class="app">
        <Header />
        <div className="contentWrapper">
          <Home />
          <NewsWrapper />

        </div>
      </div>
    );
  }
}

export default Main;
