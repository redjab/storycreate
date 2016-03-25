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

    handleChoiceClick(passageId, choiceId) {
        this.props.handleChoiceClick(passageId);

        var choices = _.remove(this.state.choices, function(value) {
            return value.id != choiceId;
        });
        this.setState((state) => { choices: choices });
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