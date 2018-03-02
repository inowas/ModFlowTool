import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import '../../less/4TileTool.less';
import image from '../images/T13B.png';

import {Background, ChartT13B as Chart, InfoT13B as Info, SettingsT13B as Settings, ParametersT13B as Parameters} from '../components';
import {WebData, LayoutComponents} from '../../core';

import Icon from '../../components/primitive/Icon';
import Navbar from '../../containers/Navbar';
import Accordion from '../../components/primitive/Accordion';
import AccordionItem from '../../components/primitive/AccordionItem';
import Input from '../../components/primitive/Input';
import Select from '../../components/primitive/Select';
import Button from '../../components/primitive/Button';
import {Modifier as Dashboard} from '../../dashboard';

import {each} from 'lodash';
import {getInitialState} from '../reducers/T13B';
import applyParameterUpdate from '../../core/simpleTools/parameterUpdate';
import styleGlobals from 'styleGlobals';
import uuid from 'uuid';

const styles = {
    heading: {
        borderBottom: '1px solid ' + styleGlobals.colors.graySemilight,
        fontWeight: 300,
        fontSize: 16,
        textAlign: 'left',
        paddingBottom: 10
    }
};

const buildPayload = (state) => {
    return {
        parameters: state.parameters.map(v => {
            return {
                id: v.id,
                max: v.max,
                min: v.min,
                value: v.value,
            };
        }),
        tool: state.tool
    };
};

const navigation = [{
    name: 'Documentation',
    path: 'https://wiki.inowas.hydro.tu-dresden.de/t13-travel-time-through-unconfined-aquifer/',
    icon: <Icon name="file"/>
}];

class T13B extends React.Component {

    constructor(props) {
        super(props);
        this.state = getInitialState(this.constructor.name);
    }

    componentWillMount() {
        if (this.props.params.id) {
            this.props.getToolInstance(this.props.params.id);
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(function(prevState) {
            return {
                ...prevState,
                ...newProps.toolInstance,
            };
        });
    }

    save = () => {
        const {id} = this.props.params;
        const {routes, params} = this.props;
        const {name, description} = this.state;

        if (id) {
            this.props.updateToolInstance(id, name, description, this.state.public, buildPayload(this.state));
            return;
        }

        this.props.createToolInstance(uuid.v4(), name, description, this.state.public, buildPayload(this.state), routes, params);
    };

    updateSettings(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                settings: {
                    ...prevState.settings,
                    selected: value
                }

            };
        });
    }

    updateParameter(updatedParam) {
        const parameters = this.state.parameters.map(p => {
            if (p.id === updatedParam.id) {
                return applyParameterUpdate(p, updatedParam);
            }

            return p;
        });

        this.setState(prevState => {
            return {
                ...prevState,
                parameters
            };
        });
    }

    handleInputChange = name => {
        return value => {
            this.setState(prevState => {
                return {
                    ...prevState,
                    [name]: value
                };
            });
        };
    };

    handleSelectChange = name => {
        return data => {
            this.handleInputChange(name)(data ? data.value : undefined);
        };
    };

    handleChange = (e) => {
        if (e.target.name === 'settings') {
            this.updateSettings(Number(e.target.value));
        }

        if (e.target.name.startsWith('parameter')) {
            const param = e.target.name.split('_');

            const parameter = {};
            parameter.id = param[1];
            parameter[param[2]] = e.target.value;

            this.updateParameter(parameter);
        }
    };

    handleReset = () => {
        this.setState(getInitialState());
    };

    render() {
        const {settings, parameters, name, description} = this.state;
        const {getToolInstanceStatus, updateToolInstanceStatus, createToolInstanceStatus} = this.props;
        const {id} = this.props.params;
        const readOnly = false;

        const chartParams = {};
        each(parameters, v => {
            chartParams[v.id] = v.value;
        });
        chartParams.settings = settings.selected;

        const infoParams = {};
        each(parameters, v => {
            infoParams[v.id] = v.value;
        });
        infoParams.settings = settings.selected;

        const heading = (
            <div className="grid-container">
                <div className="col stretch parameters-wrapper">
                    <Input
                        type="text"
                        disabled={readOnly}
                        name="name"
                        value={name}
                        onChange={this.handleInputChange('name')}
                        placeholder="Name"
                    />
                </div>
                <div className="col col-rel-0-5">
                    <WebData.Component.Loading status={id ? updateToolInstanceStatus : createToolInstanceStatus}>
                        <Button type={'accent'} onClick={this.save}>
                            Save
                        </Button>
                    </WebData.Component.Loading>
                </div>
            </div>
        );

        return (
            <div className="app-width">
                <Navbar links={navigation}/>
                <h3 style={styles.heading}>
                    T13B. Aquifer system with a flow divide within of the system
                </h3>
                <WebData.Component.Loading status={getToolInstanceStatus}>
                    <div className="grid-container">
                        <div className="tile col stretch">
                            <Accordion firstActive={null}>
                                <AccordionItem heading={heading}>
                                    <LayoutComponents.InputGroup label="Visibility">
                                        <Select
                                            disabled={readOnly}
                                            clearable={false}
                                            value={this.state.public}
                                            onChange={this.handleSelectChange(
                                                'public'
                                            )}
                                            options={[
                                                {label: 'public', value: true},
                                                {label: 'private', value: false}
                                            ]}
                                        />
                                    </LayoutComponents.InputGroup>
                                    <LayoutComponents.InputGroup label="Description">
                                        <Input
                                            type="textarea"
                                            disabled={readOnly}
                                            name="description"
                                            value={description}
                                            onChange={this.handleInputChange('description')}
                                            placeholder="Description"
                                        />
                                    </LayoutComponents.InputGroup>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                    <div className="grid-container">
                        <section className="tile col col-abs-2 stacked">
                            <Background image={image}/>
                        </section>

                        <section className="tile col col-abs-3 stretch" >
                            <Chart {...chartParams}/>
                        </section>
                    </div>

                    <div className="grid-container">
                        <section className="tile col col-abs-2 stacked">
                            <Settings value={settings.selected} handleChange={this.handleChange} {...chartParams}/>
                            <Info {...infoParams}/>
                        </section>

                    <section className="tile col col-abs-3 stretch">
                            <Parameters
                                settings={settings}
                                parameters={parameters}
                                handleChange={this.handleChange}
                                handleReset={this.handleReset}
                            />
                        </section>
                    </div>
                </WebData.Component.Loading>
            </div>
        );
    }
}

const actions = {
    createToolInstance: Dashboard.Command.createToolInstance,
    getToolInstance: Dashboard.Query.getToolInstance,
    updateToolInstance: Dashboard.Command.updateToolInstance,
};

const mapStateToProps = (state) => {
    return {
        toolInstance: state.T13B
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const tool = props.route.tool;
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

T13B.propTypes = {
    createToolInstance: PropTypes.func,
    getToolInstance: PropTypes.func,
    createToolInstanceStatus: PropTypes.object,
    getToolInstanceStatus: PropTypes.object,
    params: PropTypes.object,
    routes: PropTypes.array,
    updateToolInstance: PropTypes.func,
    updateToolInstanceStatus: PropTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(T13B));
