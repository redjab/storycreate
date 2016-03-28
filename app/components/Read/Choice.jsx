import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import classNames from 'classNames';
import _ from 'lodash';

class Choice extends React.Component {
    constructor(props) {
        super(props);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
        this.state = {clicked: false};
        this.meetConditions = this.matchConditions();

    }

    componentDidMount() {
        // console.log(this.props);
    }

    shouldComponentUpdate(nextProps, nextState) {
      return this.props.chosenOneChoice != nextProps.chosenOneChoice ||
                this.state.clicked != nextState.clicked;
    }

    matchConditions(){
        var attributes = this.props.attributes;
        var choice = this.props;

        var linkTo = choice.linkTo;
        var meetConditions = true;
        _.forEach(linkTo.conditions, function(condition) {
            var matchingAttribute = _.find(attributes, { 'name' : condition.name});
            meetConditions = false;
            if (matchingAttribute){
                meetConditions = this.compareValues(matchingAttribute.default, condition.value, condition.compare);
            } else return false;
            if (!meetConditions) return false;
        }.bind(this))
        return meetConditions;
    }

    compareValues(first, second, operator){
        switch (operator) {
            case "=":
                return first == second;
                break;
            case ">":
                return first > second;
                break;
            case "<":
                return first < second;
                break;
            case ">=":
                return first >= second;
                break;
            case "<=":
                return first <= second;
                break;
            default:
                return false;
                break;
        }
    }

    handleChoiceClick(e) {
        e.preventDefault();
        if (!this.state.clicked && this.meetConditions){
            this.setState({clicked: true});
            var passageId = this.props.passageId;
            var choiceId = this.props.id;

            var conditions = this.props.linkTo.conditions;
            var events = this.props.linkTo.events;

            this.props.handleChoiceClick(passageId, choiceId, conditions, events);
        }
    }
    render() {
        var choiceClass = classNames('one-choice', {
            'read-choice': !this.props.chosenOneChoice && !this.props.isBeingLoaded,
            'chosen-choice': this.props.chosenChoice || this.state.clicked,
            'not-chosen-choice': (!this.props.isBeingLoaded && !this.state.clicked && this.props.chosenOneChoice) || (this.props.isBeingLoaded && !this.props.chosenChoice),
            'matched-choice': this.meetConditions && !this.props.chosenOneChoice,
            'unmatched-choice': !this.meetConditions && (!this.props.chosenOneChoice && !this.props.isBeingLoaded),
        })
        var choice = (this.state.clicked || this.props.isBeingLoaded || this.props.chosenOneChoice) ?
                    <div className={choiceClass}>{this.props.text}</div> :
                    <div className={choiceClass} onClick={this.handleChoiceClick}>
                        {this.props.text}
                        {(this.meetConditions) ? '' : <span className='condition-warning'>(conditions not met)</span>}
                    </div>
        return (
            <div className='choice-container'>
                <div className='conditions-events-container'>
                {(this.props.linkTo.conditions && this.props.linkTo.conditions.length > 0) ?
                    <ConditionsEvents title="Conditions" items={this.props.linkTo.conditions} /> : ''
                }
                {(this.props.linkTo.events && this.props.linkTo.events.length > 0) ?
                    <ConditionsEvents title="Events" items={this.props.linkTo.events} /> : ''
                }
                </div>
                {choice}
            </div>
        )
    }
}

class ConditionsEvents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hidden: true};
        this.toggleView = this.toggleView.bind(this);
    }

    toggleView(){
        this.setState({hidden: !this.state.hidden});
    }

    render() {
        var items = this.props.items.map(function(item) {
            return <div className={classNames({hidden: this.state.hidden})}
                        key={item.id}>{item.name} &nbsp; {item.compare || item.modifyBy} &nbsp; {item.value}
                    </div>
        }.bind(this))
        return(
            <div className='conditions-events-list'>
                <a onClick={this.toggleView}><p>{this.props.title}<span className="caret"></span></p></a>
                {items}
            </div>
        )
    }
}

export default Choice;