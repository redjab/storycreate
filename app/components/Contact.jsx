import React from 'react';
import { Link } from 'react-router';

class Contact extends React.Component {
  handleSubmit(event) {
    	event.preventDefault();
	}

	render() {
		return (
			<div className='main-content container'>
				<h1>Contact Us</h1>
				<p>We can be reached at <strong>The Restaurant at the end of the universe</strong>, feel free to contact us any time.</p>
			</div>
		)
	}
}

export default Contact;