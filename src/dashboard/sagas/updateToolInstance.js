import {put, take} from 'redux-saga/effects';
import {Command, Action, Event} from '../actions';
import {WebData} from '../../core';

export default function* updateToolInstanceFlow() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-shadow
        const action = yield take(action => WebData.Helpers.waitForAction(action, Command.UPDATE_TOOL_INSTANCE));

        yield put(Action.setToolInstance(action.tool, action.payload));
        yield put(WebData.Modifier.Action.sendCommand(action.type, {...action.payload, id: action.id}));

        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-shadow
            const response = yield take(action => WebData.Helpers.waitForResponse(action, Command.UPDATE_TOOL_INSTANCE));

            if (response.webData.type === 'error') {
                break;
            }

            if (response.webData.type === 'success') {
                yield put(Event.toolInstanceUpdated(action.tool, action.id, action.payload));
                break;
            }
        }
    }
}
