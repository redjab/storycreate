import React from 'react';
import {Link} from 'react-router';


var featured = [
  {
    id: 1,
    title: "Spice and Wolf",
    description: "A travelling merchant meets a wolf-deity"
  },
  {
    id: 2,
    title: "Save the date!",
    description: "It’s a perfectly normal evening, and you have a quiet dinner planned with one of your friends"
  }
]

var categories = [
  {
    id: 1,
    name: "Fantasy"
  },
  {
    id: 2,
    name: "Science Fiction"
  },
  {
    id: 3,
    name: "Thriller"
  },
  {
    id: 4,
    name: "Mystery"
  },
  {
    id: 5,
    name: "Horror"
  }
]

class ReadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featured: featured,
      toprated: featured,
      mostrecent: featured,
      categories: categories,
    }
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
    this.populateStoryList(this.state.featured);
    return (
        <div className='main-content container'>
          <h1>Read stories made with StoryCreate</h1>
          <Link to='read/browse'>Browse all stories</Link>
          <div className="row">
            <div className="col-md-6">
              <h2>Featured</h2>
              {this.populateStoryList(this.state.featured)}
            </div>
            <div className="col-md-6">
              <h2>Top Rated</h2>
              {this.populateStoryList(this.state.toprated)}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h2>Most Recent</h2>
              {this.populateStoryList(this.state.mostrecent)}
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
