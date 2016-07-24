import React, { Component } from 'react';
import Header from './Header';
import Cage from './Cage';
import styles from '../styles/main.scss';
import * as utils from '../utils/tools';

class Main extends Component {
  constructor() {
    super();
    this.submitMatchup = this.submitMatchup.bind(this);

    /**
     * movies - array of imdbId's
     * entries - holds imdbId of active movie
     * idMap - imdbId : movieData
     * @type {{movies: Array, entries: {left: null, right: null}, idMap: {}}}
     */
    this.state = {
      movies: [],
      entries: {
        left: null,
        right: null,
      },
      idMap: {}
    }
  }

  /**
   * return two movies from list
   */
  getEntries() {
    if (!this.state.movies || !this.state.movies.length) {
      return [];
    }
    const indices = utils.getTwoRandomIndices(this.state.movies.length);
    return [this.state.movies[indices[0]], this.state.movies[indices[1]]];
  }

  newMatchup() {
    // array of two imdbId's
    const newEntries = this.getEntries();
    this.setState({
      entries: {
        left: newEntries[0],
        right: newEntries[1],
      },
    })
  };

  voteBoth() {
    console.log('vote both');
    return;
  }

  voteNeither() {
    console.log('vote neither');
    return;
  }

  submitMatchup(matchup) {
   /* matchup === {
      winner: {
        imdbId,
        oldScore,
        newScore
      },
      loser: {
        imdbId,
        oldScore,
        newScore
      }
    }
    */
  }

  clickTitle(id) {
    // id is the winner (left or right)
    // build matchup object
    const {idMap, entries} = this.state;

    //todo - refactor this. very messy
    let winningSide, losingSide;
    winningSide = entries.left.id === id ? 'left' : 'right';
    losingSide = winningSide === 'left' ? 'right' : 'left';

    //const loser = entries.filter(entry => entry !== id);
    const matchup = {
      winner: {
        imdbId: id,
        oldScore: idMap[entries[winningSide].id].score,
        newScore: winnerNewScore,
      },
      loser: {
        imdbId: idMap[entries[losingSide]].id,
        oldScore: idMap[entries[losingSide].id].score,
        newScore: loserNewScore,
      }
    };
    this.submitMatchup(matchup);
  }

  componentDidMount() {
    fetch('movies')
      .then((response) => {
        return response.json();
      })
      .then((moviesRaw) => {
        // from movies array, create idMap obj and an array of ids
        const ids = [];
        const idMap = {};
        moviesRaw.forEach(movie => {
          ids.push(movie.imdbId);
          idMap[movie.imdbId] = movie;
        });
        this.setState({
          movies: ids,
          idMap
        });
        return Promise.resolve();
      })
      .then(() => {
        this.newMatchup();
        return Promise.resolve();
      })
      .catch(error => {
        console.log('error in fetch');
        console.log(error);
      })
  }

  render() {
    const {entries, idMap} = this.state;

    console.log(utils.getEloRating(2400, 2000));
    if (!this.state.movies || !this.state.movies.length || !entries) {
      return <div className="loading">Preparing the cage...</div>
    }
    return (
      <div className="app">
        <Header />
        <Cage
          voteBoth={this.voteBoth}
          voteNeither={this.voteNeither}
          left={idMap[entries.left]}
          right={idMap[entries.right]}
        />
        <button onClick={() => {this.newMatchup()}}>CLICK IT</button>
      </div>
    );
  }
}

export default Main;
