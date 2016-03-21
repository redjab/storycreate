import React from 'react';
import ReactDOM from 'react-dom';

class Sidebar extends React.Component {
    render() {
        return (
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li>
                        <a href="#">Options</a>
                    </li>
                    <li>
                        <a href="#" onClick={this.props.onClickAttribute.bind(this)}>Attributes</a>
                    </li>
                    <li>
                        <a href="#">Preview</a>
                    </li>
                    <li>
                        <a href="#">Publish</a>
                    </li>
                    <li>
                        <a href="#">Save</a>
                    </li>
                    <hr/>
                    <div className="input-group">
                        <input type="text" className="form-control search-input" placeholder="Search Passages" value=""/>
                        <span className="input-group-btn">
                            <button className="btn btn-default"><span className="glyphicon glyphicon-search"></span></button>
                        </span>
                    </div>
                </ul>
            </div>
        )
    }
}

class AttributePanel extends React.Component {
    render(){
        return(
            <div>
            </div>
        )
    }
}

export default Sidebar;