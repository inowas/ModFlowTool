import React from 'react';
import PropTypes from 'prop-types';
import ConfiguredRadium from 'ConfiguredRadium';
import {connect} from 'react-redux';
import styleGlobals from 'styleGlobals';
import {withRouter} from 'react-router';
import * as lodash from 'lodash';
import {Command, Query} from '../../t03/actions';
import {Routing} from '../actions/index';
import Mt3dms from '../../core/modflow/mt3d/mt3dms';
import MtPackageProperties from '../components/packages/mt/mtPackageProperties';
import AbstractMt3dPackage from '../../core/modflow/mt3d/AbstractMt3dPackage';
import BtnPackageProperties from '../components/packages/mt/btnPackageProperties';
import AdvPackageProperties from '../components/packages/mt/advPackageProperties';
import DspPackageProperties from '../components/packages/mt/dspPackageProperties';
import GcgPackageProperties from '../components/packages/mt/gcgPackageProperties';
import SsmPackageProperties from '../components/packages/mt/ssmPackageProperties';
import Stressperiods from '../../core/modflow/Stressperiods';
import {Button, Grid, Icon, Menu, Message, Transition} from 'semantic-ui-react';

const styles = {
    container: {
        display: 'flex',
        maxHeight: '100%'
    },

    left: {
        width: styleGlobals.dimensions.gridColumn,
        marginRight: styleGlobals.dimensions.gridGutter,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%'
    },

    properties: {
        flex: 1
    },

    searchWrapper: {
        marginBottom: 6
    },

    heading: {
        borderBottom: '1px solid ' + styleGlobals.colors.graySemilight,
        fontWeight: 300,
        fontSize: 16,
        textAlign: 'left',
        paddingBottom: 10,
        marginTop: 30
    },

    buttonFix: {
        width: 'auto',
        height: 'auto'
    },

    gridFix: {
        width: '99%'
    },

    msgFix: {
        paddingTop: '6.929px',
        paddingBottom: '6.929px',
        fontSize: '1rem',
        textAlign: 'center'
    }
};

const sideBar = [
    {
        id: undefined,
        name: 'Overview (MT-Package)'
    },
    {
        id: 'btn',
        name: 'Basic transport package'
    },
    {
        id: 'adv',
        name: 'Advection package'
    },
    {
        id: 'dsp',
        name: 'Dispersion package'
    },
    {
        id: 'ssm',
        name: 'Source/Sink Package'
    },
    {
        id: 'gcg',
        name: 'Matrix solver package'
    }
];

const EDITSTATE_NOCHANGES = 0;
const EDITSTATE_UNSAVED = 1;
const EDITSTATE_SAVED = 2;

class ModelEditorTransport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mt3dms: this.props.model.mt3dms || Mt3dms.fromDefaults().toObject,
            editState: EDITSTATE_NOCHANGES
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.model.mt3dms) {
            this.state = {
                mt3dms: nextProps.model.mt3dms
            };
        }
    }

    handleOnSave = () => {
        this.setState({
            editState: EDITSTATE_SAVED
        });
        return this.props.updateMt3dms(
            this.props.model.id,
            Mt3dms.fromObject(this.state.mt3dms)
        );
    };

    handleChangePackage = (p) => {
        if (p instanceof AbstractMt3dPackage) {
            const newMt3dms = Mt3dms.fromObject(this.state.mt3dms);
            newMt3dms.addPackage(p);
            return this.setState({
                mt3dms: newMt3dms.toObject,
                editState: EDITSTATE_UNSAVED
            });
        }

        throw new Error('Package hat to be instance of AbstractMt3dPackage');
    };

    loadBoundaryDetails = (boundaryId) => {
        const {model, getBoundary} = this.props;
        return getBoundary(model.id, boundaryId);
    };

    handleToggleEnabled = () => {
        const changedMt3dms = Mt3dms.fromObject(this.state.mt3dms);
        changedMt3dms.toggleEnabled();
        return this.setState({
            mt3dms: changedMt3dms.toObject,
            editState: EDITSTATE_UNSAVED
        });
    };

    onMenuClick = (type) => {
        const {routes, params} = this.props;
        Routing.transportType(routes, params)(type);
    };

    renderProperties() {
        if (!this.state.mt3dms || !this.props.model) {
            return null;
        }

        const mt3d = Mt3dms.fromObject(this.state.mt3dms);

        const {model} = this.props;
        if (!model.stress_periods) {
            return null;
        }

        const stressPeriods = Stressperiods.fromObject(model.stress_periods);

        if (!model.boundaries) {
            return null;
        }

        const boundaries = model.boundaries;
        const readOnly = !lodash.includes(model.permissions, 'w');
        const {type} = this.props.params;

        switch (type) {
            case 'adv':
                return (
                    <AdvPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'btn':
                return (
                    <BtnPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'dsp':
                return (
                    <DspPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'gcg':
                return (
                    <GcgPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        onChange={this.handleChangePackage}
                        readonly={readOnly}
                    />
                );
            case 'ssm':
                return (
                    <SsmPackageProperties
                        mtPackage={mt3d.getPackage(type)}
                        boundaries={boundaries}
                        stressPeriods={stressPeriods}
                        onChange={this.handleChangePackage}
                        onSelectBoundary={this.loadBoundaryDetails}
                        readonly={readOnly}
                    />
                );
            default:
                return (
                    <MtPackageProperties
                        mtPackage={mt3d.getPackage('mt')}
                        onChange={this.handleChangePackage}
                        enabled={mt3d.enabled}
                        toggleEnabled={this.handleToggleEnabled}
                        readonly={readOnly}
                    />
                );
        }
    }

    renderSidebar = () => {
        const {type} = this.props.params;

        return (
            <div style={styles.left}>
                <Menu fluid vertical tabular>
                    { sideBar.map((item, key) => (
                        <Menu.Item
                            key={key}
                            name={item.name}
                            active={type === item.id}
                            onClick={() => this.onMenuClick(item.id)}
                        />
                    ))}
                </Menu>
            </div>
        );
    };

    render() {
        const readonly = !lodash.includes(this.props.model.permissions, 'w');
        return (
            <div style={[styles.container]}>
                {this.renderSidebar()}
                <div style={styles.properties}>
                    <div style={[styles.columnFlex2]}>
                        <Grid style={styles.gridFix}>
                            <Grid.Row columns={3}>
                                <Grid.Column/>
                                <Grid.Column>
                                    {this.state.editState === EDITSTATE_UNSAVED &&
                                    <Message warning style={styles.msgFix}>Changes not saved!</Message>
                                    }
                                    <Transition visible={this.state.editState === EDITSTATE_SAVED} animation="drop" duration={500}>
                                        <Message positive style={styles.msgFix}>Changes saved!</Message>
                                    </Transition>
                                </Grid.Column>
                                <Grid.Column textAlign="right">
                                    <Button icon positive
                                        style={styles.buttonFix}
                                        labelPosition="left"
                                        onClick={this.handleOnSave}
                                        disabled={readonly}
                                    >
                                        <Icon name="save"/>
                                        Save
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    {this.renderProperties()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, {tool}) => {
    return {
        model: state[tool].model
    };
};

const actions = {
    getBoundary: Query.getBoundary,
    updateMt3dms: Command.updateMt3dms
};

const mapDispatchToProps = (dispatch, {tool}) => {
    const wrappedActions = {};
    for (const key in actions) {
        if (actions.hasOwnProperty(key)) {
            // eslint-disable-next-line no-loop-func
            wrappedActions[key] = function() {
                const args = Array.prototype.slice.call(arguments);
                dispatch(actions[key](tool, ...args));
            };
        }
    }

    return wrappedActions;
};

ModelEditorTransport.propTypes = {
    tool: PropTypes.string,
    model: PropTypes.object,
    params: PropTypes.object.isRequired,
    routes: PropTypes.array,
    getBoundary: PropTypes.func.isRequired,
    updateMt3dms: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfiguredRadium(ModelEditorTransport)));
