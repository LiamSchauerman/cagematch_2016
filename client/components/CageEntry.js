import React, { Component } from 'react';
import classNames from 'classNames';
import styles from '../styles/main.scss';

class CageEntry extends Component {
  render() {
    const {data} = this.props;
    return (
      <div className="cageEntry">
        <div className="title">{data.title}</div>
        <img className="image" src={data.imgUrl}/>
      </div>
    );
  }
}

export default CageEntry;