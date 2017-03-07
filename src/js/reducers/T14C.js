import * as calc from '../calculations/T14C';
import applyParameterUpdate from './applyParameterUpdate';

function getInitialState() {
    return {
        background: {
            'image': '/images/tools/T14C.png'
        },
        chart: {
            data: [],
            options: {
                yAxis: {
                    domain: [0, 'auto']
                }
            }
        },
        info: {
            dQ: 0
        },
        parameters: [{
            order: 0,
            id: 'Qw',
            name: 'Pumping rate, Qw (m³/d)',
            min: 1,
            validMin: function(x) {return x > 0},
            max: 1000,
            value: 150,
            stepSize: 1,
            decimals: 0
        }, {
            order: 1,
            id: 't',
            name: 'Duration of pumping, t (d)',
            min: 100,
            validMin: function(x) {return x > 1},
            max: 500,
            value: 365,
            stepSize: 1,
            decimals: 1
        }, {
            order: 2,
            id: 'S',
            name: 'Aquifer storage coefficient, S (-)',
            min: 0.1,
            validMin: function(x) {return x > 0},
            max: 0.5,
            validMax: function(x) {return x <= 1},
            value: 0.2,
            stepSize: 0.001,
            decimals: 3
        }, {
            order: 3,
            id: 'T',
            name: 'Aquifer transmissivity, T (m²/d)',
            min: 1000,
            validMin: function(x) {return x > 0},
            max: 3000,
            value: 1500,
            stepSize: 10,
            decimals: 0
        }, {
            order: 4,
            id: 'd',
            name: 'Distance from stream to well, d (m)',
            min: 200,
            validMin: function(x) {return x > 0},
            max: 1000,
            value: 500,
            stepSize: 1,
            decimals: 0
        }, {
            order: 5,
            id: 'W',
            name: 'width of stream , W (m)',
            min: 100,
            validMin: function(x) {return x > 0},
            max: 1000,
            value: 400,
            stepSize: 100,
            decimals: 0
        }, {
            order: 6,
            id: 'Kdash',
            name: 'Permeability of the semipervious layer, K\' (m/s)',
            min: 0.1,
            validMin: function(x) {return x > 0},
            max: 1,
            value: 0.1,
            stepSize: 0.01,
            decimals: 1
        }, {
            order: 7,
            id: 'bdash',
            name: 'Thickness of the semipervious layer, b\' (m)',
            min: 100,
            validMin: function(x) {return x > 0},
            max: 1000,
            value: 100,
            stepSize: 10,
            decimals: 0
        }]
    }
};
const T14CReducer = (state = getInitialState(), action) => {
    switch (action.type) {
        case 'RESET_TOOL_T14C':
            {
                state = getInitialState();
                calculateAndModifyState(state);
                break;
            }
        case 'CALCULATE_TOOL_T14C':
            {
                state = { ...state
                };
                calculateAndModifyState(state);
                break;
            }
        case 'CHANGE_TOOL_T14C_PARAMETER':
            {
                state = { ...state,
                };

                const newParam = action.payload;
                var param = state.parameters.find(p => {return p.id === newParam.id});
                applyParameterUpdate(param, newParam);

                calculateAndModifyState(state);
                break;
            }
    }
    return state;
};

function calculateAndModifyState(state) {
    const Qw = state.parameters.find(p => {
            return p.id == 'Qw'
        })
        .value;
    const t = state.parameters.find(p => {
            return p.id == 't'
        })
        .value;
    const S = state.parameters.find(p => {
            return p.id == 'S'
        })
        .value;
    const T = state.parameters.find(p => {
            return p.id == 'T'
        })
        .value;
    const d = state.parameters.find(p => {
            return p.id == 'd'
        })
        .value;
    const W = state.parameters.find(p => {
        return p.id == 'W'
    })
        .value;
    const Kdash = state.parameters.find(p => {
        return p.id == 'Kdash'
    })
        .value;
    const bdash = state.parameters.find(p => {
        return p.id == 'bdash'
    })
        .value;
    const lambda = Kdash*W/bdash;
    state.chart.data = calc.calculateDiagramData(Qw, S, T, d, 0, t,lambda, 1);
    state.info.dQ = state.chart.data[state.chart.data.length -1].dQ;
    return state;
}
export default T14CReducer;