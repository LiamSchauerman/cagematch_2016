import React, { Component } from 'react';
import classNames from 'classNames';
import styles from '../styles/main.scss';
import CageEntry from './CageEntry';

class Cage extends Component {
  render() {
    const {cageEntries} = this.props;
    return (
      <div className="cage">
        <div className="cageEntriesWrapper">
          {cageEntries.map((entry, idx) => {
            return (
              <CageEntry
                key={idx}
                data={entry}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Cage;