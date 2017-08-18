/**
 * Actions triggers only a store change.
 */

export const ADD_AREA_CONTROL_POINT = 'MODEL_EDITOR_MODEL_AREA_ADD_CONTROL_POINT';
export const DELETE_AREA_CONTROL_POINT = 'MODEL_EDITOR_MODEL_DELETE_AREA_CONTROL_POINT';
export const DESTROY_MODFLOW_MODEL = 'MODEL_EDITOR_MODEL_DESTROY';

export const SET_AREA_LATITUDE = 'MODEL_EDITOR_MODEL_SET_AREA_LATITUDE';
export const SET_AREA_LONGITUDE = 'MODEL_EDITOR_MODEL_SET_AREA_LONGITUDE';
export const SET_MODFLOW_MODEL = 'MODEL_EDITOR_MODEL_SET';
export const UPDATE_AREA_CONTROL_POINT = 'MODEL_EDITOR_MODEL_AREA_UPDATE_CONTROL_POINT';
export const UPDATE_BOUNDING_BOX = 'MODEL_EDITOR_MODEL_UPDATE_BOUNDING_BOX';
export const UPDATE_GEOMETRY = 'MODEL_EDITOR_UPDATE_GEOMETRY';

export const SET_MODEL_AREA = 'MODEL_EDITOR_MODEL_SET_AREA';

export function setModelArea(tool, geometry, latLngBounds) {
    return {
        type: SET_MODEL_AREA,
        tool,
        payload: {
            geometry: geometry,
            latLngBounds: latLngBounds
        }
    };
}

export function setModflowModel(tool, payload) {
    return {
        type: SET_MODFLOW_MODEL,
        tool,
        payload
    };
}

export function destroyModflowModel(tool) {
    return {
        type: DESTROY_MODFLOW_MODEL,
        tool
    };
}

export function updateGeometry(tool, id, geometry) {
    return {
        type: UPDATE_GEOMETRY,
        tool,
        payload: {
            id: id,
            geometry: geometry
        }
    };
}

export function addAreaControlPoint(tool, lng, lat, index) {
    return {
        type: ADD_AREA_CONTROL_POINT,
        tool,
        payload: {
            lat,
            lng,
            index
        }
    };
}

export function updateAreaControlPoint(tool, index, controlPoint) {
    return {
        type: UPDATE_AREA_CONTROL_POINT,
        tool,
        payload: {
            index,
            controlPoint
        }
    };
}

export function updateBoundingBox(tool) {
    return {
        type: UPDATE_BOUNDING_BOX,
        tool,
    };
}

export function setAreaLatitude(tool, index, lat) {
    return {
        type: SET_AREA_LATITUDE,
        tool,
        payload: {
            index,
            lat
        }
    };
}

export function setAreaLongitude(tool, index, lng) {
    return {
        type: SET_AREA_LONGITUDE,
        tool,
        payload: {
            index,
            lng
        }
    };
}

export function deleteAreaControlPoint(tool, index) {
    return {
        type: DELETE_AREA_CONTROL_POINT,
        tool,
        payload: index
    };
}

export const ADD_BOUNDARY = 'MODEL_EDITOR_MODEL_ADD_BOUNDARY';
export const SET_BOUNDARIES = 'MODEL_EDITOR_MODEL_SET_BOUNDARIES';
export const SET_BOUNDARY = 'MODEL_EDITOR_MODEL_SET_BOUNDARY';
export const SET_LAYER = 'MODEL_EDITOR_MODEL_SET_LAYER';
export const UPDATE_BOUNDARY = 'MODEL_EDITOR_MODEL_UPDATE_BOUNDARY';
export const ADD_BOUNDARY_CONTROL_POINT = 'MODEL_EDITOR_MODEL_ADD_BOUNDARY_CONTROL_POINT';
export const UPDATE_BOUNDARY_CONTROL_POINT = 'MODEL_EDITOR_MODEL_UPDATE_BOUNDARY_CONTROL_POINT';
export const DELETE_BOUNDARY_CONTROL_POINT = 'MODEL_EDITOR_MODEL_DELETE_BOUNDARY_CONTROL_POINT';
export const UPDATE_BOUNDARY_PUMPING_RATE = 'MODEL_EDITOR_MODEL_UPDATE_BOUNDARY_PUMPING_RATE';
export const ADD_BOUNDARY_PUMPING_RATE = 'MODEL_EDITOR_MODEL_ADD_BOUNDARY_PUMPING_RATE';
export const SET_BOUNDARY_GEOMETRY = 'MODEL_EDITOR_MODEL_SET_BOUNDARY_GEOMETRY';

export function setBoundaryGeometry(tool, boundaryId, geometry) {
    return {
        type: SET_BOUNDARY_GEOMETRY,
        tool,
        payload: {
            id: boundaryId,
            geometry: geometry
        }
    };
}

export function setBoundaries(tool, boundaries) {
    return {
        type: SET_BOUNDARIES,
        tool,
        payload: boundaries
    };
}

export function addBoundary(tool, type, geometry) {
    return {
        type: ADD_BOUNDARY,
        tool,
        payload: {
            type: type,
            geometry: geometry
        }
    };
}

export function updateBoundary(tool, boundary) {
    return {
        type: UPDATE_BOUNDARY,
        tool,
        payload: boundary
    };
}

export function setBoundary(tool, boundary) {
    return {
        type: SET_BOUNDARY,
        tool,
        payload: boundary
    };
}

export function setLayer(tool, layer) {
    return {
        type: SET_LAYER,
        tool,
        payload: layer
    };
}

export function updatePumpingRate(tool, boundaryId, observationPointId, index, datetime, pumpingRate) {
    return {
        type: UPDATE_BOUNDARY_PUMPING_RATE,
        tool,
        payload: {
            boundaryId,
            observationPointId,
            index,
            datetime,
            pumpingRate
        }
    };
}

export function addPumpingRate(tool, boundaryId, observationPointId, index, datetime, pumpingRate) {
    return {
        type: ADD_BOUNDARY_PUMPING_RATE,
        tool,
        payload: {
            boundaryId,
            observationPointId,
            index,
            datetime,
            pumpingRate
        }
    };
}

export const SET_RESULTS = 'MODEL_EDITOR_MODEL_SET_RESULTS';

export function setResults(tool, results) {
    return {
        type: SET_RESULTS,
        tool,
        payload: results
    };
}

export const SET_SOILMODEL = 'MODEL_EDITOR_MODEL_SET_SOILMODEL';

export function setSoilmodel(tool, soilmodel) {
    return {
        type: SET_SOILMODEL,
        tool,
        payload: soilmodel
    };
}
