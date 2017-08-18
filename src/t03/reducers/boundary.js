export function handleUpdateAreaGeometry(state, action) {
    if (state.id === action.payload.id) {
        return action.payload.geometry;
    }

    return state.geometry;
}

export function handleUpdateBoundingBox(state, bounds) {
    return [[bounds.getWest(), bounds.getSouth()], [bounds.getEast(), bounds.getNorth()]];
}

export function handleUpdateBoundary(state, action) {
    return state.map(b => {
        if (b.id === action.payload.id) {
            return {...b, ...action.payload};
        }

        return b;
    });
}

export function handleUpdateLayer(soilmodel, action) {
    return {...soilmodel, layers: soilmodel.layers.map(l => {
        if (l.id === action.payload.id) {
            return {...l, ...action.payload};
        }

        return l;
    })};
}

export function handleBoundaryGeometrySetEditTrue(boundaries, action) {
    return boundaries.map(b => {
        if (b.id === action.payload) {
            const geometry = b.geometry;
            geometry.edit = true;
            b.geometry = geometry;
            return {...b};
        }

        return b;
    });
}

export function handleUpdateBoundaryGeometry(boundaries, action) {
    return boundaries.map(b => {
        if (b.id === action.payload.id) {
            return {...b, geometry: action.payload.geometry};
        }

        return b;
    });
}

export function handleUpdateBoundaryControlPoint(state, action) {
    return state.map(b => {
        if (b.id === action.payload.id) {
            return {
                ...b,
                geometry: b.geometry.map((c, index) => {
                    if (index === action.payload.index) {
                        return action.payload.controlPoint;
                    }

                    return c;
                })
            };
        }

        return b;
    });
}

export function handleDeleteBoundaryControlPoint(state, action) {
    return state.map(b => {
        if (b.id === action.payload.id) {
            return {
                ...b,
                geometry: [
                    ...b.geometry.slice(0, action.payload.index),
                    ...b.geometry.slice(action.payload.index + 1, b.geometry.length)
                ]
            };
        }

        return b;
    });
}

export function handleAddBoundaryControlPoint(state, action) {
    return state.map(b => {
        if (b.id === action.payload.id) {
            if (action.payload.index !== undefined) {
                return {
                    ...b,
                    geometry: [
                        ...b.geometry.slice(0, action.payload.index),
                        action.payload.controlPoint,
                        ...b.geometry.slice(action.payload.index, b.geometry.length)
                    ]
                };
            }
            return {
                ...b,
                geometry: [
                    ...b.geometry,
                    action.payload.controlPoint
                ]
            };
        }

        return b;
    });
}

export function handleDeleteBoundary(state, action) {
    return [
        ...state.slice(0, state.findIndex(b => ( b.id === action.payload ))),
        ...state.slice(state.findIndex(b => ( b.id === action.payload )) + 1, state.length)
    ];
}

export function handleUpdateBoundaryPumpingRate(state, action) {
    return state.map(b => {
        if (b.id === action.payload.boundaryId) {
            return {
                ...b,
                observationPoints: b.observationPoints.map(op => {
                    if (op.id === action.payload.observationPointId) {
                        return {
                            ...op,
                            values: [
                                ...op.values.slice(0, action.payload.index),
                                [action.payload.datetime, action.payload.pumpingRate],
                                ...op.values.slice(action.payload.index + 1, op.values.length)
                            ]
                        };
                    }

                    return op;
                })
            };
        }

        return b;
    });
}

export function handleAddBoundaryPumpingRate(state, action) {
    return state.map(b => {
        if (b.id === action.payload.boundaryId) {
            return {
                ...b,
                observationPoints: b.observationPoints.map(op => {
                    if (op.id === action.payload.observationPointId) {
                        return {
                            ...op,
                            values: [
                                ...op.values.slice(0, action.payload.index),
                                [action.payload.datetime, action.payload.pumpingRate],
                                ...op.values.slice(action.payload.index, op.values.length)
                            ]
                        };
                    }

                    return op;
                })
            };
        }

        return b;
    });
}
