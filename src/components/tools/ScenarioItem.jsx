import React from 'react';

import '../../less/scenarioSelect.less';
import Icon from '../primitive/Icon';
import { Link } from 'react-router';

export default class ScenarioItem extends React.Component {

    static propTypes = {
        scenario: React.PropTypes.object.isRequired,
        toggleSelection: React.PropTypes.func.isRequired
    }

    toggleSelection = ( ) => {
        this.props.toggleSelection( this.props.scenario.id );
    }

    render( ) {
        const { scenario, toggleSelection } = this.props;
        const { name, description, selected, modelId } = scenario;
        return (
            <div className="item" data-selected={selected} onClick={toggleSelection}>
                <button className="toggle"><Icon name={selected
                ? 'checked'
                : 'unchecked'}/></button>
                <div className="content">
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <Link to={'/tools/T07E/' + modelId}>Edit</Link>
                </div>
            </div>
        );
    }

}
