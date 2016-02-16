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
// import joint from 'jointjs';

// //polyfill for Chrome
// SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
//     return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
// };

// // Create a custom element.
// // ------------------------

// joint.shapes.html = {};
// joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
//     defaults: joint.util.deepSupplement({
//         type: 'html.Element',
//         attrs: {
//             rect: { stroke: 'none', 'fill-opacity': 0 }
//         }
//     }, joint.shapes.basic.Rect.prototype.defaults)
// });

// // Create a custom view for that element that displays an HTML div above it.
// // -------------------------------------------------------------------------

// joint.shapes.html.ElementView = joint.dia.ElementView.extend({

//     template: [
//         '<div class="html-element">',
//         '<button class="delete">x</button>',
//         '<label></label>',
//         '<hr/>',
//         '<p></p>',
//         '</div>'
//     ].join(''),

//     initialize: function() {
//         _.bindAll(this, 'updateBox');
//         joint.dia.ElementView.prototype.initialize.apply(this, arguments);

//         this.$box = $(_.template(this.template)());
//         this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
//         // Update the box position whenever the underlying model changes.
//         this.model.on('change', this.updateBox, this);
//         // Remove the box when the model gets removed from the graph.
//         this.model.on('remove', this.removeBox, this);

//         this.updateBox();
//     },

//     render: function() {
//         joint.dia.ElementView.prototype.render.apply(this, arguments);
//         this.paper.$el.prepend(this.$box);
//         this.updateBox();
//         return this;
//     },
//     updateBox: function() {
//         // Set the position and dimension of the box so that it covers the JointJS element.
//         var bbox = this.model.getBBox();
//         // Example of updating the HTML with a data stored in the cell model.
//         this.$box.find('label').text(this.model.get('label'));
//         this.$box.find('p').text(this.model.get('text'));
//         // this.$box.find('span').text(this.model.get('select'));
//         this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
//     },
//     removeBox: function(evt) {
//         this.$box.remove();
//     }
// });

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/about' component={About} />
    <Route path='/contact' component={Contact} />
    <Route path='/register' component={Register} />
    <Route path='/login' component={Login} />
    <Route path='/learn' component={LearnMore} />
    <Route path='/tutorial' component={GettingStarted} />
    <Route path='/read' component={ReadList} />
    <Route path='/yours' component={YourStories} />
    <Route path='/write' component={Write} />
  </Route>
);
