import React, { Component } from 'react';
//import classNames from 'classNames';
import {ScoreDiff} from './ScoreDiff';
import style from '../styles/main.scss';

class Standings extends Component {
  componentWillReceiveProps(nextProps) {
      // compare scores of nextState for each movie in the top 10
      // loop over every id stored in movies
      // create hashmap
      // idmap will be udpated
      const self = this;
      if (!this.props.movies && !nextProps.movies) return;
      if (!nextProps.idMap) return;

      nextProps.movies.forEach(id => {
        if (!self.props.idMap[id]) return;
        if (self.props.idMap[id].score !== nextProps.idMap[id].score && nextProps.idMap[id]) {
          nextProps.idMap[id].diff = nextProps.idMap[id].score - self.props.idMap[id].score;
        }
      });
  }

  render() {
    const {idMap, movies} = this.props;
    const sortedByScore = movies.sort((id1, id2) => {
      return idMap[id2].score - idMap[id1].score;
    }).slice(0,10);

    return (
      <div className="standingsWrapper">
        <div className="standingsHeader">
          Top 10
        </div>
        {sortedByScore.map((id, idx) => {
          let score;
          if (idMap[id].diff) {
            score = <ScoreDiff>{idMap[id].diff}</ScoreDiff>
          }

          return (
            <div key={id} className="standingsEntry">
              <ScoreDiff>10</ScoreDiff>
              <div>#{idx + 1} - {idMap[id].title} - {Math.floor(idMap[id].score)}</div>
              {score || null}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Standings;