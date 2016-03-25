import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Passage from  './Read/Passage';
import Constants from './Write/Constants';
import _ from 'lodash';

class Read extends React.Component {
    constructor(props) {
        super(props);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
        this.state = {passages: []};
    }

    componentDidMount() {
        var isPreview = this.props.params.isPreview;
        if (isPreview == 1){
            var story = this.props.params.story;
            this.storyData = JSON.parse(localStorage.getItem(story + Constants.DEFAULT_STORY_EXT));
            this.attributes = JSON.parse(localStorage.getItem(story + Constants.DEFAULT_ATTR_EXT));

            //put in the first passage
            var firstPassageId = this.storyData.content.start;
            this.firstPassageId = firstPassageId;
            var firstPassage = _.find(this.storyData.content.passages, {'id' : firstPassageId});
            this.setState((state) => { passages: state.passages.push(firstPassage) });
        }
    }

    handleChoiceClick(passageId){
        var passage = _.find(this.storyData.content.passages, {'id' : passageId});
        this.setState((state) => { passages: state.passages.push(passage) });
    }

    render() {
        var passages = this.state.passages.map(function(passage) {
            if (passage.id === this.firstPassageId){
                return <Passage {...passage}
                key={passage.id}
                handleChoiceClick={this.handleChoiceClick}
                name={this.storyData.metadata.title}
                author={this.storyData.metadata.author}
                isFirst={true}/>
            }
            else return <Passage {...passage} key={passage.id} handleChoiceClick={this.handleChoiceClick}/>;
        }.bind(this))
        return (
            <div className='read-container'>
            <div className="main-content container">
                {passages}
            </div>
            </div>
        )
    }
}

export default Read;