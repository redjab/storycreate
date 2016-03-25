import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import GettingStarted from './components/GettingStarted';
import ReadList from './components/ReadList';
import YourStories from './components/YourStories';
import LearnMore from './components/LearnMore';
import Register from './components/Register';
import Login from './components/Login';
import About from './components/About';
import Contact from './components/Contact';
import Write from './components/Write';
import Read from './components/Read';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='about' component={About} />
    <Route path='contact' component={Contact} />
    <Route path='register' component={Register} />
    <Route path='login' component={Login} />
    <Route path='learn' component={LearnMore} />
    <Route path='tutorial' component={GettingStarted} />
    <Route path='readList' component={ReadList} />
    <Route path='yours' component={YourStories} />
    <Route path='write' component={Write} />
    <Route path='read/:isPreview/:story' component={Read} />
  </Route>
);
