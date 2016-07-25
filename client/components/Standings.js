import React, { Component } from 'react';
import classNames from 'classNames';
import styles from '../styles/main.scss';

class Standings extends Component {
  render() {
    const {idMap, movies} = this.props;
    const sortedByScore = movies.sort((id1, id2) => {
      return idMap[id2].score - idMap[id1].score;
    });
    return (
      <div className={styles.standingsWrapper}>
        {sortedByScore.map(id => {
          return (
            <div className={styles.standingsEntry}>
              {Math.floor(idMap[id].score)} - {idMap[id].title}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Standings;