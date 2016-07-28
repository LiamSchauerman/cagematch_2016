import React, { Component } from 'react';
import styles from '../styles/main.scss';
import classnames from 'classnames';

export function ScoreDiff() {
  const cls = classnames('score', {
    positive: score > 0,
    negative: score < 0,
  });
  console.log('render score diff');
  if (!this.props.children) {
    return null;
  }
  const score = parseInt(this.props.children);
  return (
    <div className={cls}>
      ${(score > 0 ? '+' : '-') + score}
    </div>
  );
}

export default ScoreDiff;