import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import joint, { V, g } from 'jointjs';
import PassageChoice, {Choice} from './PassageChoice';
import Constants from './Constants';
import QuillEditor from './QuillEditor';
import Quill from 'quill';
// import svgPanZoom from 'svg-pan-zoom';
// Create a custom element.
// ------------------------

joint.shapes.story = {};
joint.shapes.story.Passage = joint.shapes.basic.Rect.extend({
    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="7"/>',
        '<path transform="scale(.5) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this passage</title>',
        '</g>',
        '</g>'].join(''),
    titleMarkup: '<g class="passage-title-box"><rect class="passage-title"/><text class="passage-title-text"/></g>',
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><text class="passage-text"/></g><g class="events"><rect class="event-body"/><text class="event-label"/></g>',

    defaults: joint.util.deepSupplement({
        type: 'story.Passage',
        attrs: {
            rect: { fill: '#ffffff', 'stroke-width': 1 },
            '.passage-title': {
                width: Constants.PASSAGE_WIDTH,
                height: Constants.CHOICE_HEIGHT,
            },
            '.events': {
                'ref-x': Constants.PASSAGE_WIDTH*(-1/2),
                'ref-y': Constants.PASSAGE_HEIGHT*(1/2),
            },
            '.event-body' : {
                width: Constants.PASSAGE_WIDTH/2,
                height: Constants.PASSAGE_HEIGHT/12,
                'stroke': "#000000",
                'stroke-dasharray': '10,2',
                'ref': '.events'
            },
        }
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.story.PassageView = joint.dia.ElementView.extend({

    initialize: function() {
        joint.shapes.devs.ModelView.prototype.initialize.apply(this, arguments);
    },

    render: function () {
        joint.shapes.devs.ModelView.prototype.render.apply(this, arguments);

        this.renderTitle();
        this.renderTools();
        this.update();

        return this;
    },

    renderTitle: function() {
        var titleMarkup = this.model.titleMarkup || this.model.get('titleMarkup');
        if (titleMarkup) {
            var nodes = V(titleMarkup);
            V(this.el).append(nodes);
        }
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
});


//Custom choice shapes
// joint.shapes.story = {};

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

joint.shapes.story.ChoiceElement = joint.shapes.devs.Model.extend({
    toolMarkup: ['<g class="element-tools">',
        '<g class="element-tool-remove"><circle fill="red" r="7"/>',
        '<path transform="scale(.5) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove this choice</title>',
        '</g>',
        '</g>'].join(''),

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
    portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
    conditionsMarkup: '<g class="conditions"><rect class="condition-body"/><text class="condition-label"/></g>',
    eventsMarkup: '<g class="events"><rect class="event-body"/><text class="event-label"/></g>',

    defaults: joint.util.deepSupplement({
        type: 'story.ChoiceElement',
        size: { width: Constants.CHOICE_WIDTH, height: Constants.CHOICE_HEIGHT },
        outPorts: [''],
        attrs: {
            '.label': {
                'font-weight': 'normal',
                'transform': 'translate(2,10)'
            },
            rect: { fill: '#ffffff', 'stroke-width': 1 },
            '.inPorts circle': { fill: '#16A085', type: 'input' },
            '.outPorts circle': { fill: '#E74C3C', type: 'output' },

            '.conditions' : { 'ref-x': Constants.CHOICE_WIDTH*(-1/2) },
            '.condition-body' : {
                width: Constants.CHOICE_WIDTH/2,
                height: Constants.CHOICE_HEIGHT/2,
                'stroke': "#000000",
                'stroke-dasharray': '10,2',
                'ref': '.conditions',
            },
            '.condition-label': {
                text: "Modify Conditions",
                'fill': "#000000",
                'font-size': 7,
                'ref': '.condition-body',
                'transform': 'translate(1,4)'
            },

            '.events': {
                    'ref-x': Constants.CHOICE_WIDTH*(-1/2),
                    'ref-y': Constants.CHOICE_HEIGHT*(1/2),
            },
            '.event-body' : {
                width: Constants.CHOICE_WIDTH/2,
                height: Constants.CHOICE_HEIGHT/2,
                'stroke': "#000000",
                'stroke-dasharray': '10,2',
                'ref': '.events'
            },
            '.event-label': {
                text: "Modify Events",
                'fill': "#000000",
                'font-size': 7,
                'ref': '.event-body',
                'transform': 'translate(1,4)'
            }
        }

    }, joint.shapes.devs.Model.prototype.defaults)

});

//custom view
joint.shapes.story.ChoiceElementView = joint.shapes.devs.ModelView.extend({

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

class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph;
    }

    buildNewGraph(graph) {
        var PassageChoice1 = new PassageChoice(Constants.PASSAGE_FIRST_POSITION_X, Constants.PASSAGE_FIRST_POSITION_Y,
            Constants.PASSAGE_WIDTH, Constants.PASSAGE_HEIGHT,
            Constants.DEFAULT_TITLE, this.shortenContent(Constants.DEFAULT_PASSAGE, Constants.MAX_CHAR_PASSAGE), true);

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

    onMouseScroll() {
        this.paper.$el.on('mousewheel DOMMouseScroll', function(e) {
            e.preventDefault();
            e = e.originalEvent;

            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) / 50;
            var offsetX = (e.offsetX || e.clientX - $(this).offset().left); // offsetX is not defined in FF
            var offsetY = (e.offsetY || e.clientY - $(this).offset().top); // offsetY is not defined in FF
            var p = this.offsetToLocalPoint(offsetX, offsetY);
            var newScale = V(this.paper.viewport).scale().sx + delta; // the current paper scale changed by delta

            if (newScale > 0.4 && newScale < 2) {
                this.paper.setOrigin(0, 0); // reset the previous viewport translation
                this.paper.scale(newScale, newScale, p.x, p.y);
            }
        }.bind(this));
    }

    offsetToLocalPoint(x, y) {
        var svgPoint = this.paper.svg.createSVGPoint();
        svgPoint.x = x;
        svgPoint.y = y;
        // Transform point into the viewport coordinate system.
        var pointTransformed = svgPoint.matrixTransform(this.paper.viewport.getCTM().inverse());
        return pointTransformed;
    }

    onAddPassage() {
        //save story data when adding a new passage
        this.graph.on('add', function(eventName, cell){
            if (eventName instanceof joint.shapes.story.Passage){
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
                if (cellView.model instanceof joint.shapes.story.ChoiceElement){
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
                }

                if (cellView.model instanceof joint.shapes.story.Passage){
                    _.remove(this.storyData.content.passages, function(n){
                        return n.id === cellView.model.id;
                    });
                }

                //remove the cell from graph
                cellView.model.remove();
            }

        }.bind(this));

        //TODO: prevent deleting the starting passage or display warning
        this.graph.on('remove', function(eventName, cell){
            //remove the passage from storyData
            if (eventName instanceof joint.shapes.story.Passage){
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
        var shortend = (text.length > maxLength) ? text.substring(0, maxLength) + '...' : text;
        var wraptext = joint.util.breakText(shortend, {
            width: Constants.PASSAGE_WIDTH,
            height: Constants.PASSAGE_HEIGHT
        });
        return wraptext;
    }

    onMovePassage(){
        this.graph.on('change:position', function(cell) {
            if (cell instanceof joint.shapes.story.Passage){
                this.resizePaper(cell);
                // var cells = this.graph.findModelsInArea(g.rect(cell.getBBox()));
                // _.forEach(cells, function(cell){
                //     var links = this.graph.getConnectedLinks(cell, {deep: true});
                //     //TODO: this is not really what we want, have to get the links in the area somehow
                //     _.forEach(links, function(link){
                //         this.paper.findViewByModel(link).update();
                //     }.bind(this));
                // }.bind(this));
            }
        }.bind(this));
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
                    this.saveGraphLocal();

                    $('#choiceModal').modal('hide');
                }.bind(this))

            }
        }.bind(this))
    }

    onDblClickChoice() {
        this.paper.on('cell:pointerdblclick', function(evt, x, y) {
            if (evt.model instanceof joint.shapes.story.ChoiceElement){
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
            if (evt.model.attributes.type && evt.model.attributes.type === 'story.Passage'){
                $('#passageModal').modal('show');
                $('.submit-passage').off('click');

                setTimeout(function (){
                    $('.ql-editor').focus();
                }, 500);

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

                    // evt.$box.find('label').text(titleShortened);
                    // evt.$box.find('p').text(passageShortened);
                    evt.model.attr('.passage-text/text', passageShortened);
                    evt.model.attr('.passage-title-text/text', titleShortened);

                    //update graph
                    // evt.model.attributes.label = titleShortened;
                    // evt.model.attributes.text = passageShortened;

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
        // this.onMouseScroll();
        this.onAddPassage();
        this.onChangeLink();
        this.onRemovePassage();
        this.onDblClickPassage();
        this.onDblClickChoice();
        this.onClickAddChoice();
        // this.onMovePassage();

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
            width: $('.container').width(),
            height: 800,
            model: this.graph,
            interactive: function(cellView) {
                //prevent choice box dragging
                if (cellView.model instanceof joint.shapes.devs.Model || cellView.model instanceof joint.shapes.story.AddChoiceElement){
                    return false;
                }
                return true;
            },
            defaultLink: new joint.dia.Link({
                doubleLinkTools: true,
                router: { name: 'metro' },
                connector: { name: 'rounded' },
                attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
                        '.marker-arrowhead-group-source': {
                            display: 'none'
                        },
                }
            }),
            linkView: joint.dia.LinkView.extend({
                options: _.defaults({
                    doubleLinkTools: true
                }, joint.dia.LinkView.prototype.options)
            }),
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                if (magnetS && magnetS.getAttribute('type') === 'input') return false;
                //Prevent linking from passage
                if (cellViewS && cellViewS.model.attr('innerType') && cellViewS.model.attr('innerType').typeText === 'input') return false;
                return (cellViewT &&  cellViewT.model instanceof joint.shapes.story.Passage);
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

        this.currentScale = 1;
        this.setupPanZoom();

    }

    setupPanZoom(){
        var targetElement = this.paperDiv;
        var that = this;
        this.panAndZoom = svgPanZoom(targetElement.children()[0],
        {
            viewportSelector: $(targetElement.children()[0]).children()[0],
            fit: false,
            center: false,
            zoomScaleSensitivity: 0.4,
            dblClickZoomEnabled: false,
            panEnabled: false,
            onZoom: function(scale){
                that.currentScale = scale;
            }
        });

        this.paper.on('blank:pointerdown', function (evt, x, y) {
            this.panAndZoom.enablePan();
        }.bind(this));

        //Disable pan when the mouse button is released
        this.paper.on('cell:pointerup blank:pointerup', function(cellView, event) {
          this.panAndZoom.disablePan();
        }.bind(this));
    }

    zoomIn(){
        this.panAndZoom.zoomIn();
    }

    zoomOut(){
        this.panAndZoom.zoomOut();
    }

    resetZoom(){
        this.panAndZoom.resetZoom();
        this.panAndZoom.resetPan();
    }

    updateLinks(){
        var allLinks = this.graph.getLinks();
        _.forEach(allLinks, function(link){
            this.paper.findViewByModel(link).update();

        }.bind(this));
    }

    resizePaper(cell){
        var x = cell.get('position').x + Constants.PASSAGE_TRANSLATE_X;
        var y = cell.get('position').y;

        x += Constants.PASSAGE_WIDTH * 1.2;
        y += Constants.PASSAGE_HEIGHT * 1.2;

        if (x > this.paper.getArea().width){
            this.paper.setDimensions(x, this.paper.getArea().height);
        }

        if (y > this.paper.getArea().height){
            this.paper.setDimensions(this.paper.getArea().width, y);
        }
        this.saveGraphSizeLocal();

    }

    addPassage() {
        var allElements = this.graph.getElements();
        var lastCell;
        _.forEachRight(allElements, function(value){
            if(value instanceof joint.shapes.story.Passage){
                lastCell = value;
                return false;
            }
        });
        var x = Constants.PASSAGE_FIRST_POSITION_X;
        var y = Constants.PASSAGE_FIRST_POSITION_Y;

        if (lastCell != undefined){
            this.paper.findViewByModel(lastCell).unhighlight();

            x = lastCell.attributes.position.x + Constants.PASSAGE_TRANSLATE_X;
            y = lastCell.attributes.position.y;

            // this.resizePaper(lastCell);

        }
        var newPassage = new PassageChoice(x, y,
            Constants.PASSAGE_WIDTH, Constants.PASSAGE_HEIGHT,
            Constants.DEFAULT_TITLE, this.shortenContent(Constants.DEFAULT_PASSAGE, Constants.MAX_CHAR_PASSAGE));

        newPassage.passage.embed(newPassage.addChoice);
        this.graph.addCell([newPassage.passage, newPassage.addChoice]);

        this.paper.findViewByModel(newPassage.passage).highlight();
    }

    render() {
        return (
            <div>
            <div className="btn-group diagram-control" role="group">
                <button type="button" className="btn btn-success" onClick={this.addPassage.bind(this)}>Add Passage</button>
                <button type="button" className="btn btn-success" onClick={this.updateLinks.bind(this)}>Update Links</button>
            </div>

            <div className="btn-group diagram-control pull-right" role="group">
                <span className="glyphicon glyphicon-zoom-in" aria-hidden="true" onClick={this.zoomIn.bind(this)}></span>
                <span className="glyphicon glyphicon-zoom-out" aria-hidden="true" onClick={this.zoomOut.bind(this)}></span>
                <span className="glyphicon glyphicon-refresh" aria-hidden="true" onClick={this.resetZoom.bind(this)}></span>
            </div>

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
                <div id='paper' ref='placeholder'></div>
            </div>
            </div>
        );
    }
}

export default Graph;