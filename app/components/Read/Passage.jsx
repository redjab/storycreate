import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Choice from './Choice';
import _ from 'lodash';
import classNames from 'classNames';

class Passage extends React.Component {
    constructor(props) {
        super(props);
        this.handleChoiceClick = this.handleChoiceClick.bind(this);
        this.rewindHere = this.rewindHere.bind(this);
        this.state = {choices: this.props.choices || [], chosenOneChoice: false};
    }

    handleChoiceClick(passageId, choiceId, conditions, events) {
        this.props.handleChoiceClick(passageId, this.props.id, choiceId, events);
        this.setState({chosenOneChoice: true});
    }

    rewindHere(){
        this.props.rewindHere(this.props.id);
    }

    shouldComponentUpdate(nextProps, nextState) {
      return this.state.chosenOneChoice != nextState.chosenOneChoice || this.props.passageToSave != nextProps.passageToSave;
    }

    componentDidMount() {
    }

    render() {
        var choices = this.state.choices.map(function(choice, index) {
            return <Choice {...choice}
                    attributes={this.props.attributes}
                    chosenChoice={this.props.choiceId === choice.id}
                    key={choice.id}
                    passageId={choice.linkTo.id}
                    isBeingLoaded={this.props.isBeingLoaded}
                    handleChoiceClick={this.handleChoiceClick}
                    chosenOneChoice={this.state.chosenOneChoice}/>;
        }.bind(this));
        var title = (this.props.name) ? <h1>{this.props.name}</h1> : '';
        var author = (this.props.author) ? <h3>By {this.props.author}</h3> : '';
        var rewindBtn = (this.props.passageToSave) ? <span className="glyphicon glyphicon-repeat passage-rewind" data-toggle="tooltip" title="Rewind" onClick={this.rewindHere}></span> : '';
        return (
            <div className='row'>
            <div className='read-passage col-md-6 col-md-offset-3'>
                {rewindBtn}
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