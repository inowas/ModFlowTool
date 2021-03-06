/* eslint-disable react/no-multi-comp */
import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';
import {inputType} from '../../inputType';

import '../../less/toolParameters.less';
import '../../less/input-range.less';

import ParameterSlider from '../../core/parameterSlider';

const renderParam = (param, handleChange) => {
    if (!param.inputType) {
        return (<ParameterSlider key={param.id} handleChange={handleChange} param={param}/>);
    }

    switch (param.inputType) {
        case inputType.NUMBER:
            return renderNumber(param, handleChange);
        case inputType.RADIO_SELECT:
            return renderRadioSelect(param, handleChange);
        case inputType.SLIDER:
            return (<ParameterSlider key={param.id} handleChange={handleChange} param={param}/>);
    }

    return null;
};

const renderNumber = (param, handleChange) => {
    return (<tr key={param.id} className="parameter">
        <td className="parameter-label">{param.label}</td>
        <td>
            <input name={'parameter_' + param.id + '_value'} type="number" min={param.min} max={param.max}
                   step={param.stepSize} value={Number(param.value).toFixed(param.decimals)}
                   onChange={handleChange}/>
        </td>
    </tr>);
};


const renderRadioOption = (param, option, handleChange) => {
    return (<label key={option.id}>
        <input name={'parameter_' + param.id + '_value'} value={option.value} type="radio"
               checked={param.value === option.value} onChange={handleChange}/> {option.label}
    </label>);
};

const renderRadioSelect = (param) => {
    const options = param
        .options
        .map(option => {
            return renderRadioOption(param, option);
        });

    return (<tr key={param.id} className="parameter">
        <td className="parameter-label">{param.label}</td>
        <td>{options}</td>
    </tr>);
};

const Parameters = ({parameters, handleChange, handleReset}) => {
    const sortedParameters = parameters.sort((a, b) => {
        if (a.order > b.order) {
            return 1;
        }
        return -1;
    });

    const params = sortedParameters.map(param => {
        return renderParam(param, handleChange);
    });

    return (
        <div className="grid-container">
            <div className="col stretch parameters-wrapper">
                <ul className="nav nav-align-right" role="navigation">
                    <li>
                        <button onClick={handleReset} className="button button-accent">Default</button>
                    </li>
                </ul>
                <table className="parameters">
                    <tbody>
                    {params}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

Parameters.propTypes = {
    handleChange: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    parameters: PropTypes.array.isRequired
};

export default pure(Parameters);
