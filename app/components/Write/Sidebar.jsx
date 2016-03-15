import React from 'react';
import ReactDOM from 'react-dom';

class Sidebar extends React.Component {
    componentDidMount(){
        if (typeof(window) != undefined){
            $('#sidebar-wrapper').height($(window).outerHeight());
            $( window ).resize(function() {
                $('#sidebar-wrapper').height($('.main-content').outerHeight());
            });
        }
    }

    render() {
        return (
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li>
                        <a href="#">Options</a>
                    </li>
                    <li>
                        <a href="#">Attributes</a>
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

export default Sidebar;