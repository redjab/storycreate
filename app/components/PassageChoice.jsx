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
        attrs: {
            innerType: {typeText : 'input'},
            //have to put this here otherwise it gets overwritten by Rect/text attrs
            '.event-label': {
                text: "Modify Events",
                'fill': "#000000",
                'font-size': 7,
                'ref-x': 1.1,
                'ref-y': 4,
                'font-family': '',
                'text-anchor': 'start',
            }
        }
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
            '.label': { text: text },
        }
    });
    return choice;
}

export {Choice};
export default PassageChoice;
