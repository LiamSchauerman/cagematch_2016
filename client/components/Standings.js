import React, { Component } from 'react';
//import classNames from 'classNames';
import style from '../styles/main.scss';

class Standings extends Component {
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
          return (
            <div key={id} className="standingsEntry">
              #{idx + 1} - {idMap[id].title} - {Math.floor(idMap[id].score)}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Standings;