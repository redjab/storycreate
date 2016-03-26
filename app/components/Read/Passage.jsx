import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Choice from './Choice';
import _ from 'lodash';

class Passage extends React.Component {
    constructor(props) {
        super(props);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
        this.state = {choices: []};
    }

    handleChoiceClick(passageId, choiceId, conditions, events) {
        this.props.handleChoiceClick(passageId, this.props.id, choiceId, events);

        var choices = _.remove(this.state.choices, function(value) {
            return value.id != choiceId;
        });
        this.setState((state) => { choices: choices });
    }

    filterChoices(){
        var attributes = this.props.attributes;
        var choices = this.props.choices;

        return _.filter(choices, function(choice){
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
        }.bind(this))
    }

    componentDidMount() {
        if (!this.props.isBeingLoaded){
            var filteredChoices = this.filterChoices();
            this.setState({choices: filteredChoices});
        } else {
            var filteredChoice = _.find(this.props.choices, {'id' : this.props.choiceId});
            this.setState({choices: [filteredChoice]});
        }
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

    render() {
        var choices = this.state.choices.map(function(choice, index) {
            return <Choice {...choice} key={choice.id} passageId={choice.linkTo.id} isBeingLoaded={this.props.isBeingLoaded} handleChoiceClick={this.handleChoiceClick}/>;
        }.bind(this));
        var title = (this.props.name) ? <h1>{this.props.name}</h1> : '';
        var author = (this.props.author) ? <h3>By {this.props.author}</h3> : '';

        return (
            <div className='row'>
            <div className='read-passage col-md-6 col-md-offset-3'>
                <div className='text-center'>
                    {title}
                    {author}
                </div>
                <div dangerouslySetInnerHTML={{ __html: this.props.text }}/>
                {choices}
            </div>
            </div>
        )
    }
}

Passage.defaultProps = {
    isBeingLoaded: false
}
export default Passage;