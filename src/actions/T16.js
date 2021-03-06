export function changeParWet(parameter){
    return {
        type: 'CHANGE_TOOL_T16A_PARAMETERWET',
        payload: parameter
    }
}

export function enterSieve(parameter){
    return {
        type: 'CHANGE_TOOL_T16A_NEWSIEVE',
        payload: parameter
    }
}

export function changeStandard(parameter){
    return {
        type: 'CHANGE_TOOL_T16A_STANDARD',
        payload: parameter
    }
}

export function changeHydroData(parameter){
    return {
        type: 'CHANGE_TOOL_T16A_HYDRODATA',
        payload: parameter
    }
}

export function changeSieve(parameter){
    return {
        type: 'CHANGE_TOOL_T16A_SIEVE',
        payload: parameter
    }
}

export function changeParameter(parameter){
    return {
        type: 'CHANGE_TOOL_T16A_PARAMETER',
        payload: parameter
    }
}

export function calculate(){
    return {
        type: 'CALCULATE_TOOL_T16A'
    }
}

export function reset(){
    return {
        type: 'RESET_TOOL_T16A'
    }
}
