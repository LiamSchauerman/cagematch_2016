import React, { Component } from 'react';
import classnames from 'classnames';
import styles from '../styles/main.scss';

class CageEntry extends Component {
  constructor(){
    super();
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.state = {hover: false};
  }
  onMouseOver() {
    this.setState({hover: true})
  }

  onMouseOut() {
    this.setState({hover: false})
  }

  render() {
    const {data, onClick} = this.props;
    const {hover} = this.state;
    if (!data || !data.imgUrl) {
      return <div> error loading entry </div>
    }
    const imgSrc = encodeURIComponent(data.imgUrl);
    const cls = classnames('cageEntry', {hover});
    return (
      <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={onClick} className={cls}>
        <div className="title">{data.title}</div>
        <img className="image" src={`/image/${imgSrc}`}/>
      </div>
    );
  }
}

export default CageEntry;
