import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import PassageChoice, {Choice} from './Write/PassageChoice';
import Constants from './Constants';
import Quill from 'quill';
import Graph from './Write/Graph';

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
            <div className='main-content container'>
                <Graph/>
            </div>
        )
    }
}

class QuillEditor extends React.Component {
    componentDidMount(){
        $(".ql-format-button").on('mousemove', function(e) {
           e.preventDefault();
        });
    }

    render() {
        return (
            <div className="quill-wrapper">
            <div id="toolbar-passage" className="toolbar">
                <span className="ql-format-group">
                    <span title="Bold" className="ql-format-button ql-bold"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Italic" className="ql-format-button ql-italic"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Underline" className="ql-format-button ql-underline"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Strikethrough" className="ql-format-button ql-strike"></span>
                </span>
                <span className="ql-format-group">
                    <span title="List" className="ql-format-button ql-list"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Bullet" className="ql-format-button ql-bullet"></span>
                    <span className="ql-format-separator"></span>
                </span>
                <span className="ql-format-group">
                    <span title="Link" className="ql-format-button ql-link"></span>
                    <span className="ql-format-separator"></span>
                    <span title="Image" className="ql-format-button ql-image"></span>
                </span>
            </div>
            <div id="quill-passage">
            </div>
            </div>
        )
    }
}

export default Write;