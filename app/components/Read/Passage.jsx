import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Choice from './Choice';
import _ from 'lodash';

class Passage extends React.Component {
    constructor(props) {
        super(props);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
        this.state = {choices: this.props.choices};
    }

    handleChoiceClick(passageId, choiceId, conditions, events) {
        this.props.handleChoiceClick(passageId, choiceId, events);

        var choices = _.remove(this.state.choices, function(value) {
            return value.id != choiceId;
        });
        this.setState((state) => { choices: choices });
    }

    componentDidMount() {
        var attributes = this.props.attributes;
        var choices = this.state.choices;

        var filteredChoices = _.filter(choices, function(choice){
            var linkTo = choice.linkTo;
            var meetConditions = true;
            _.forEach(linkTo.conditions, function(condition) {
                var matchingAttribute = _.find(attributes, { 'name' : condition.name});
                meetConditions = this.compareValues(matchingAttribute.default, condition.value, condition.compare);
                if (!meetConditions) return false;
            }.bind(this))
            return meetConditions;
        }.bind(this))

        this.setState({choices: filteredChoices});
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
                return first == second;
                break;
            default:
                return false;
                break;
        }
    }

    render() {
        var choices = this.state.choices.map(function(choice, index) {
            return <Choice {...choice} key={choice.id} passageId={choice.linkTo.id} handleChoiceClick={this.handleChoiceClick}/>;
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

export default Passage;