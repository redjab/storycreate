import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

var products = [
{
    id: 1,
    name: "Product1",
    price: 120
},{
    id: 2,
    name: "Product2",
    price: 80
},{
    id: 3,
    name: "Product3",
    price: 207
},{
    id: 4,
    name: "Product4",
    price: 100
},{
    id: 5,
    name: "Product5",
    price: 150
},{
    id: 6,
    name: "Product6",
    price: 160
}
];


function onAfterSaveCell(row, cellName, cellValue){
  console.log("Save cell '"+cellName+"' with value '"+cellValue+"'");
  console.log("Thw whole row :");
  console.log(row);
}
var cellEditProp = {
  mode: "click",
  blurToSave: true,
  afterSaveCell: onAfterSaveCell
}

class AttributeSidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="attribute-sidebar-wrapper" className="sidebar">
                <ul className="sidebar-nav">
                    <li>
                        <a href="#" onClick={this.props.onClickAttribute.bind(this)}>&lt;&lt; Attributes</a>
                    </li>
                </ul>
                <p>
                    <Link to='/tutorial#terms'>What are attributes?</Link>
                </p>
                <BootstrapTable data={products} cellEdit={cellEditProp}>
                    <TableHeaderColumn dataField="id" isKey={true} hidden={true}>Attribute ID</TableHeaderColumn>
                    <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="price">Default</TableHeaderColumn>
                    <TableHeaderColumn dataField="price">Type</TableHeaderColumn>
                    <TableHeaderColumn dataField="price">Persistent</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    }
}

export default AttributeSidebar;