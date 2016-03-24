import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Constants from './Constants';
import _ from 'lodash';
import joint from 'jointjs';

class AttributeSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {attributes: []};
        this.handleAddRow = this.handleAddRow.bind(this);
    }

    componentDidMount() {
        this.attributeData = JSON.parse(localStorage.getItem(Constants.DEFAULT_ATTR_DATA)) || {attributes: []};
        this.setState({attributes: this.attributeData.attributes});
    }

    onAfterSaveCell(row, cellName, cellValue){
        var attribute = _.find(this.attributeData.attributes, { 'id': row.id });
        attribute.name = row.name;
        attribute.default = row.default;
        attribute.persistent = row.persistent;
        this.saveStoryLocal();
    }

    onAfterDeleteRow(rowKeys){
        _.remove(this.attributeData.attributes, function(n){
            return _.includes(rowKeys, n.id)
        }, this);
        this.saveStoryLocal();
    }

    onAfterInsertRow(row){
        var newAttribute = {
            id: row.id,
            name: row.name,
            default: row.default,
            persistent: row.persistent
        }
        this.attributeData.attributes.push(newAttribute);
        this.saveStoryLocal();
    }

    handleAddRow(e){
        e.preventDefault();

        var defaultRow = {
            id: joint.util.uuid(),
            name: "",
            default: "",
            persistent: "No",
        }
        if (this._table){
            if (this.state.attributes.length === 0){
                this._table.handleAddRowAtBegin(defaultRow);
            } else {
                this._table.handleAddRow(defaultRow);
            }
        }
    }

    saveStoryLocal() {
        localStorage.setItem(Constants.DEFAULT_ATTR_DATA, JSON.stringify(this.attributeData));
    }

    render() {
        var tableOptions = {
            afterInsertRow: this.onAfterInsertRow.bind(this),
            afterDeleteRow: this.onAfterDeleteRow.bind(this)
        }
        var cellEditProp = {
            mode: "click",
            blurToSave: true,
            afterSaveCell: this.onAfterSaveCell.bind(this)
        }
        return (
            <div id="attribute-sidebar-wrapper" className="sidebar">
                <ul className="sidebar-nav">
                    <li>
                        <a href="#" onClick={this.props.onClickAttribute.bind(this)}>&lt;&lt; Attributes</a>
                    </li>
                </ul>
                <p>
                    <Link to='/tutorial#terms' target="_blank">What are attributes?</Link>
                </p>
                <button type="button" className="btn btn-sm btn-success pull-right" onClick={this.handleAddRow.bind(this)}>Add Attribute</button>
                <BootstrapTable
                ref={(callback) => this._table = callback}
                striped={true}
                data={this.state.attributes}
                cellEdit={cellEditProp}
                deleteRow={true}
                selectRow={selectRowProp}
                options={tableOptions}>
                    <TableHeaderColumn dataField="id" isKey={true} hidden={true} autoValue={true}>Attribute ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="default">Default</TableHeaderColumn>
                    <TableHeaderColumn dataField="persistent" editable={persistentOption}>Persistent</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}

var persistentOption = {
    type: 'checkbox',
    options: {
        values: 'Yes:No'
    }
}
var selectRowProp = {
  mode: "checkbox", // or checkbox
  clickToSelect: true
};

export default AttributeSidebar;