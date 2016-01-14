import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import GettingStarted from './components/GettingStarted';
import ReadList from './components/ReadList';
import YourStories from './components/YourStories';
import LearnMore from './components/LearnMore';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/learn' component={LearnMore} />
    <Route path='/tutorial' component={GettingStarted} />
    <Route path='/read' component={ReadList} />
    <Route path='/yours' component={YourStories} />
  </Route>
);
