import React from 'react';
import {Link} from 'react-router';
import ReadListStore from '../stores/ReadListStore';
import ReadListActions from '../actions/ReadListActions';

class ReadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = ReadListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  componentDidMount(){
    ReadListStore.listen(this.onChange);
    ReadListActions.getStories();
    ReadListActions.getCategories();
  }

  componentWillUnmount(){
    ReadListStore.unlisten(this.onChange);
  }

  populateStoryList(data){
    var stories = [];
    for (let dataChild of data) {
      var link = "read/" + dataChild.id;
      var title = <Link to={link}>{dataChild.title}</Link>
      var description = <p>{dataChild.description}</p>
      var story = <div key={dataChild.id}>{title}{description}</div>;
      stories.push(story);
    }
    return stories;
  }

  populateCategories(data){
    var categories = [];
    for (let dataChild of data){
      categories.push(<li key={dataChild.id}><Link to={'category/'+dataChild.id}>{dataChild.name}</Link></li>)
    }
    return <ul>{categories}</ul>;
  }

  render() {
    return (
        <div className='main-content container'>
          <h1>Read stories made with StoryCreate</h1>
          <Link to='read/browse'>Browse all stories</Link>
          <div className="row">
            <div className="col-md-6">
              <h2>Featured</h2>
              {this.populateStoryList(this.state.stories)}
            </div>
            <div className="col-md-6">
              <h2>Top Rated</h2>
              {this.populateStoryList(this.state.stories)}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h2>Most Recent</h2>
              {this.populateStoryList(this.state.stories)}
            </div>
            <div className="col-md-6">
              <h2>Categories</h2>
              {this.populateCategories(this.state.categories)}
            </div>
          </div>
        </div>
    );
  }
}

export default ReadList;
