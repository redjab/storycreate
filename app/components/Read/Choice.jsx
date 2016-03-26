import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

class Choice extends React.Component {
    constructor(props) {
        super(props);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
        this.state = {clicked: false};
    }

    componentDidMount() {
        // console.log(this.props);
    }

    handleChoiceClick(e) {
        e.preventDefault();
        if (!this.state.clicked){
            this.setState({clicked: true});
            var passageId = this.props.passageId;
            var choiceId = this.props.id;

            var conditions = this.props.linkTo.conditions;
            var events = this.props.linkTo.events;

            this.props.handleChoiceClick(passageId, choiceId, conditions, events);
        }
    }
    render() {
        var choice = (this.state.clicked || this.props.isBeingLoaded) ?
                    <div className='read-choice-chosen'>{this.props.text}</div> :
                    <div className='text-center read-choice' onClick={this.handleChoiceClick}>{this.props.text}</div>
        return (
            <div>{choice}</div>
        )
    }
}

export default Choice;