import React, { Component } from 'react';
import classNames from 'classNames';
import styles from '../styles/main.scss';
import wutang from 'wutang';

class NewsItem extends Component {
  render() {
    const rand = Math.floor(Math.random()*20) + 15;
    return (
      <div className="newsItem">
        <div className="newsContent">{wutang(rand)}</div>
      </div>
    );
  }
}
/**
 * right side menu, lists NewsItems
 */
class NewsWrapper extends Component {
  render() {
    return (
      <div className="newsWrapper">
        <NewsItem />
        <NewsItem />
        <NewsItem />
        <NewsItem />
      </div>
    );
  }
}

export default NewsWrapper;