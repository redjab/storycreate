import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Graph from './Write/Graph';
import Sidebar from './Write/Sidebar';
import AttributeSidebar from './Write/AttributeSidebar';

var data = {
    "metadata":
    {
        "id": 1,
        "title": "Title",
        "author": "Author",
        "description": "A test story",
        "created": "01/26/2016",
        "updated": "01/26/2016",
        "options":
        {
            "allowSave": true,
            "publish": true
        }
    },
    "content":
    {
        "start": "uuid",
        "attribute":
        [
            {
                "name": "luck",
                "dataType": "int",
                "default": 0,
                "persistent": false,
            }
        ],
        "passages":
        [
            {
                "id": "uuid",
                "title": "untitled",
                "text": "This is a test passage",
                "events":
                [
                    {
                        "attribute": "uuid",
                        "operator": "=",
                        "value": "True"
                    },
                    {
                        "attribute": "uuid",
                        "operator": "+",
                        "value": "1"
                    }
                ],
                "choices":
                [
                    {
                        "id": "uuid",
                        "text": "Choice one",
                        "linkTo":
                        [
                            {
                                "id": "uuid",
                                "conditions": ["luck > 1", "luck > 2"],
                                "events": ["luck + 1", "luck + 2"]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

class Write extends React.Component {
    constructor(props) {
        super(props);
        this.onClickAttribute = this.onClickAttribute.bind(this);
        this.state = {hiddenAttr: true};
    }

    componentDidMount() {
        console.log(this._graph);
        console.log($(ReactDOM.findDOMNode(this._graph)).width());
    }

    onClickAttribute(event){
        event.preventDefault();
        this.setState({hiddenAttr: !this.state.hiddenAttr});
    }

    render() {
        return (
            <div>
                <div className={this.state.hiddenAttr ? "hidden" : ""}>
                    <AttributeSidebar onClickAttribute={this.onClickAttribute}/>
                </div>
                <Sidebar onClickAttribute={this.onClickAttribute}/>
                <div className='main-content container write-container'>
                    <Graph ref={(callback) => this._graph = callback}/>
                </div>
            </div>
        )
    }
}

export default Write;