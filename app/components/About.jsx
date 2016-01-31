import React from 'react';
import { Link } from 'react-router';

class About extends React.Component {
  handleSubmit(event) {
    	event.preventDefault();
	}

	render() {
		return (
			<div className='main-content container'>
				<h1>About</h1>
				<p>StoryCreate was created by Minh Do in 2016 as his Capstone project. He enjoys video games, books, and writing when he is not busy talking about himself in third person.</p>
			</div>
		)
	}
}

export default About;