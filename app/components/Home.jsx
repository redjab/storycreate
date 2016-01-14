import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
  render() {
    return (
    	<div>
        <div className='front-banner'>
          <div className='container'>
            <div>
              <p className='banner-text'>
                <span className='banner-span banner-span-main'>Interactive story writing made simple</span>
                <br/>
                <span className='banner-span'>Write. Share your choose-your-own-adventure stories</span>
              </p>
              <Link className='btn btn-primary pull-left' to='/learn'>Learn More >>></Link>
            </div>

            <div className='btn-group-vertical pull-right'>
              <Link className='btn btn-primary banner-button-first' to='/new'>Create Story</Link>
              <Link className='btn btn-primary banner-button' to='/yours'>Your Stories</Link>
              <Link className='btn btn-primary banner-button' to='/tutorial'>Getting Started</Link>
            </div>
          </div>
        </div>
        <div className='container main-content'>
          <h1>What is StoryCreate?</h1>
          <p>
            StoryCreate helps you make interactive stories with choices and branching with minimal effort, so you can focus on the most important part: <strong>writing</strong>
          </p>
          <img className='front-img' src="../../img/placeholder.png"></img>
          <img className='front-img' src="../../img/placeholder.png"></img>
          <h1>Featured Stories</h1>
          <p>Stories created by our users</p>
        </div>
      </div>
    );
  }
}

export default Home;
