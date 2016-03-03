import joint from 'jointjs';
import Constants from './Constants'

function PassageChoice(x, y, width, height, label, text, isFirst){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.text = text;
    this.passage = new joint.shapes.story.Passage({
        position: { x: x, y: y },
        size: { width: width, height: height },
        label: label,
        text: text,
        attrs: {innerType: {typeText : 'input'} }
    });
    this.choices = [];
    var choicePositionX = x;
    var choicePositionY = y + height;

    var addChoiceHeight = (isFirst) ? (y + height + Constants.CHOICE_HEIGHT) : (y + height)

    var addChoice = new joint.shapes.story.AddChoiceElement({
        position: {x: x, y: addChoiceHeight},
        size: {width: width, height: Constants.CHOICE_HEIGHT}
    })

    this.addChoice = addChoice;
    this.passage.embed(this.addChoice);

    if (isFirst){
        var choice = Choice(x, y+height, Constants.DEFAULT_CHOICE);
        this.choice = choice;
        this.passage.embed(this.choice);
    }

}

function Choice(x, y, text){
    var choice = new joint.shapes.story.ChoiceElement({
        position: { x: x, y: y },
        size: { width: Constants.CHOICE_WIDTH, height: Constants.CHOICE_HEIGHT },
        outPorts: [''],
        attrs: {
            '.label': { text: text,
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
    });
    return choice;
}

export {Choice};
export default PassageChoice;
