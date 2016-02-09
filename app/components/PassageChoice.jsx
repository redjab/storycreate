import joint from 'jointjs';
import Constants from './Constants'

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
        attrs: {innerType: {typeText : 'input'} }
    });
    this.choices = [];
    var choicePositionX = x;
    var choicePositionY = y + height;

    var choice1 = new joint.shapes.devs.Model({
        position: { x: x, y: y + height },
        size: { width: width, height: Constants.CHOICE_HEIGHT },
        outPorts: [''],
        attrs: {
            '.label': { text: Constants.DEFAULT_CHOICE, 'ref-x': .45, 'ref-y': .2 },
            rect: { fill: '#ffffff', 'stroke-width': 1 },
            '.inPorts circle': { fill: '#16A085', type: 'input' },
            '.outPorts circle': { fill: '#E74C3C', type: 'output' }
        }
    });

    this.choice = choice1;
    this.passage.embed(this.choice);
}

export default PassageChoice;
