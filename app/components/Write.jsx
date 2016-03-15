import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Graph from './Write/Graph';
import Sidebar from './Write/Sidebar';

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
  handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <Sidebar/>
                <div className='main-content container write-container'>
                    <Graph/>
                </div>
            </div>
        )
    }
}

export default Write;