import {put, take} from 'redux-saga/effects';
import {Command, Event} from '../actions';
import {WebData} from '../../core';

export default function* deleteToolInstance() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-shadow
        const action = yield take(action => action.type === Command.DELETE_TOOL_INSTANCE);
        yield put(WebData.Modifier.Action.sendCommand(action.type, action.payload));

        // eslint-disable-next-line no-constant-condition
        while (true) {
            // eslint-disable-next-line no-shadow
            const response = yield take(action => WebData.Helpers.waitForResponse(action, Command.DELETE_TOOL_INSTANCE));

            if (response.webData.type === 'error') {
                break;
            }

            if (response.webData.type === 'success') {
                // TODO remove before send request to server and restore on server error for faster response in frontend
                yield put(Event.toolInstanceDeleted(action.tool, action.payload.id));
                break;
            }
        }
    }
}
