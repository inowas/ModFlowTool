import {put, call, take, select} from 'redux-saga/effects';
import {Query, Action} from '../../t03/actions/index';
import {getApiKey} from '../../user/reducers';
import {WebData} from '../../core';

export default function* loadModelFlow() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // eslint-disable-next-line no-shadow
        const action = yield take(action => action.type === Query.GET_MODFLOW_MODEL);

        yield put(WebData.Modifier.Action.responseAction(action.type, {type: 'loading'}));

        const state = yield select();
        const apiKey = getApiKey(state.session);
        const storedModel = (state[action.tool].model);

        try {
            if (storedModel.id !== action.id) {
                yield put(Action.destroyModflowModel());
                const model = yield call(
                    WebData.Helpers.fetchStatusWrapper,
                    WebData.Modifier.Action.buildRequest('modflowmodels/' + action.id, 'GET'),
                    apiKey
                );
                yield put(Action.setModflowModel(action.tool, WebData.Modifier.Action.payloadToSetModel(model)));
                yield put(WebData.Modifier.Action.responseAction(action.type, {type: 'success', data: null}));
            }

            if (storedModel.boundaries.length === 0) {
                const boundaries = yield call(
                    WebData.Helpers.fetchStatusWrapper,
                    WebData.Modifier.Action.buildRequest('modflowmodels/' + action.id + '/boundaries', 'GET'),
                    apiKey
                );
                yield put(Action.setBoundaries(action.tool, boundaries));
                yield put(WebData.Modifier.Action.responseAction(action.type, {type: 'success', data: null}));
            }
        } catch (err) {
            let msg = 'Unknown Error';

            if (typeof err === 'string') {
                msg = err;
            } else {
                const error = err.error || {message: undefined};
                msg = error.message || msg;
            }

            yield put(WebData.Modifier.Action.responseAction(action.type, {type: 'error', msg: msg}));
        }
    }
}
