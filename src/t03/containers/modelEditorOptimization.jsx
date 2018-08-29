import React from 'react';
import PropTypes from 'prop-types';
import ConfiguredRadium from 'ConfiguredRadium';
import {connect} from 'react-redux';
import styleGlobals from 'styleGlobals';
import {withRouter} from 'react-router';
import OptimizationObjectsComponent from '../components/optimization/optimizationObjects';
import OptimizationObjectivesComponent from '../components/optimization/optimizationObjectives';
import OptimizationParametersComponent from '../components/optimization/optimizationParameters';
import OptimizationConstraintsComponent from '../components/optimization/optimizationConstraints';
import OptimizationResultsComponent from '../components/optimization/optimizationResults';
import {Routing} from '../actions/index';
import Optimization from '../../core/optimization/Optimization';
import Stressperiods from '../../core/modflow/Stressperiods';
import {Button, Menu, Progress} from 'semantic-ui-react';
import {Action, Command} from '../actions';
import {
    OPTIMIZATION_STATE_NEW,
    OPTIMIZATION_STATE_CALCULATING,
    OPTIMIZATION_STATE_CANCELLED,
    OPTIMIZATION_STATE_CANCELLING,
    OPTIMIZATION_STATE_FINISHED,
    OPTIMIZATION_STATE_STARTED
} from '../selectors/optimization';

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
    }
};

class ModelEditorOptimization extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optimization: this.props.optimization,
            activeItem: this.props.params.type ? this.props.params.type : 'parameters'
        };
    }

    componentWillReceiveProps() {
        this.setState((prevState, props) => ({
            optimization: props.optimization
        }));
    }

    onMenuClick = (e, {name}) => {
        const {routes, params} = this.props;
        this.setState({
            activeItem: name
        });

        Routing.modelOptimizationType(routes, params)(name);
    };

    onCancelCalculationClick = () => {
        this.setState({
            optimization: {
                ...this.state.optimization,
                state: 11
            }
        });

        this.props.cancelOptimizationCalculation(
            this.props.model.id,
            Optimization.fromObject(this.state.optimization)
        );
    };

    onCalculationClick = () => {
        this.onMenuClick(null, {name: 'results'});

        this.setState({
            optimization: {
                ...this.state.optimization
            },
            activeItem: 'results'
        });

        this.props.calculateOptimization(
            this.props.model.id,
            Optimization.fromObject(this.state.optimization)
        );
    };

    onChange = (obj) => {
        const opt = Optimization.fromObject(this.state.optimization);
        opt.input[obj.key] = obj.value;
        this.setState({
            optimization: opt.toObject
        });

        return this.props.updateOptimizationInput(
            this.props.model.id,
            opt.input.toObject
        );
    };

    onChangeResult = (obj) => {
        const opt = Optimization.fromObject(this.state.optimization);
        opt[obj.key] = obj.value;
        this.setState({
            optimization: opt.toObject
        });
    };

    renderProperties() {
        if (!this.props.model) {
            return null;
        }

        const {model} = this.props;
        if (!model.stress_periods) {
            return null;
        }

        const {type} = this.props.params;
        const optimization = Optimization.fromObject(this.state.optimization);
        const stressPeriods = Stressperiods.fromObject(model.stress_periods);

        switch (type) {
            case 'objects':
                return (
                    <OptimizationObjectsComponent objects={optimization.input.objects} model={this.props.model}
                                                  stressPeriods={stressPeriods} onChange={this.onChange}/>
                );
            case 'objectives':
                return (
                    <OptimizationObjectivesComponent objectives={optimization.input.objectives} model={this.props.model}
                                                     objects={optimization.input.objects} onChange={this.onChange}/>
                );
            case 'constraints':
                return (
                    <OptimizationConstraintsComponent constraints={optimization.input.constraints}
                                                      model={this.props.model}
                                                      objects={optimization.input.objects} onChange={this.onChange}/>
                );
            case 'results':
                return (
                    <OptimizationResultsComponent optimization={optimization} onChange={this.onChangeResult}/>
                );
            default:
                return (
                    <OptimizationParametersComponent parameters={optimization.input.parameters}
                                                     objectives={optimization.input.objectives}
                                                     onChange={this.onChange}/>
                );
        }
    }

    render() {
        if (!this.state.optimization) {
            return null;
        }
        return (
            <div style={[styles.container]}>
                <div style={styles.left}>
                    <Menu fluid vertical tabular>
                        <Menu.Item
                            name="parameters"
                            active={this.state.activeItem === 'parameters'}
                            onClick={this.onMenuClick}/>
                        <Menu.Item
                            name="objects"
                            active={this.state.activeItem === 'objects'}
                            onClick={this.onMenuClick}/>
                        <Menu.Item
                            name="objectives"
                            active={this.state.activeItem === 'objectives'}
                            onClick={this.onMenuClick}
                        />
                        <Menu.Item
                            name="constraints"
                            active={this.state.activeItem === 'constraints'}
                            onClick={this.onMenuClick}
                        />
                        <Menu.Item>
                            {this.state.optimization.state === OPTIMIZATION_STATE_NEW ||
                             this.state.optimization.state === OPTIMIZATION_STATE_CANCELLED ||
                             this.state.optimization.state === OPTIMIZATION_STATE_FINISHED
                                ?
                                <Button fluid primary
                                        onClick={this.onCalculationClick}
                                >
                                    Run Optimization
                                </Button>
                                :
                                <Button fluid
                                        color="red"
                                        onClick={this.onCancelCalculationClick}
                                >
                                    Cancel Calculation
                                </Button>
                            }
                        </Menu.Item>
                        {this.state.optimization.state === OPTIMIZATION_STATE_CANCELLED &&
                        <Menu.Item>
                            <Progress percent={0}>
                                Cancelled
                            </Progress>
                        </Menu.Item>
                        }
                        {this.state.optimization.state === OPTIMIZATION_STATE_STARTED &&
                        <Menu.Item>
                            <Progress percent={25} indicating>
                                Starting
                            </Progress>
                        </Menu.Item>
                        }
                        {this.state.optimization.state === OPTIMIZATION_STATE_CALCULATING &&
                        <Menu.Item>
                            <Progress percent={50} indicating>
                                Calculating
                            </Progress>
                        </Menu.Item>
                        }
                        {this.state.optimization.state === OPTIMIZATION_STATE_CANCELLING &&
                        <Menu.Item>
                            <Progress percent={75} indicating>
                                Cancelling
                            </Progress>
                        </Menu.Item>
                        }
                        {this.state.optimization.state === OPTIMIZATION_STATE_FINISHED &&
                        <Menu.Item>
                            <Progress percent={100}>
                                Finished
                            </Progress>
                        </Menu.Item>
                        }
                        <Menu.Item
                            name="results"
                            active={this.state.activeItem === 'results'}
                            onClick={this.onMenuClick}
                        />
                    </Menu>
                </div>
                <div style={styles.properties}>
                    <div style={[styles.columnFlex2]}>
                        {this.renderProperties()}
                    </div>
                </div>
            </div>
        );
    }
}

const actions = {
    setOptimization: Action.setOptimization,
    updateOptimizationInput: Command.updateOptimizationInput,
    calculateOptimization: Command.calculateOptimization,
    cancelOptimizationCalculation: Command.cancelOptimizationCalculation
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

const mapStateToProps = (state, {tool}) => {
    return {
        model: state[tool].model,
        optimization: state[tool].model.optimization
    };
};

ModelEditorOptimization.propTypes = {
    tool: PropTypes.string,
    model: PropTypes.object,
    optimization: PropTypes.object,
    params: PropTypes.object,
    routes: PropTypes.array,
    setOptimization: PropTypes.func.isRequired,
    updateOptimizationInput: PropTypes.func.isRequired,
    calculateOptimization: PropTypes.func.isRequired,
    cancelOptimizationCalculation: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfiguredRadium(ModelEditorOptimization)));