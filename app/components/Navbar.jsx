import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("test");
    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findCharacter({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
    }
  }

  render() {
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='container'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <Link to='/' className='navbar-brand'>
              StoryCreate
            </Link>
          </div>
          <div id='navbar' className='navbar-collapse collapse'>
            <ul className='nav navbar-nav'>
              <li><Link to='/tutorial'>Getting Started</Link></li>
              <li><Link to='/read'>Read</Link></li>
              <li className='dropdown'>
                <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Write <span className='caret'></span></a>
                <ul className='dropdown-menu'>
                  <li><Link to='/new'>Create Story</Link></li>
                  <li><Link to='/yours'>Your Stories</Link></li>
                </ul>
              </li>
            </ul>
            <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='form-group'>
              <div className='input-group'>
                <input type='text' className='form-control search-input' placeholder='Search' value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
                <span className='input-group-btn'>
                  <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
                </span>
              </div>
            </div>
            </form>
            <ul className='nav navbar-nav navbar-right'>
              <li><Link to='/register'>Register</Link></li>
              <li><Link to='/login'>Login</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
