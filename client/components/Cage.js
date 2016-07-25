import React, { Component } from 'react';
import classNames from 'classNames';
import styles from '../styles/main.scss';
import CageEntry from './CageEntry';

class Cage extends Component {
  render() {
    const {voteNeither, left, right, clickHandler} = this.props;
    if (!(left && right)) {
      return <div> loading a new matchup </div>
    }
    return (
      <div className="cage">
        <div className="cageEntriesWrapper">
          <CageEntry
            onClick={() => {clickHandler('left')}}
            data={left}
          />
          <CageEntry
            onClick={() => {clickHandler('right')}}
            data={right}
          />
        </div>
        <div className="buttonsWrapper">
          <button onClick={() => {
            voteNeither()}
            }>Neither!
          </button>
        </div>
      </div>
    );
  }
}

export default Cage;