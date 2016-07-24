import React, { Component } from 'react';
import Header from './Header';
import Cage from './Cage';
import styles from '../styles/main.scss';
//import movies from '../data';

class Main extends Component {
  constructor() {
    super();
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

  getEloRating(a, b) {
    const K = 32;

    // adjusted rating
    const r1 = Math.pow(10, (a / 400));
    const r2 = Math.pow(10, (b / 400));

    // expected score
    const e1 = r1 / (r1 + r2);
    const e2 = r2 / (r1 + r2);

    // new score if 'a' wins
    const r1NewA = a + K * (1 - e1); // winner, a
    const r2NewA = b + K * (0 - e2); // loser, b

    // new score if 'b' wins
    const r2NewB = b + K * (1 - e2); // winner, b
    const r1NewB = a + K * (0 - e1); // loser, a

    return {
      a: {
        win: r1NewA,
        lose: r1NewB,
      },
      b: {
        win: r2NewB,
        lose: r2NewA
      }
    }
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

    console.log(this.getEloRating(2400, 2000));
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
