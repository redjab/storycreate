import React from 'react';
import ReactDOM from 'react-dom';
import Quill from 'quill';

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

export default QuillEditor;