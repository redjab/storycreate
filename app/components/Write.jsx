import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import joint, { V } from 'jointjs';
import _ from 'lodash';
import PassageChoice, {Choice} from './PassageChoice';
import Constants from './Constants';
import Quill from 'quill'

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

joint.shapes.story.AddChoiceElement = joint.shapes.basic.Rect.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',
    defaults: joint.util.deepSupplement({
        type: 'story.AddChoiceElement',
        attrs: {
            rect: { fill: '#ffffff', rx: 0, ry: 0, 'stroke-width': 1, stroke: 'black', 'stroke-dasharray': '10,2' },
            text: {
                text: 'Add a choice',
                'font-size': 13, 'font-weight': 'normal'
            }
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.story.ToolElement = joint.shapes.devs.Model.extend({
    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="7"/>',
        '<path transform="scale(.5) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this element from the model</title>',
        '</g>',
        '</g>'].join(''),

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
    conditionsMarkup: '<g class="conditions"><rect class="condition-body"/><text class="condition-label"/></g>',
    eventsMarkup: '<g class="events"><rect class="event-body"/><text class="event-label"/></g>',

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

        this.renderEvents();
        this.renderConditions();
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
    },

    renderConditions: function () {

        var conditionsMarkup = this.model.conditionsMarkup || this.model.get('conditionsMarkup');
        if (conditionsMarkup) {
            var nodes = V(conditionsMarkup);
            V(this.el).append(nodes);
        }

        return this;
    },

    renderEvents: function () {

        var eventsMarkup = this.model.eventsMarkup || this.model.get('eventsMarkup');
        if (eventsMarkup) {
            var nodes = V(eventsMarkup);
            V(this.el).append(nodes);
        }

        return this;
    }
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
            Constants.DEFAULT_TITLE, Constants.DEFAULT_PASSAGE_SHORTENED, true);

        graph.addCells([PassageChoice1.passage, PassageChoice1.choice, PassageChoice1.addChoice]);

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

                var passageBox = this.graph.getCell(passageId);
                var isBelow = false;

                //move other choices up
                _.forEach(passageBox.getEmbeddedCells(), function(value, index) {
                    if (index == 0 || isBelow){
                        value.translate(0, Constants.CHOICE_HEIGHT*(-1));
                    }
                    if (value.id == cellView.model.id){
                        isBelow = true;
                    }
                });

                var passage = _.find(this.storyData.content.passages, { 'id': passageId });
                _.remove(passage.choices, function(n){
                    return n.id === cellView.model.id;
                });

                //remove the cell from graph
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

                //if undefined, meaning the whole choice has been removed, so no need to remove linkTo
                if (passageId){
                    var passage = _.find(this.storyData.content.passages, { 'id': passageId });

                    var choiceId = eventName.get('source').id;
                    var choice = _.find(passage.choices, { 'id' : choiceId });

                    var linkTo = _.remove(choice.linkTo, function(n){
                        return n.id == eventName.get('target').id;
                    })
                }
            }
        }.bind(this));
    }

    shortenContent(text, maxLength){
        return (text.length > maxLength) ? text.substring(0, maxLength) + '...' : text;
    }

    onClickAddChoice(){
        this.paper.on('cell:pointerdown', function(evt, x, y) {
            if (evt.model instanceof joint.shapes.story.AddChoiceElement){
                $('#choiceModal').modal('show');
                $('.submit-choice').off('click');
                $('.choice-input').val('');

                $('.submit-choice').click(function(e){


                    var choiceData = $('.choice-input').val();
                    var choiceShortened = this.shortenContent(choiceData, Constants.MAX_CHAR_CHOICE);


                    var passageBox = this.graph.getCell(evt.model.get('parent'));
                    var addChoiceBox = passageBox.getEmbeddedCells()[0];
                    var choiceY = addChoiceBox.get('position').y;
                    var childrenLength = passageBox.getEmbeddedCells().length;

                    var choiceBox = Choice(passageBox.get('position').x, choiceY, choiceShortened);
                    passageBox.embed(choiceBox);

                    this.graph.addCell(choiceBox);

                    var newChoice = {
                                        "id": choiceBox.id,
                                        "text": choiceData,
                                        "linkTo": []
                                    }
                    this.addNewChoiceToStoryData(evt.model.get('parent'), newChoice);
                    addChoiceBox.translate(0, Constants.CHOICE_HEIGHT);

                    $('#choiceModal').modal('hide');
                }.bind(this))

            }
        }.bind(this))
    }

    onDblClickChoice() {
        this.paper.on('cell:pointerdblclick', function(evt, x, y) {
            if (evt.model.get('type') === 'story.ToolElement'){
                $('#choiceModal').modal('show');
                $('.submit-choice').off('click');

                var passage = _.find(this.storyData.content.passages, {'id': evt.model.get('parent')});
                var choice = _.find(passage.choices, {'id': evt.model.id});

                $('.choice-input').val(choice.text);

                $('.submit-choice').click(function(e){
                    var choiceData = $('.choice-input').val();
                    var choiceShortened = this.shortenContent(choiceData, Constants.MAX_CHAR_CHOICE);

                    evt.model.attr('.label/text', choiceShortened);

                    choice.text = choiceData;
                    this.saveToLocalStorage();
                    $('#choiceModal').modal('hide');
                }.bind(this))
            }
        }.bind(this))
    }

    onDblClickPassage() {
        this.paper.on('cell:pointerdblclick', function(evt, x, y) {
            if (evt.model.attributes.type && evt.model.attributes.type === 'html.Element'){
                $('#passageModal').modal('show');
                $('.submit-passage').off('click');

                setTimeout(function (){
                    $('.ql-editor').focus();
                }, 1000);

                var passageData = _.find(this.storyData.content.passages, { 'id': evt.model.id });

                $('.title-input').val(passageData.title);
                this.passageEditor.setHTML(passageData.text);
                //$('.passage-input').val(passageData.text);

                $('.submit-passage').click(function(e){
                    //update visual
                    var title = $('.title-input').val();
                    var titleShortened = this.shortenContent(title, Constants.MAX_CHAR_TITLE);
                    //var passage = $('.passage-input').val();
                    var passage = this.passageEditor.getHTML();
                    var passageShortened = this.shortenContent(this.passageEditor.getText(), Constants.MAX_CHAR_PASSAGE);

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
        this.onDblClickChoice();
        this.onClickAddChoice();

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

    initializeQuill(){
          this.passageEditor = new Quill('#quill-passage', {
              modules: {
                'toolbar': { container: '#toolbar-passage' },
                'image-tooltip': true,
                'link-tooltip': true
              },
              theme: 'snow'
          });
    }

    componentDidMount() {
        this.initializeQuill();
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
                if (cellView.model instanceof joint.shapes.devs.Model || cellView.model instanceof joint.shapes.story.AddChoiceElement){
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

        newPassage.passage.embed(newPassage.addChoice);
        this.graph.addCell([newPassage.passage, newPassage.addChoice]);

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
                    </form>
                    <QuillEditor/>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary submit-passage">Save changes</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal" id="choiceModal">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="myModalLabel">Edit Choice</h4>
                  </div>
                  <div className="modal-body">
                    <form className="form-horizontal" role="form">
                        <textarea name="passage" rows='5' className="form-control choice-input" data-modalfocus></textarea>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary submit-choice">Save changes</button>
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

class QuillEditor extends React.Component {
    render() {
        return (
            <div className="quill-wrapper">
            <div id="toolbar-passage" className="toolbar">
                <span className="ql-format-group">
                    <span title="Bold" className="ql-format-button ql-bold"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Italic" className="ql-format-button ql-italic"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Underline" className="ql-format-button ql-underline"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Strikethrough" className="ql-format-button ql-strike"></span>
                </span>
                <span className="ql-format-group">
                    <span title="List" className="ql-format-button ql-list"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Bullet" className="ql-format-button ql-bullet"></span>
                    <span className="ql-format-separator"></span>
                </span>
                <span className="ql-format-group">
                    <span title="Link" className="ql-format-button ql-link"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Image" className="ql-format-button ql-image"></span>
                </span>
            </div>
            <div id="quill-passage">
            </div>
            </div>
        )
    }
}

export default Write;