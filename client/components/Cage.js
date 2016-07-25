import React, { Component } from 'react';
import classNames from 'classNames';
import styles from '../styles/main.scss';
import CageEntry from './CageEntry';

class Cage extends Component {
  render() {
    const {voteBoth, voteNeither, left, right, clickTitle} = this.props;
    if (!(left && right)) {
      return <div> loading a new matchup </div>
    }
    return (
      <div className="cage">
        <div className="cageEntriesWrapper">
          <CageEntry
            onClick={() => {clickTitle('left')}}
            data={left}
          />
          <CageEntry
            onClick={() => {clickTitle('right')}}
            data={right}
          />
        </div>
        <div className="buttonsWrapper">
          <button onClick={() => {this.props.voteNeither()}}>Neither!</button>
          <button onClick={() => {this.props.voteBoth()}}>...both?</button>
        </div>
      </div>
    );
  }
}

export default Cage;