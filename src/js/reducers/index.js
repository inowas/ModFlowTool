import { combineReducers } from 'redux';

import appState from "./applicationStateReducer";
import model from "./modelReducer";
import models from "./modelsReducer";
import T09A from "./T09A";
import T09B from "./T09B";
import T09C from "./T09C";
import T09D from "./T09D";
import T09E from "./T09E";
import scenarioAnalysis from "./scenarioAnalysisReducer";
import user from "./userReducer";

export default combineReducers({
    user,
    appState,
    models,
    model,
    scenarioAnalysis,
    T09A,
    T09B,
    T09C,
    T09D,
    T09E
});