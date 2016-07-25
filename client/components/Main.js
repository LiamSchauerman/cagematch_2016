import React, { Component } from 'react';
import Header from './Header';
import Cage from './Cage';
import Standings from './Standings';
import styles from '../styles/main.scss';
import * as utils from '../utils/tools';

class Main extends Component {
  constructor() {
    super();
    this.submitMatchup = this.submitMatchup.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.newMatchup = this.newMatchup.bind(this);
    this.voteBoth = this.voteBoth.bind(this);
    this.voteNeither = this.voteNeither.bind(this);

    /**
     * idMap - a map from imdbId to movieData
     * movies - array of imdbId's
     * entries - holds imdbId of active movie
     * removed - track imdbId's that have been removed
     * @type {{movies: Array, entries: {left: null, right: null}, idMap: {}}}
     */
    this.state = {
      idMap: {},
      movies: [],
      entries: {
        left: null,
        right: null,
      },
      removed: {},
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
    // get both id's from state, both + 200;
    // newmatchup
    //todo - insert into matchup table as new type: both
    //const {entries, idMap} = this.state;
    this.newMatchup();
  }

  voteNeither() {
    // remove these from list.

    this.newMatchup();
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
    fetch("/matchup", {
      method: "POST",
      body: JSON.stringify(formattedMatchup),
    })
    .then(response => {
      console.log('matchup post success');
      console.log(response);
    })
    .catch(err => {
      console.log('matchup post ERROR');
      console.log(err);
    })
  }

  clickHandler(winningSide) {
    // winningSide === 'left' or 'right'
    // build matchup object
    const {idMap, entries} = this.state;
    const losingSide = winningSide === 'left' ? 'right' : 'left';

    const winnerCurrent = idMap[entries[winningSide]];
    const loserCurrent = idMap[entries[losingSide]];

    // get scores from elo
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
    //todo - convert to promises, update state to loading: true until response
    this.submitMatchup(matchup);
    this.newMatchup();

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
    const {entries, idMap, movies} = this.state;

    if (!this.state.movies || !this.state.movies.length || !entries) {
      return <div className="loading">Preparing the cage...</div>
    }
    // voteBoth={this.voteBoth}

    return (
      <div className="app">
        <Header />
        <Cage
          clickHandler={this.clickHandler}
          voteNeither={this.voteNeither}
          left={idMap[entries.left]}
          right={idMap[entries.right]}
        />
        <Standings
          idMap={idMap}
          movies={movies}
        />
      </div>
    );
  }
}

export default Main;
