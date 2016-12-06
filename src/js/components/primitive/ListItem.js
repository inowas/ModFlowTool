import React from "react";
import { showBoundaryProperties } from "../../actions/ApplicationActions"

export default class ListItem extends React.Component {

    sBoundaryProperties(bType) {
        showBoundaryProperties(bType);
    }

    getClassNames(active){
        if (active){
            return "list-group-item active";
        }

        return "list-group-item";
    }

    render() {
        console.log(this.props);
        return (
            <span className={this.getClassNames(this.props.active)} onClick={ this.sBoundaryProperties.bind(this, this.props.type)}>
                {this.props.children}
                <span className="badge">{this.props.boundaries.filter(b => b.type == this.props.type).length}</span>
            </span>
        );
    }
}
