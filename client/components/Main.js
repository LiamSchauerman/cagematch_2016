import React, { Component } from 'react';
import Header from './Header';
import Cage from './Cage';
import styles from '../styles/main.scss';
import movies from '../data';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      movies: movies.filter(movie => movie.imgUrl !== undefined)
    }
  }

  /**
   * return two movies from list
   */
  getEntries() {
    let rand1, rand2;
    rand1 = Math.floor(Math.random() * this.state.movies.length);
    rand2 = Math.floor(Math.random() * this.state.movies.length);
    while (rand2 === rand1) {
      rand2 = Math.floor(Math.random() * this.state.movies.length);
    }

    return [this.state.movies[rand1], this.state.movies[rand2]];
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
