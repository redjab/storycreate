import React from 'react';
import { Link } from 'react-router';
import YourStoriesStore from '../stores/YourStoriesStore';
import YourStoriesActions from '../actions/YourStoriesActions';

class YourStories extends React.Component {
	constructor (props){
		super(props);
		this.state = YourStoriesStore.getState();
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount(){
		YourStoriesStore.listen(this.onChange);
		YourStoriesActions.getStories();
	}

	componentWillUnmount(){
		YourStoriesStore.unlisten(this.onChange);
	}

	onChange(state) {
		this.setState(state);
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
				{this.populateStories(this.state.stories)}
			</div>
		)
	}
}

export default YourStories;
