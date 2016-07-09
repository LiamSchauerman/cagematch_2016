import React, { Component } from 'react';
import Header from './Header';
import Cage from './Cage';
import styles from '../styles/main.scss';
import movies from '../data';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      movies
    }
  }

  /**
   * return two movies from list
   */
  getEntries() {
    return [this.state.movies[10], this.state.movies[12]];
  }

  render() {

    const cageEntries = this.getEntries();

    return (
      <div className="app">
        <Header />
        <Cage
          cageEntries={cageEntries}
        />
      </div>
    );
  }
}

export default Main;
