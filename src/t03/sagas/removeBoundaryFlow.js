import {put, take} from 'redux-saga/effects';
import {sendCommand} from "../../actions/messageBox";
import {Command, Event} from "../../t03/actions/index";
import {WebData} from "../../core";

export default function* removeBoundaryFlow () {

    while ( true ) {
        let action = yield take( action => action.type === Command.REMOVE_BOUNDARY );

        yield put( sendCommand( action.type, action.payload ) );

        while ( true ) {
            const response = yield take( action => WebData.Helpers.waitForResponse(action, Command.REMOVE_BOUNDARY ) );

            if ( response.webData.type === "error" ) {
                break;
            }

            if ( response.webData.type === "success" ) {
                // TODO remove before send request to server and restore on server error for faster response in frontend
                yield put( Event.boundaryRemoved( action.tool, action.payload.boundary_id ) );
                break;
            }
        }
    }
}
