import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import '../../less/4TileTool.less';

import image13A from '../images/intro_13a.png';
import image13B from '../images/intro_13b.png';
import image13C from '../images/intro_13c.png';
import image13D from '../images/intro_13d.svg';
import image13E from '../images/intro_13e.svg';

import Icon from '../../components/primitive/Icon';
import Navbar from '../../containers/Navbar';

export const navigation = [{
    name: 'Documentation',
    path: 'https://inowas.hydro.tu-dresden.de/tools/t13-travel-time-through-unconfined-aquifer/',
    icon: <Icon name="file"/>
}];

class T13 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectTo: null
        };
    }

    componentWillReceiveProps(props) {
        const {toolInstance, params} = props;
        if (params.id && toolInstance && toolInstance.tool) {
            this.redirectTo(toolInstance.tool, params.id);
        }
    }

    redirectTo = (tool, id = null) => {
        if (id) {
            return this.props.router.push('/tools/' + tool + '/' + id);
        }

        return this.props.router.push('/tools/' + tool);
    };

    render() {
        if (this.props.params.id) {
            return null;
        }

        return (
            <div className="app-width">
                <Navbar links={navigation}/>
                <h3>Please select the set of boundary conditions that apply to your problem:</h3>
                <div className="grid-container">
                    <a style={{'cursor': 'pointer'}} onClick={() => this.redirectTo('T13A')}
                       className="tile col col-rel-1-t13 zoom">
                        <div className="div-block">
                            <h1>T13A</h1>
                            <p className="p-height">
                                Aquifer system with one no-flow boundary and one fixed head boundary condition and constant groundwater recharge
                            </p>
                            <div className="center-horizontal center-vertical">
                                <img className="sketch-image" src={image13A} />
                            </div>
                        </div>
                    </a>
                    <a style={{'cursor': 'pointer'}} onClick={() => this.redirectTo('T13B')}
                       className="tile col col-rel-1-t13 zoom">
                        <div className="div-block">
                            <h1>T13B</h1>
                            <p className="p-height">Aquifer system with two fixed head boundary conditions, a flow divide within the system and constant groundwater recharge</p>
                            <div className="center-horizontal center-vertical">
                                <img className="sketch-image" src={image13B}/>
                            </div>
                        </div>
                    </a>
                    <a style={{'cursor': 'pointer'}} onClick={() => this.redirectTo('T13C')}
                       className="tile col col-rel-1-t13 zoom">
                        <div className="div-block">
                            <h1>T13C</h1>
                            <p className="p-height">Aquifer system with two fixed head boundary conditions, a flow divide outside of the system and constant groundwater recharge</p>
                            <div className="center-horizontal center-vertical">
                                <img className="sketch-image" src={image13C}/>
                            </div>
                        </div>
                    </a>
                    <a style={{'cursor': 'pointer'}} onClick={() => this.redirectTo('T13D')}
                       className="tile col col-rel-1-t13 zoom">
                        <div className="div-block">
                            <h1>T13D</h1>
                            <p className="p-height">Aquifer system with two fixed head boundary conditions, constant groundwater recharge but user is not sure whether the flow divide lies within the system</p>
                            <div className="center-horizontal center-vertical">
                                <img className="sketch-image" src={image13D}/>
                            </div>
                        </div>
                    </a>
                    <a style={{'cursor': 'pointer'}} onClick={() => this.redirectTo('T13E')}
                       className="tile col col-rel-1-t13 zoom">
                        <div className="div-block">
                            <h1>T13E</h1>
                            <p className="p-height">Aquifer system with one pumping well at constant rate, no groundwater recharge</p>
                            <div className="center-horizontal center-vertical">
                                <img className="sketch-image" src={image13E}/>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        toolInstance: state.T13
    };
};

T13.propTypes = {
    params: PropTypes.object,
    router: PropTypes.object.isRequired,
    toolInstance: PropTypes.object,
};

export default withRouter(connect(mapStateToProps, null)(T13));
