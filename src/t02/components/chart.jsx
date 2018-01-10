import React from 'react';
import PropTypes from 'prop-types';
import {mounding} from 'gwflowjs';
import {pure} from 'recompose';

import '../../less/toolDiagram.less';

import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

const calculateDiagramData = (variable, w, L, W, hi, Sy, K, t, min, max, stepSize) => {
    const data = [];
    if (variable === 'x') {
        for (let x = min; x < max; x += stepSize) {
            data.push({x: x / 2, hhi: mounding.calculateHi(x, 0, w, L, W, hi, Sy, K, t)});
        }

        data.push({x: max / 2, hhi: mounding.calculateHi(max, 0, w, L, W, hi, Sy, K, t)});
    } else {
        for (let y = min; y < max; y += stepSize) {
            data.push({y: y / 2, hhi: mounding.calculateHi(0, y, w, L, W, hi, Sy, K, t)});
        }

        data.push({y: max / 2, hhi: mounding.calculateHi(0, max, w, L, W, hi, Sy, K, t)});
    }

    return data;
};

const calculateChartXMax = (variable, w, L, W, hi, Sy, K, t) => {
    if (variable === 'x') {
        for (let x = 0; x < 10000; x += 10) {
            const result = mounding.calculateHi(x, 0, w, L, W, hi, Sy, K, t);
            if (result <= 0.01) {
                return x;
            }
        }
        return 0;
    }

    for (let y = 0; y < 10000; y += 10) {
        const result = mounding.calculateHi(0, y, w, L, W, hi, Sy, K, t);
        if (result <= 0.01) {
            return y;
        }
    }

    return 0;
};

const Chart = ({settings, w, L, W, hi, Sy, K, t}) => {
    const variable = settings.variable;

    let chartXMaxFromBasin = 2 * L;
    if (variable === 'x') {
        chartXMaxFromBasin = 2 * W;
    }

    let chartXMax;
    const chartXMaxFromCurve = calculateChartXMax(variable, w, L, W, hi, Sy, K, t);
    if (chartXMaxFromCurve < chartXMaxFromBasin) {
        chartXMax = chartXMaxFromBasin;
    } else {
        chartXMax = chartXMaxFromCurve;
    }

    const data = calculateDiagramData(variable, w, L, W, hi, Sy, K, t, 0, chartXMax, Math.ceil(chartXMax / 10));
    const hMax = data[0].hhi + hi;

    let xAxis = <XAxis type="number" dataKey="y"/>;
    let xLabel = 'y (m)';
    let rLabel = 'L/2';

    if (variable === 'x') {
        xAxis = <XAxis type="number" dataKey="x"/>;
        xLabel = 'x (m)';
        rLabel = 'W/2';
    }

    return (
        <div>
            <h2>Calculation</h2>
            <div className="grid-container">
                <div className="col stretch">
                    <div className="diagram">
                        <ResponsiveContainer width={'100%'} aspect={2.0}>
                            <LineChart data={data} margin={{
                                top: 20,
                                right: 40,
                                left: 40,
                                bottom: 0
                            }}
                            >
                                {xAxis}
                                <YAxis type="number"/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Line
                                    isAnimationActive={false}
                                    type="basis"
                                    dataKey={'hhi'}
                                    stroke="#1EB1ED"
                                    strokeWidth="5" dot={false}
                                />
                                <ReferenceLine x={chartXMaxFromBasin / 4} stroke="black" strokeWidth="3" label={rLabel}
                                               dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="diagram-ylabels">
                            <p>h - hi (m)</p>
                        </div>
                        <div className="diagram-labels-right">
                            <div className="diagram-label">
                                <p>
                                    h<sub>max</sub>
                                    =
                                    <strong>{hMax.toFixed(2)}</strong>
                                    m
                                </p>
                            </div>
                        </div>
                        <p className="center-vertical center-horizontal">{xLabel}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

Chart.propTypes = {
    settings: PropTypes.object.isRequired,
    w: PropTypes.number.isRequired,
    L: PropTypes.number.isRequired,
    W: PropTypes.number.isRequired,
    hi: PropTypes.number.isRequired,
    Sy: PropTypes.number.isRequired,
    K: PropTypes.number.isRequired,
    t: PropTypes.number.isRequired,
};

export default pure(Chart);
