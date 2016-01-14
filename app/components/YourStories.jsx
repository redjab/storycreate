import React from 'react';
import { Link } from 'react-router';

var stories = [
	{
		id: 1,
		title: "Spice and Wolf",
		description: "A travelling merchant meets a wolf-deity",
		lastupdated: "2016-01-01",
		passagesCount: 10,
	},
	{
		id: 2,
		title: "Save the date!",
		description: "It’s a perfectly normal evening, and you have a quiet dinner planned with one of your friends",
		lastupdated: "2016-01-01",
		passagesCount: 20,
	}
];

class YourStories extends React.Component {
	constructor (props){
		super(props);
	}

	populateStories (data){
		var storyList = [];
	    for (let dataChild of data) {
	      var title = <h4><Link to={'/edit/'+dataChild.id}>{dataChild.title}</Link></h4>

	      var buttonEdit = <Link className='btn btn-default' to={'/edit/'+dataChild.id}>Edit</Link>
	      var buttonDelete = <Link className='btn btn-danger' to={'/delete/'+dataChild.id}>Delete</Link>
	      var buttonGroup = <div className='btn-group pull-right'>{buttonEdit}{buttonDelete}</div>

	      var description = <p className='no-bottom-margin'>{dataChild.description}</p>
	      var lastEdited = <p className='under-text'>last edited: {dataChild.lastupdated} | {dataChild.passagesCount} passages</p>

	      var story = <div key={dataChild.id}>
	      						{title}
	      						{buttonGroup}
	      						{description}
	      						{lastEdited}
	      						<hr/>
						</div>;
	      storyList.push(story);
	    }
	    return storyList;
	}

	render (){
		return (
			<div className='main-content container'>
				<h1>Your Stories</h1>
				<p>Sort by: <strong>Name</strong> | Edit Date | Passages Count</p>
				{this.populateStories(stories)}
			</div>
		)
	}
}

export default YourStories;
