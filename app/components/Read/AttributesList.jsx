import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

class AttributesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {attributes: this.props.attributes, hidden: false};
        this.toggleView = this.toggleView.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({attributes: nextProps.attributes});
    }

    toggleView(){
        this.setState({hidden: !this.state.hidden});
    }

    render(){
        var attributes = this.state.attributes.map(function(attribute) {
            var concatAttr = <div key={attribute.id} className={classNames({hidden: this.state.hidden})}>
                                {attribute.name} : &nbsp;
                                {attribute.default}
                                {(attribute.persistent == 'Yes') ? ' (persistent)' : ''}
                            </div>
            return concatAttr;
        }.bind(this));
        return(
            <div className='attributes-list'>
                <a onClick={this.toggleView}><h4>Attributes<span className="caret"></span></h4></a>
                {attributes}
            </div>
        )
    }
}

AttributesList.defaultProps = {
    attributes: []
}

export default AttributesList;