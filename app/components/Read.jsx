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
        this.state = {passages: [], startingPassages: []};
    }

    componentDidMount() {
        var isPreview = this.props.params.isPreview;
        if (isPreview == 1){
            this.story = this.props.params.story;
            this.storyData = JSON.parse(localStorage.getItem(this.story + Constants.DEFAULT_STORY_EXT));

            this.loadReadLocal();
            this.restartAttributes();
            if (!this.progress || this.progress.length === 0) {
                this.addFirstPassage();
            } else {
                this.setState({startingPassages: this.loadProgress()});
            }
        }
    }

    addFirstPassage(){
        var firstPassageId = this.storyData.content.start;
        var firstPassage = _.find(this.storyData.content.passages, {'id' : firstPassageId});
        this.setState((state) => { passages: state.passages.push(firstPassage) });
    }

    loadReadLocal(){
        this.progress = JSON.parse(localStorage.getItem(this.story + Constants.DEFAULT_READ_PROGRESS_EXT)) || [];
        this.playerAttributes = JSON.parse(localStorage.getItem(this.story + Constants.DEFAULT_READ_ATTR_EXT)) ||
                                JSON.parse(localStorage.getItem(this.story + Constants.DEFAULT_ATTR_EXT)).attributes ||
                                [];
    }

    loadProgress(){
        if (!this.progress || this.progress.length === 0) {
            return [];
        }
        else {
            var passages = this.progress.map(function(value, index) {
                var passageId = value.passage;
                var choiceId = value.choice;

                var originalPassage = _.find(this.storyData.content.passages, {'id' : passageId});

                if (choiceId){
                    var choice = _.find(originalPassage.choices, {'id' : choiceId});
                    this.processEvents(choice.linkTo.events, true);
                }

                if (index == 0 ){
                    return <Passage {...originalPassage}
                        attributes={this.playerAttributes}
                        key={passageId}
                        handleChoiceClick={this.handleChoiceClick}
                        name={this.storyData.metadata.title}
                        author={this.storyData.metadata.author}
                        isFirst={true}
                        isBeingLoaded={true}
                        choiceId={choiceId}/>
                } else if (choiceId === undefined){
                    return <Passage {...originalPassage}
                        attributes={this.playerAttributes}
                        key={passageId}
                        handleChoiceClick={this.handleChoiceClick}/>;
                } else {
                    return <Passage {...originalPassage}
                        attributes={this.playerAttributes}
                        key={passageId}
                        handleChoiceClick={this.handleChoiceClick}
                        isBeingLoaded={true}
                        choiceId={choiceId}/>
                }
            }.bind(this))
            return passages;
        }
    }

    handleEventOperation(value, operation, addition){
        var numberic = isNumberic(value);
        addition = isNumberic(addition) ? parseFloat(addition) : addition;
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

    processEvents(events, isLoading){
        var playerAttributes = this.playerAttributes;

        _.forEach(events, function(event) {
            var matchingAttribute = _.find(playerAttributes, {'name' : event.name});
            if (matchingAttribute && (matchingAttribute.persistent == 'No' || !isLoading)){
                var newValue = this.handleEventOperation(matchingAttribute.default, event.modifyBy, event.value);
                if (newValue){
                    matchingAttribute.default = newValue;
                }
            }
        }.bind(this))
        this.saveReadLocal();
    }

    handleChoiceClick(nextPassageId, curPassageId, choiceId, events){
        var passage = _.find(this.storyData.content.passages, {'id' : nextPassageId});
        if (this.progress.length > 0 ){
            this.progress[this.progress.length-1].choice = choiceId;
        } else {
            this.progress.push({
                passage: curPassageId,
                choice: choiceId
            })
        }
        this.processEvents(events);
        this.setState((state) => { passages: state.passages.push(passage) });
        this.progress.push({
            passage: nextPassageId
        })
        this.saveReadLocal();
    }

    saveReadLocal () {
        localStorage.setItem(this.story + Constants.DEFAULT_READ_PROGRESS_EXT, JSON.stringify(this.progress));
        localStorage.setItem(this.story + Constants.DEFAULT_READ_ATTR_EXT, JSON.stringify(this.playerAttributes));
    }

    restartAttributes(){
        var persistentAttributes = _.filter(this.playerAttributes, function(attribute) {
            return attribute.persistent == 'Yes';
        }.bind(this))

        var nonPersistent = JSON.parse(localStorage.getItem(this.story + Constants.DEFAULT_ATTR_EXT)).attributes || [];
        nonPersistent = _.filter(nonPersistent, function(attribute) {
            return attribute.persistent == 'No';
        })

        Array.prototype.push.apply(persistentAttributes, nonPersistent);

        this.playerAttributes = persistentAttributes;
    }

    restartStory() {
        this.restartAttributes();
        this.progress = [];

        this.setState({startingPassages: [], passages: []}, function(){
            this.addFirstPassage();
        }.bind(this));

        this.saveReadLocal();
    }

    render() {
        var passages = this.state.passages.map(function(passage) {
            if (passage.id === this.storyData.content.start){
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
                        <button type="button" className="btn btn-default">Save Here</button>
                    </div>
                </div>
                {this.state.startingPassages}
                {passages}
            </div>
            </div>
        )
    }
}

Read.defaultProps = {
    progress: []
}

export default Read;