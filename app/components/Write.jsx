import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import joint from 'jointjs';
import _ from 'lodash';
import PassageChoice from './JointInit';

var MAX_CHAR_TITLE = 12;
var MAX_CHAR_PASSAGE = 67;
var MAX_CHAR_CHOICE = 10;

var DEFAULT_TITLE = "Untitled";
var DEFAULT_PASSAGE = "Double click here to start writing and add choices. To branch your story, add a choice to this passage, and drag from the choice to a new passage."
var DEFAULT_PASSAGE_SHORTENED = DEFAULT_PASSAGE.substring(0, MAX_CHAR_PASSAGE) + "...";
var PASSAGE_HEIGHT = 140;
var PASSAGE_WIDTH = 120;

var PASSAGE_FIRST_POSITION_X = 280;
var PASSAGE_FIRST_POSITION_Y = 280;
var PASSAGE_TRANSLATE_X = 150;

var CHOICE_HEIGHT = 30;
var CHOICE_WIDTH = PASSAGE_WIDTH;
var DEFAULT_CHOICE = "";

var DEFAULT_STORY_NAME = "Untitled";
var DEFAULT_AUTHOR = "Anonymous";
var DEFAULT_GRAPH = DEFAULT_STORY_NAME + "_graph";
var DEFAULT_STORY_DATA = DEFAULT_STORY_NAME + "_story";

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

class PassageModal extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="modal" id="passageModal">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="myModalLabel">Edit Passage</h4>
                  </div>
                  <div className="modal-body">
                    <form className="form-horizontal" role="form">
                        <input type="text" className="form-control title-input" placeholder="Title"></input>
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
        )
    }
}
class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.graph = new joint.dia.Graph;
    }

    buildNewGraph(graph) {
        var PassageChoice1 = new PassageChoice(PASSAGE_FIRST_POSITION_X, PASSAGE_FIRST_POSITION_Y,
            PASSAGE_WIDTH, PASSAGE_HEIGHT,
            DEFAULT_TITLE, DEFAULT_PASSAGE_SHORTENED);

        graph.addCells([PassageChoice1.passage, PassageChoice1.choice]);
        return graph;
    }

    setupListeners() {
        //save story data when adding a new passage
        this.graph.on('add', function(eventName, cell){
            if (eventName.attributes.type && eventName.attributes.type === 'html.Element'){
                this.storyData.content.passages.push({
                    "id": eventName.id,
                    "title": DEFAULT_TITLE,
                    "text": DEFAULT_PASSAGE,
                    "choices": []
                });
                if (this.graph.getElements().length === 1){
                    this.storyData.content.start = eventName.id;
                }
            }

            //have to check which passage it belongs to somehow.
            //maybe use findViewsInArea, and keeping looking up until find the first html.Element
            //maybe also keep track of passageChoice and double check againts previous choices?
            //ok that's dumb. just keep a list of choices with its parent passage
            if (eventName.attributes.type && eventName.attributes.type == 'devs.Model'){
                console.log("test");
            }
        }.bind(this));

        this.graph.on('remove', function(eventName, cell){
            if (eventName.attributes.type && eventName.attributes.type === 'html.Element'){
                _.remove(this.storyData.content.passages, function(n){
                    return n.id == eventName.id;
                });
                //might also want to delete any link to that passage
            }
        }.bind(this));

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
                    var titleShortened = (title.length > MAX_CHAR_TITLE) ? title.substring(0, MAX_CHAR_TITLE) + '...' : title;
                    var passage = $('.passage-input').val();
                    var passageShortened = (passage.length > MAX_CHAR_PASSAGE) ? passage.substring(0, MAX_CHAR_PASSAGE) + '...' : passage;

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

        //save to localStorage on graph changes
        this.graph.on('batch:stop add remove', function(eventName, cell) {
            this.storyData.metadata.updated = Date.now().toString();
            this.saveToLocalStorage();
        }.bind(this));

    }

    saveToLocalStorage(){
        localStorage.setItem(DEFAULT_GRAPH, JSON.stringify(this.graph.toJSON()));
        localStorage.setItem(DEFAULT_STORY_DATA, JSON.stringify(this.storyData));
    }

    componentDidMount() {
        this.storyData = JSON.parse(localStorage.getItem(DEFAULT_STORY_DATA)) || {
            "metadata":
            {
                "id": 1,
                "title": DEFAULT_STORY_NAME,
                "author": DEFAULT_AUTHOR,
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


        this.paper = new joint.dia.Paper({
            el: ReactDOM.findDOMNode(this.refs.placeholder),
            model: this.graph,
            defaultLink: new joint.dia.Link({
                attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
            }),
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                if (magnetS && magnetS.getAttribute('type') === 'input') return false;
                return (cellViewT.model.attributes.type === 'html.Element');
            },
            validateMagnet: function(cellView, magnet) {
                // Note that this is the default behaviour. Just showing it here for reference.
                // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
                return magnet.getAttribute('magnet') !== 'passive';
            }
        });

        this.setupListeners();
        var graphJSON = JSON.parse(localStorage.getItem(DEFAULT_GRAPH));

        if (graphJSON != null){
            this.graph.fromJSON(graphJSON);
        } else this.graph = this.buildNewGraph(this.graph);


    }

    addPassage() {
        var allElements = this.graph.getElements();
        var lastCell = allElements[allElements.length-1];
        this.paper.findViewByModel(lastCell).unhighlight();

        var newPassage = new PassageChoice(lastCell.attributes.position.x+PASSAGE_TRANSLATE_X, lastCell.attributes.position.y,
            PASSAGE_WIDTH, PASSAGE_HEIGHT,
            DEFAULT_TITLE, DEFAULT_PASSAGE_SHORTENED);

        this.graph.addCell(newPassage.passage);
        this.paper.findViewByModel(newPassage.passage).highlight();
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

            <button type="button" className="btn btn-primary pull-right" onClick={this.addPassage.bind(this)}>Add Passage</button>
            <div id='paper' ref='placeholder'></div>
            </div>
        );
    }
}

export default Write;