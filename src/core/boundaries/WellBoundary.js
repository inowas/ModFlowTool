import SingleOPBoundary from './SingleOPBoundary';
import BoundaryFactory from './BoundaryFactory';

const boundaryType = 'wel';

export default class WellBoundary extends SingleOPBoundary {

    static createWithStartDate({id = null, name = null, geometry, utcIsoStartDateTime}) {
        return BoundaryFactory.createByTypeAndStartDate({id, name, type: boundaryType, geometry, utcIsoStartDateTime});
    }

    static createFromObject(objectData) {
        objectData.type = boundaryType;
        return BoundaryFactory.fromObjectData(objectData);
    }

    constructor() {
        super();
        this._defaultValues = [0];
        this._metadata = {well_type: 'puw'};
        this._type = boundaryType;
    }

    get wellType() {
        return (this._metadata && this._metadata.well_type) || 'puw';
    }

    set wellType(type) {
        this._metadata.well_type = type;
    }

    get isValid() {
        super.isValid;

        if (!(this._type === boundaryType)) {
            throw new Error('The parameter type is not not valid.');
        }

        // noinspection RedundantIfStatementJS
        if (this.geometry.type !== 'Point') {
            throw new Error('The parameter geometry.type is not not valid.');
        }

        return true;
    }
}
