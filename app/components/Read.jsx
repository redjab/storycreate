import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Passage from  './Read/Passage';
import Constants from './Write/Constants';
import _ from 'lodash';

function isNumberic(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

class Read extends React.Component {
    constructor(props) {
        super(props);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
        this.restartStory = this.restartStory.bind(this);
        this.state = {passages: []};
        this.progress = [];
    }

    componentDidMount() {
        var isPreview = this.props.params.isPreview;
        if (isPreview == 1){
            this.story = this.props.params.story;
            this.storyData = JSON.parse(localStorage.getItem(this.story + Constants.DEFAULT_STORY_EXT));

            this.playerAttributes = JSON.parse(localStorage.getItem(this.story + Constants.DEFAULT_ATTR_EXT)).attributes || [];
            this.addFirstPassage();
        }
    }

    addFirstPassage(){
        //put in the first passage
        var firstPassageId = this.storyData.content.start;
        this.firstPassageId = firstPassageId;
        var firstPassage = _.find(this.storyData.content.passages, {'id' : firstPassageId});
        this.setState((state) => { passages: state.passages.push(firstPassage) });
    }

    loadProgress(){
        //Ignore persistent attributes because it's not wiped on loading
    }

    handleEventOperation(value, operation, addition){
        var numberic = isNumberic(value);
        if (numberic){
            value = parseFloat(value);
        }
        switch (operation) {
            case "=":
                value = addition;
                break;
            case "+":
                value = value + addition;
                break;
            case "-":
                value = value - addition;
                break;
            case "*":
                value = value * addition;
                break;
            case "/":
                value = value / addition;
                break;
            default:
                value = value;
        }
        if (isNaN(value) && !numberic) return undefined;
        return value;
    }

    handleChoiceClick(passageId, choiceId, events){
        var passage = _.find(this.storyData.content.passages, {'id' : passageId});
        this.progress.push(passageId);
        var playerAttributes = this.playerAttributes;

        _.forEach(events, function(event) {
            var matchingAttribute = _.find(playerAttributes, {'name' : event.name});
            var newValue = this.handleEventOperation(matchingAttribute.default, event.modifyBy, event.value);
            if (newValue){
                matchingAttribute.default = newValue;
            }
        }.bind(this))

        this.setState((state) => { passages: state.passages.push(passage) });
    }

    saveReadLocal () {
        localStorage.setItem(this.props.params.story + Constants.DEFAULT_READ_PROGRESS_EXT, JSON.stringify(this.progress));
        localStorage.setItem(this.props.params.story + Constants.DEFAULT_READ_ATTR_EXT, JSON.stringify(this.playerAttributes));
    }

    restartStory() {
        var persistentAttributes = _.filter(this.playerAttributes, function(attribute) {
            return attribute.persistent == 'Yes';
        }.bind(this))
        var nonPersistent = JSON.parse(localStorage.getItem(this.story + Constants.DEFAULT_ATTR_EXT)).attributes || [];
        Array.prototype.push.apply(persistentAttributes, nonPersistent);
        this.playerAttributes = persistentAttributes;
        console.log(this.playerAttributes);
        this.setState({passages: []}, function(){
            this.addFirstPassage();
        }.bind(this));
    }

    render() {
        var passages = this.state.passages.map(function(passage) {
            if (passage.id === this.firstPassageId){
                return <Passage {...passage}
                    attributes={this.playerAttributes}
                    key={passage.id}
                    handleChoiceClick={this.handleChoiceClick}
                    name={this.storyData.metadata.title}
                    author={this.storyData.metadata.author}
                    isFirst={true}/>
            }
            else return <Passage {...passage} attributes={this.playerAttributes} key={passage.id} handleChoiceClick={this.handleChoiceClick}/>;
        }.bind(this))
        return (
            <div className='read-container'>
            <div className="main-content container">
                <div className='read-actions'>
                    <div className="btn-group-vertical" role="group">
                        <button type="button" className="btn btn-default" onClick={this.restartStory}>Restart</button>
                        <button type="button" className="btn btn-default">Set Checkpoint</button>
                        <button type="button" className="btn btn-default">Load</button>
                    </div>
                </div>
                {passages}
            </div>
            </div>
        )
    }
}

export default Read;