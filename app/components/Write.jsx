import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import joint, { V } from 'jointjs';
import _ from 'lodash';
import PassageChoice from './PassageChoice';
import Constants from './Constants'

// Create a custom element.
// ------------------------

joint.shapes.html = {};
joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
    defaults: joint.util.deepSupplement({
        type: 'html.Element',
        attrs: {
            rect: { stroke: 'none', 'fill-opacity': 0 }
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

// Create a custom view for that element that displays an HTML div above it.
// -------------------------------------------------------------------------

joint.shapes.html.ElementView = joint.dia.ElementView.extend({

    template: [
        '<div class="html-element">',
        '<button class="delete">x</button>',
        '<label></label>',
        '<hr/>',
        '<p></p>',
        '</div>'
    ].join(''),

    initialize: function() {
        _.bindAll(this, 'updateBox');
        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        this.$box = $(_.template(this.template)());
        this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
        // Update the box position whenever the underlying model changes.
        this.model.on('change', this.updateBox, this);
        // Remove the box when the model gets removed from the graph.
        this.model.on('remove', this.removeBox, this);

        this.updateBox();
    },

    render: function() {
        joint.dia.ElementView.prototype.render.apply(this, arguments);
        this.paper.$el.prepend(this.$box);
        this.updateBox();
        return this;
    },
    updateBox: function() {
        // Set the position and dimension of the box so that it covers the JointJS element.
        var bbox = this.model.getBBox();
        // Example of updating the HTML with a data stored in the cell model.
        this.$box.find('label').text(this.model.get('label'));
        this.$box.find('p').text(this.model.get('text'));
        // this.$box.find('span').text(this.model.get('select'));
        this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
    },
    removeBox: function(evt) {
        this.$box.remove();
    }
});


//Custom choice shapes
joint.shapes.story = {};

joint.shapes.story.ToolElement = joint.shapes.devs.Model.extend({
    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="11"/>',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>'].join(''),

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',

    defaults: joint.util.deepSupplement({
        type: 'story.ToolElement',
    }, joint.shapes.devs.Model.prototype.defaults)

});

//custom view
joint.shapes.story.ToolElementView = joint.shapes.devs.ModelView.extend({

    initialize: function() {
        joint.shapes.devs.ModelView.prototype.initialize.apply(this, arguments);
    },

    render: function () {
        joint.shapes.devs.ModelView.prototype.render.apply(this, arguments);

        this.renderTools();
        this.update();

        return this;
    },

    renderTools: function () {

        var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
        if (toolMarkup) {
            var nodes = V(toolMarkup);
            V(this.el).append(nodes);
        }

        return this;
    }
    // pointerdown: function(evt, x, y) {
    //     this._dx = x;
    //     this._dy = y;
    //     this._action = '';

    //     var className = evt.target.parentNode.getAttribute('class');

    //     switch (className) {
    //         case 'element-tool-remove':
    //             this.model.remove();
    //             return;
    //             break;

    //         default:
    //     }
    //     joint.dia.CellView.prototype.pointerdown.apply(this, arguments);
    // }
});

var data = {
    "metadata":
    {
        "id": 1,
        "title": "Title",
        "author": "Author",
        "description": "A test story",
        "created": "01/26/2016",
        "updated": "01/26/2016",
        "options":
        {
            "allowSave": true,
            "publish": true
        }
    },
    "content":
    {
        "start": "uuid",
        "attribute":
        [
            {
                "name": "luck",
                "dataType": "int",
                "default": 0,
                "persistent": false,
            }
        ],
        "passages":
        [
            {
                "id": "uuid",
                "title": "untitled",
                "text": "This is a test passage",
                "choices":
                [
                    {
                        "id": "uuid",
                        "text": "Choice one",
                        "linkTo":
                        [
                            {
                                "id": "uuid",
                                "conditions": ["luck > 1", "luck > 2"],
                                "events": ["luck + 1", "luck + 2"]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
class Write extends React.Component {
  handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className='main-content container'>
                <Graph/>
            </div>
        )
    }
}

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph;
    }

    buildNewGraph(graph) {
        var PassageChoice1 = new PassageChoice(Constants.PASSAGE_FIRST_POSITION_X, Constants.PASSAGE_FIRST_POSITION_Y,
            Constants.PASSAGE_WIDTH, Constants.PASSAGE_HEIGHT,
            Constants.DEFAULT_TITLE, Constants.DEFAULT_PASSAGE_SHORTENED);

        graph.addCells([PassageChoice1.passage, PassageChoice1.choice]);

        //add new choice to storyData
        var newChoice = {
                            "id": PassageChoice1.choice.id,
                            "text": Constants.DEFAULT_CHOICE,
                            "linkTo": []
                        }
        this.addNewChoiceToStoryData(PassageChoice1.passage.id, newChoice);
        this.saveStoryLocal();
        return graph;
    }

    addNewChoiceToStoryData(passageId, newChoice){
        //add new choice to storyData
        var passage = _.find(this.storyData.content.passages, { 'id': passageId });
        if (passage.choices == undefined){
            passage.choices = [];
        }
        passage.choices.push(newChoice);
    }

    onAddPassage() {
        //save story data when adding a new passage
        this.graph.on('add', function(eventName, cell){
            if (eventName.get('type') === 'html.Element'){
                this.storyData.content.passages.push({
                    "id": eventName.id,
                    "title": Constants.DEFAULT_TITLE,
                    "text": Constants.DEFAULT_PASSAGE,
                    "choices": []
                });
                if (this.graph.getElements().length === 1){
                    this.storyData.content.start = eventName.id;
                }
            }

            //have to check which passage it belongs to somehow.
            if (eventName.get('type') === 'devs.Model'){
                // this.choicePassage.push()
            }

        }.bind(this));
    }

    onChangeLink() {
        this.graph.on('change:source change:target', function(link) {
            var source = link.get('source');
            var target = link.get('target');
            if (target.id && source.id){
                var passageId = link.getSourceElement().get('parent');
                var passage = _.find(this.storyData.content.passages, { 'id': passageId });
                var choice = _.find(passage.choices, { 'id' : source.id });
                if (choice) {
                    var newLinkTo = _.find(choice.linkTo, { 'id': target.id });
                    if (newLinkTo){
                        newLinkTo.id = target.id;
                    } else {
                        newLinkTo =
                        {
                            "id": target.id,
                            "conditions": [],
                            "events": []
                        }
                        choice.linkTo.push(newLinkTo);
                    }
                }
            localStorage.setItem(Constants.DEFAULT_STORY_DATA, JSON.stringify(this.storyData));
            }
        }.bind(this));
    }

    onRemovePassage(){
        //remove choice
        this.paper.on('cell:pointerdown', function(cellView, evt, x, y){
            if (evt.target.parentNode.getAttribute('class') === 'element-tool-remove'){
                //remove the choice from storyData
                var passageId = this.graph.getCell(cellView.model.id).get('parent');
                var passage = _.find(this.storyData.content.passages, { 'id': passageId });
                _.remove(passage.choices, function(n){
                    return n.id === cellView.model.id;
                });

                cellView.model.remove();
            }
        }.bind(this));

        //TODO: prevent deleting the starting passage or display warning
        this.graph.on('remove', function(eventName, cell){
            //remove the passage from storyData
            if (eventName.get('type') === 'html.Element'){
                _.remove(this.storyData.content.passages, function(n){
                    return n.id == eventName.id;
                });
            }
            //remove the linkTo from storyData
            if (eventName.isLink()){
                var passageId = this.graph.getCell(eventName.get('source').id).get('parent');
                var passage = _.find(this.storyData.content.passages, { 'id': passageId });
                var choice = _.find(passage.choices, { 'id' : eventName.get('source').id });
                var linkTo = _.remove(choice.linkTo, function(n){
                    return n.id == eventName.get('target').id;
                })
            }
        }.bind(this));
    }

    onDblClickPassage() {
        this.paper.on('cell:pointerdblclick', function(evt, x, y) {
            if (evt.model.attributes.type && evt.model.attributes.type === 'html.Element'){
                $('#passageModal').modal('show');
                $('.submit-passage').off('click');

                var passageData = _.find(this.storyData.content.passages, { 'id': evt.model.id });

                $('.title-input').val(passageData.title);
                $('.passage-input').val(passageData.text);

                $('.submit-passage').click(function(e){
                    //update visual
                    var title = $('.title-input').val();
                    var titleShortened = (title.length > Constants.MAX_CHAR_TITLE) ? title.substring(0, Constants.MAX_CHAR_TITLE) + '...' : title;
                    var passage = $('.passage-input').val();
                    var passageShortened = (passage.length > Constants.MAX_CHAR_PASSAGE) ? passage.substring(0, Constants.MAX_CHAR_PASSAGE) + '...' : passage;

                    evt.$box.find('label').text(titleShortened);
                    evt.$box.find('p').text(passageShortened);

                    //update graph
                    evt.model.attributes.label = titleShortened;
                    evt.model.attributes.text = passageShortened;

                    //update storyData
                    passageData.title = title;
                    passageData.text = passage;

                    this.saveToLocalStorage();

                    $('#passageModal').modal('hide');
                }.bind(this));
            }
        }.bind(this));
    }

    setupListeners() {
        this.onAddPassage();
        this.onChangeLink();
        this.onRemovePassage();
        this.onDblClickPassage();

        //save to localStorage on graph changes
        this.graph.on('batch:stop batch:start add remove', function(eventName, cell) {
            this.storyData.metadata.updated = Date.now().toString();
            this.saveToLocalStorage();
        }.bind(this));

    }

    saveToLocalStorage(){
        localStorage.setItem(Constants.DEFAULT_GRAPH, JSON.stringify(this.graph.toJSON()));
        localStorage.setItem(Constants.DEFAULT_STORY_DATA, JSON.stringify(this.storyData));
    }

    saveStoryLocal() {
        localStorage.setItem(Constants.DEFAULT_STORY_DATA, JSON.stringify(this.storyData));
    }

    saveGraphLocal(){
        localStorage.setItem(Constants.DEFAULT_GRAPH, JSON.stringify(this.graph.toJSON()));
    }

    saveGraphSizeLocal(){
        localStorage.setItem(Constants.DEFAULT_GRAPH + "Size", JSON.stringify(this.paper.getArea()));
    }

    componentDidMount() {
        this.storyData = JSON.parse(localStorage.getItem(Constants.DEFAULT_STORY_DATA)) || {
            "metadata":
            {
                "id": 1,
                "title": Constants.DEFAULT_STORY_NAME,
                "author": Constants.DEFAULT_AUTHOR,
                "created": Date.now(),
                "updated": Date.now(),
                "options":
                {
                    "allowSave": true,
                    "publish": true
                }
            },
            "content":
            {
                "attribute":[],
                "passages":[]
            }
        };
        this.paperDiv = $(ReactDOM.findDOMNode(this.refs.placeholder));
        var size = JSON.parse(localStorage.getItem(Constants.DEFAULT_GRAPH + "Size")) || {};
        var height = size.height;
        var width = size.width;
        this.paper = new joint.dia.Paper({
            el: this.paperDiv,
            width: width || $('.container').width(),
            model: this.graph,
            interactive: function(cellView) {
                //prevent choice box dragging
                if (cellView.model instanceof joint.shapes.devs.Model){
                    return false;
                }
                return true;
            },
            defaultLink: new joint.dia.Link({
                attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
                        '.marker-arrowhead-group-source': {
                            display: 'none'
                        },
                }
            }),
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                if (magnetS && magnetS.getAttribute('type') === 'input') return false;
                //Prevent linking from passage
                if (cellViewS && cellViewS.model.attr('innerType') && cellViewS.model.attr('innerType').typeText === 'input') return false;
                return (cellViewT &&  cellViewT.model.get('type') === 'html.Element');
            },
            validateMagnet: function(cellView, magnet) {
                // Note that this is the default behaviour. Just showing it here for reference.
                // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
                return magnet.getAttribute('magnet') !== 'passive';
            }
        }).bind(this);

        this.setupListeners();
        var graphJSON = JSON.parse(localStorage.getItem(Constants.DEFAULT_GRAPH));

        if (graphJSON != null){
            this.graph.fromJSON(graphJSON);
        } else this.graph = this.buildNewGraph(this.graph);


    }

    addPassage() {
        var allElements = this.graph.getElements();
        var lastCell = allElements[allElements.length-1];
        var x = Constants.PASSAGE_FIRST_POSITION_X;
        var y = Constants.PASSAGE_FIRST_POSITION_Y;

        if (lastCell != undefined){
            this.paper.findViewByModel(lastCell).unhighlight();

            x = lastCell.attributes.position.x + Constants.PASSAGE_TRANSLATE_X;
            y = lastCell.attributes.position.y;

        }
        var newPassage = new PassageChoice(x, y,
            Constants.PASSAGE_WIDTH, Constants.PASSAGE_HEIGHT,
            Constants.DEFAULT_TITLE, Constants.DEFAULT_PASSAGE_SHORTENED);

        this.graph.addCell(newPassage.passage);
        this.paper.findViewByModel(newPassage.passage).highlight();
        var paperDiv = this.paperDiv;
        x += Constants.PASSAGE_WIDTH * 2;
        y += Constants.PASSAGE_HEIGHT * 2;
        if (x > this.paper.getArea().width){
            this.paper.setDimensions(x, this.paper.getArea().height);
        }

        if (y > this.paper.getArea().height){
            this.paper.setDimensions(this.paper.getArea().width, y);
        }
        this.saveGraphSizeLocal();
    }

    render() {
        return (
            <div>
            <div className="modal" id="passageModal">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="myModalLabel">Edit Passage</h4>
                  </div>
                  <div className="modal-body">
                    <form className="form-horizontal" role="form">
                        <input type="text" className="form-control title-input" placeholder="Title"/>
                        <textarea name="passage" rows='5' className="form-control passage-input" data-modalfocus></textarea>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary submit-passage">Save changes</button>
                  </div>
                </div>
              </div>
            </div>

            <div className='paper-container'>
                <button type="button" className="btn btn-primary pull-right" onClick={this.addPassage.bind(this)}>Add Passage</button>
                <div id='paper' ref='placeholder'></div>
            </div>
            </div>
        );
    }
}

export default Write;