
import * as calc from "../calculations/T09D"

function getInitialState() {
    return {
        background: {
            'image' : "/images/tools/T09D.png"
        },
        chart: {
            data: [],
            options: {
                yAxis: {
                    domain: [0 , 'auto']
                }
            }
        },
        settings: {
            'selected': 'confined'
        },
        info: {
            x: 0,
            q: 0
        },
        parameters: [
            {
                order: 0,
                id: 'k',
                name: 'Hydraulic conductivity, K (m/d)',
                min: 1,
                max: 100,
                value: 50,
                stepSize: 1,
                decimals: 0
            },
            {
                order: 1,
                id: 'b',
                name: 'Depth to base of aquifer, B (m)',
                min: 0,
                max: 100,
                value: 15,
                stepSize: 1,
                decimals: 0
            },
            {
                order: 2,
                id: 'qo',
                name: 'Offshore discharge rate, q (m³/d)',
                min: 0,
                max: 100,
                value: 50,
                stepSize: 1,
                decimals: 0
            },
            {
                order: 3,
                id: 'qw',
                name: 'Well pumping rate, Q (m³/d)',
                min: 0,
                max: 100,
                value: 50,
                stepSize: 1,
                decimals: 0
            },
            {
                order: 4,
                id: 'xw',
                name: 'Distance from well to shoreline, xw (m)',
                min: 0,
                max: 100,
                value: 5,
                stepSize: 1,
                decimals: 0
            },
            {
                order: 5,
                id: 'df',
                name: 'Density of freshwater [g/cm³]',
                min: 1.000,
                max: 1.005,
                value: 1.000,
                stepSize: 0.001,
                decimals: 3
            },
            {
                order: 6,
                id: 'ds',
                name: 'Density of saltwater [g/cm³]',
                min: 1.020,
                max: 1.030,
                value: 1.025,
                stepSize: 0.001,
                decimals: 3
            }
        ]
    };
}

const T09DReducer = ( state=getInitialState(), action ) => {

    switch (action.type) {

        case "CHANGE_TOOL_T09D_SETTINGS": {
            state = {
                ...state,
                settings: action.payload
            };

            break;
        }

        case "RESET_TOOL_T09D": {
            state = {...state};
            state = getInitialState();
            calculateAndModifyState(state);

            break;
        }

        case "CALCULATE_TOOL_T09D": {
            state = {...state};
            calculateAndModifyState(state);

            break;
        }

        case "CHANGE_TOOL_T09D_PARAMETER": {

            const changedParam = action.payload;
            state = {...state};

            state.parameters.map( p => {
                if (p.id === changedParam.id){
                    if (changedParam.hasOwnProperty('min')){
                        p.min = changedParam.min;
                    }

                    if (changedParam.hasOwnProperty('max')){
                        p.max = changedParam.max;
                    }

                    if (changedParam.hasOwnProperty('value')){
                        p.value = changedParam.value;
                    }
                }}
            );

            calculateAndModifyState(state);
            break;
        }
    }

    return state;
};

function calculateAndModifyState(state) {
    const k = state.parameters.find( p => {return p.id == 'k'}).value;
    const b = state.parameters.find( p => {return p.id == 'b'}).value;
    const qo = state.parameters.find( p => {return p.id == 'qo'}).value;
    const qw = state.parameters.find( p => {return p.id == 'qw'}).value;
    const xw = state.parameters.find( p => {return p.id == 'xw'}).value;
    const df = state.parameters.find( p => {return p.id == 'df'}).value;
    const ds = state.parameters.find( p => {return p.id == 'ds'}).value;

    //state.chart.data = calc.calculateDiagramData(q, k, d, df, ds, 0, 100, 10);
    //state.chart.options.yAxis.domain[1] = 2 * calc.calculateZ(d);

    //state.info.h = calc.calculateH(q, k, d, df, ds).toFixed(1);
    //state.info.q = calc.calculateQ(k, d, df, ds).toFixed(1);
    //state.info.z = calc.calculateZ(d).toFixed(1);

    return state
}

export default T09DReducer;
