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

var MAX_CHAR_TITLE = 12;
var MAX_CHAR_PASSAGE = 67;
var MAX_CHAR_CHOICE = 10;

var DEFAULT_TITLE = "Untitled";
var DEFAULT_PASSAGE = "Double click here to start writing and add choices. To branch your story, add a choice to this passage, and drag from the choice to a new passage."
var DEFAULT_PASSAGE_SHORTENED = DEFAULT_PASSAGE.substring(0, MAX_CHAR_PASSAGE) + "...";
var PASSAGE_HEIGHT = 140;
var PASSAGE_WIDTH = 120;

var PASSAGE_FIRST_POSITION_X = 80;
var PASSAGE_FIRST_POSITION_Y = 80;
var PASSAGE_TRANSLATE_X = 150;

var CHOICE_HEIGHT = 30;
var CHOICE_WIDTH = PASSAGE_WIDTH;
var DEFAULT_CHOICE = "";

var DEFAULT_STORY_NAME = "Untitled";
var DEFAULT_AUTHOR = "Anonymous";
var DEFAULT_GRAPH = DEFAULT_STORY_NAME + "_graph";
var DEFAULT_STORY_DATA = DEFAULT_STORY_NAME + "_story";

var joint = require('jointjs');
var _ = require('lodash');
var graph = new joint.dia.Graph;

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

var passageChoices = [];

var storyData = localStorage.getObject(DEFAULT_STORY_DATA) || {
    "metadata":
    {
        "id": 1,
        "title": "Untitled1",
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

function PassageChoice(x, y, width, height, label, text){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.text = text;
    this.passage = new joint.shapes.html.Element({
        position: { x: x, y: y },
        size: { width: width, height: height },
        label: label,
        text: text,
        attrs: {type: 'input'}
    });
    this.choices = [];
    var choicePositionX = x;
    var choicePositionY = y + height;

    var choice1 = new joint.shapes.devs.Model({
        position: { x: x, y: y + height },
        size: { width: width, height: CHOICE_HEIGHT },
        outPorts: [''],
        attrs: {
            '.label': { text: DEFAULT_CHOICE, 'ref-x': .45, 'ref-y': .2 },
            rect: { fill: '#ffffff', 'stroke-width': 1 },
            '.inPorts circle': { fill: '#16A085', type: 'input' },
            '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }
    });

    this.choice = choice1;
}

$(function(){

    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 1200, height: 800, gridSize: 1,
        model: graph,
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


    //-----------------------------------------------------------
    //Set up listeners

    //save story data when adding a new passage
    graph.on('add', function(eventName, cell){
        if (eventName.attributes.type && eventName.attributes.type === 'html.Element'){
            storyData.content.passages.push({
                "id": eventName.id,
                "title": DEFAULT_TITLE,
                "text": DEFAULT_PASSAGE,
                "choices": []
            });
            if (graph.getElements().length === 1){
                storyData.content.start = eventName.id;
            }
        }

        //have to check which passage it belongs to somehow.
        //maybe use findViewsInArea, and keeping looking up until find the first html.Element
        //maybe also keep track of passageChoice and double check againts previous choices?
        //ok that's dumb. just keep a list of choices with its parent passage
        if (eventName.attributes.type && eventName.attributes.type == 'devs.Model'){
            console.log("test");
        }
    });

    graph.on('remove', function(eventName, cell){
        if (eventName.attributes.type && eventName.attributes.type === 'html.Element'){
            _.remove(storyData.content.passages, function(n){
                return n.id == eventName.id;
            });
            //might also want to delete any link to that passage
        }
    });

    paper.on('cell:pointerdblclick', function(evt, x, y) {
        if (evt.model.attributes.type && evt.model.attributes.type === 'html.Element'){
            $('#passageModal').modal('show');
            $('.submit-passage').off('click');

            var passageData = _.find(storyData.content.passages, { 'id': evt.model.id });

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
                localStorage.setObject(DEFAULT_GRAPH, graph.toJSON());

                //update storyData
                passageData.title = title;
                passageData.text = passage;
                localStorage.setObject(DEFAULT_STORY_DATA, storyData);

                $('#passageModal').modal('hide');
            });
        }

    })

    //save to localStorage on graph changes
    graph.on('batch:stop add remove', function(eventName, cell) {
        localStorage.setObject(DEFAULT_GRAPH, graph.toJSON());
        storyData.metadata.updated = Date.now().toString();
        localStorage.setObject(DEFAULT_STORY_DATA, storyData);
    });

    // paper.on('cell:mouseover ', function(eventName, cell) {
    //     if (cell.)
    //     console.log('on hover');
    //     console.log(cell);
    //     console.log(eventName);
    // });

    var graphJSON = localStorage.getObject(DEFAULT_GRAPH);

    if (graphJSON != null){
        graph.fromJSON(graphJSON);
    } else graph = buildNewGraph(graph);

    $('#addPassage').click(function(){
        var allElements = graph.getElements();
        var lastCell = allElements[allElements.length-1];
        paper.findViewByModel(lastCell).unhighlight();

        var newPassage = new PassageChoice(lastCell.attributes.position.x+PASSAGE_TRANSLATE_X, lastCell.attributes.position.y,
            PASSAGE_WIDTH, PASSAGE_HEIGHT,
            DEFAULT_TITLE, DEFAULT_PASSAGE_SHORTENED);

        graph.addCell(newPassage.passage);
        paper.findViewByModel(newPassage.passage).highlight();
    })
    function buildNewGraph(graph){
        var PassageChoice1 = new PassageChoice(PASSAGE_FIRST_POSITION_X, PASSAGE_FIRST_POSITION_Y,
            PASSAGE_WIDTH, PASSAGE_HEIGHT,
            DEFAULT_TITLE, DEFAULT_PASSAGE_SHORTENED);

        graph.addCells([PassageChoice1.passage, PassageChoice1.choice]);
        return graph;
    }

});

