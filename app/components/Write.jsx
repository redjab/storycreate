import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import joint from 'jointjs';
import _ from 'lodash';
import PassageChoice from './PassageChoice';
import Constants from './Constants'
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

        //keep track which choices falls under which passage
        this.choicePassage[PassageChoice1.choice.id] = PassageChoice1.passage.id;

        //add new choice to storyData
        var passage = _.find(this.storyData.content.passages, { 'id': PassageChoice1.passage.id });
        passage.choices = [];
        var newChoice = {
                            "id": PassageChoice1.choice.id,
                            "text": Constants.DEFAULT_CHOICE,
                            "linkTo": []
                        }

        passage.choices.push(newChoice);
        this.saveStoryLocal();
        this.saveChoiceLocal();

        console.log(PassageChoice1);
        return graph;
    }

    addNewChoiceToStoryData(){

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
            //maybe use findViewsInArea, and keeping looking up until find the first html.Element
            //maybe also keep track of passageChoice and double check againts previous choices?
            //ok that's dumb. just keep a list of choices with its parent passage
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
                var passageId = this.choicePassage[source.id];
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
        this.graph.on('remove', function(eventName, cell){
            if (eventName.attributes.type && eventName.attributes.type === 'html.Element'){
                _.remove(this.storyData.content.passages, function(n){
                    return n.id == eventName.id;
                });
                //might also want to delete any link to that passage
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
    }

    setupListeners() {
        this.onAddPassage();
        this.onChangeLink();
        this.onRemovePassage();
        this.onDblClickPassage();

        //save to localStorage on graph changes
        this.graph.on('batch:stop add remove', function(eventName, cell) {
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

    saveChoiceLocal(){
        localStorage.setItem(Constants.DEFAULT_CHOICE_DATA, JSON.stringify(this.choicePassage));
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

        this.choicePassage = JSON.parse(localStorage.getItem(Constants.DEFAULT_CHOICE_DATA)) || {};


        this.paper = new joint.dia.Paper({
            el: ReactDOM.findDOMNode(this.refs.placeholder),
            width: 1200,
            model: this.graph,
            defaultLink: new joint.dia.Link({
                attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
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
        });

        this.setupListeners();
        var graphJSON = JSON.parse(localStorage.getItem(Constants.DEFAULT_GRAPH));

        if (graphJSON != null){
            this.graph.fromJSON(graphJSON);
        } else this.graph = this.buildNewGraph(this.graph);


    }

    addPassage() {
        var allElements = this.graph.getElements();
        var lastCell = allElements[allElements.length-1];
        this.paper.findViewByModel(lastCell).unhighlight();

        var newPassage = new PassageChoice(lastCell.attributes.position.x+Constants.PASSAGE_TRANSLATE_X, lastCell.attributes.position.y,
            Constants.PASSAGE_WIDTH, Constants.PASSAGE_HEIGHT,
            Constants.DEFAULT_TITLE, Constants.DEFAULT_PASSAGE_SHORTENED);

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