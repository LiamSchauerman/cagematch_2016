import React, { Component } from 'react';
import Header from './Header';
import Cage from './Cage';
import styles from '../styles/main.scss';
import * as utils from '../utils/tools';

class Main extends Component {
  constructor() {
    super();
    this.submitMatchup = this.submitMatchup.bind(this);
    this.clickTitle = this.clickTitle.bind(this);

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
    const {idMap} = this.state;
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
    /* {
     "loserScorePost": 1188,
     "winnerScorePost": 1212,
     "loserScorePre": 1200,
     "winnerScorePre": 1200,
     "loser": "Sharknado 3: Oh Hell No!",
     "winner": "A Message from Step Brothers' Adam Scott",
     "actorId": "nm1171860",
     } */

    const winnerCurr = idMap[matchup.winner.imdbId];
    const loserCurr = idMap[matchup.loser.imdbId];

    const formattedMatchup = {
      loser: loserCurr.title,
      loserScorePost: matchup.loser.newScore,
      loserScorePre: loserCurr.score,
      winner: winnerCurr.title,
      winnerScorePre: winnerCurr.score,
      winnerScorePost: matchup.winner.newScore,
      actorId: winnerCurr.actorId,
    };
    console.log('sending matchup');
    console.log(formattedMatchup);
    fetch("/matchup", {
      method: "POST",
      body: JSON.stringify(formattedMatchup),
    })
    .then(response => {
      // done
      console.log('matchup post success');
      console.log(response);
    })
    .catch(err => {
      console.log('matchup post ERROR');
      console.log(err);
    })
  }

  clickTitle(winningSide) {
    // id is the winner (left or right)
    // build matchup object
    const {idMap, entries} = this.state;
    const losingSide = winningSide === 'left' ? 'right' : 'left';
    //todo - refactor this. very messy

    const winnerCurrent = idMap[entries[winningSide]];
    const loserCurrent = idMap[entries[losingSide]];
    // get scores from elo
    console.log(utils.getEloRating(winnerCurrent.score, loserCurrent.score));
    const elo = utils.getEloRating(winnerCurrent.score, loserCurrent.score);

    const winnerNewScore = elo.a.win;
    const loserNewScore = elo.b.lose;
    const matchup = {
      winner: {
        imdbId: winnerCurrent.imdbId,
        oldScore: winnerCurrent.score,
        newScore: winnerNewScore,
      },
      loser: {
        imdbId: loserCurrent.imdbId,
        oldScore: loserCurrent.score,
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

    if (!this.state.movies || !this.state.movies.length || !entries) {
      return <div className="loading">Preparing the cage...</div>
    }
    return (
      <div className="app">
        <Header />
        <Cage
          clickTitle={this.clickTitle}
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
