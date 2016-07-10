import React, { Component } from 'react';
import Header from './Header';
import Cage from './Cage';
import styles from '../styles/main.scss';
//import movies from '../data';

class Main extends Component {
  constructor() {
    super();
    console.log('IN CONSTRUCTOR');
    console.log(this);
    this.state = {
      movies: [],
      cageEntries: []
    };
  }

  /**
   * return two movies from list
   */
  getEntries() {
    if (!this.state.movies || !this.state.movies.length) {
      return [];
    }
    let rand1, rand2;
    rand1 = Math.floor(Math.random() * this.state.movies.length);
    rand2 = Math.floor(Math.random() * this.state.movies.length);

    while (rand2 === rand1) {
      rand2 = Math.floor(Math.random() * this.state.movies.length);
    }

    return [this.state.movies[rand1], this.state.movies[rand2]];
  }

  newMatchup() {
    const cageEntries = this.getEntries();
    this.setState({
      cageEntries
    })
  };

  voteBoth() {
    console.log('vote both');
  }

  voteNeither() {
    console.log('vote neither');
  }

  componentDidMount() {
    fetch('movies')
      .then((response) => {
        console.log('fetch cb');
        return response.json();
      })
      .then((movies) => {
        console.log('fetch cb json');
        console.log(movies);
        this.setState({
          movies,
        });
        return Promise.resolve();
      })
      .then(() => {
        const cageEntries = this.getEntries();
        console.log(cageEntries);
        this.setState({
          cageEntries
        });
        return Promise.resolve();
      })
  }

  render() {
    const {cageEntries} = this.state;

    if (!this.state.movies || !this.state.movies.length || !cageEntries || cageEntries[0] === undefined) {
      return <div className="loading">Preparing the cage...</div>
    }
    return (
      <div className="app">
        <Header />
        <Cage
          voteBoth={this.voteBoth}
          voteNeither={this.voteNeither}
          cageEntries={cageEntries}
        />
        <button onClick={() => {this.newMatchup()}}>CLICK IT</button>
      </div>
    );
  }
}

export default Main;
