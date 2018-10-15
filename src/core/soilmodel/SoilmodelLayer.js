import uuidv4 from 'uuid/v4';
import SoilmodelZone from "./SoilmodelZone";

class SoilmodelLayer {
    _id = uuidv4();
    _meta = {
        _zones: []
    };
    _name = 'New Layer';
    _description = '';
    _number = 0;
    _laytyp = 0;
    _top = 1;
    _botm = 0;
    _hk = 10;
    _hani = 1;
    _vka = 1;
    _layavg = 0;
    _laywet = 0;
    _ss = 0.00002;
    _sy = 0.15;

    static fromObject(obj) {
        const layer = new SoilmodelLayer();

        if (obj) {
            layer.id = obj.id;
            layer.name = obj.name;
            layer.description = obj.description;
            layer.number = obj.number;
            layer.laytyp = obj.laytyp;
            layer.top = obj.top;
            layer.botm = obj.botm;
            layer.hk = obj.hk;
            layer.hani = obj.hani;
            layer.vka = obj.vka;
            layer.layavg = obj.layavg;
            layer.laywet = obj.laywet;
            layer.ss = obj.ss;
            layer.sy = obj.sy;

            if (obj._meta && obj._meta.zones) {
                obj._meta.zones.forEach((zone) => {
                    layer.addZone(SoilmodelZone.fromObject(zone));
                });
            }
        }

        return layer;
    }

    constructor() {
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value ? value : uuidv4();
    }

    get meta() {
        return this._meta;
    }

    set meta(value) {
        this._meta = value ? value : {
            _zones: []
        };
    }

    get zones() {
        return this._meta._zones;
    }

    set zones(value) {
        this._meta._zones = value ? value : [];
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value ? value : 'New Layer';
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value ? value : '';
    }

    get number() {
        return this._number;
    }

    set number(value) {
        this._number = value ? parseInt(value) : 0;
    }

    get laytyp() {
        return this._laytyp;
    }

    set laytyp(value) {
        this._laytyp = value ? parseInt(value) : 0;
    }

    get top() {
        return this._top;
    }

    set top(value) {
        this._top = value ? value : 0;
    }

    get botm() {
        return this._botm;
    }

    set botm(value) {
        this._botm = value ? value : 0;
    }

    get hk() {
        return this._hk;
    }

    set hk(value) {
        this._hk = value ? value : 0;
    }

    get hani() {
        return this._hani;
    }

    set hani(value) {
        this._hani = value ? value : 0;
    }

    get vka() {
        return this._vka;
    }

    set vka(value) {
        this._vka = value ? value : 0;
    }

    get layavg() {
        return this._layavg;
    }

    set layavg(value) {
        this._layavg = value ? value : 0;
    }

    get laywet() {
        return this._laywet;
    }

    set laywet(value) {
        this._laywet = value ? value : 0;
    }

    get ss() {
        return this._ss;
    }

    set ss(value) {
        this._ss = value ? value : 0;
    }

    get sy() {
        return this._sy;
    }

    set sy(value) {
        this._sy = value ? value : 0;
    }

    get toObject() {
        return {
            'id': this.id,
            'name': this.name,
            '_meta': {
                'zones': this.zones.map(z => z.toObject)
            },
            'description': this.description,
            'number': this.number,
            'laytyp': this.laytyp,
            'top': this.top,
            'botm': this.botm,
            'hk': this.hk,
            'hani': this.hani,
            'vka': this.vka,
            'layavg': this.layavg,
            'laywet': this.laywet,
            'ss': this.ss,
            'sy': this.sy
        };
    }

    smoothParameter(gridSize, parameter, cycles = 1) {
        for (let cyc = 1; cyc <= cycles; cyc++) {
            for (let row = 0; row < gridSize.n_y; row++) {
                for (let col = 0; col < gridSize.n_x; col++) {
                    let avg = parseFloat(this[parameter][row][col]);
                    let div = 1;

                    if (row - 1 >= 0) {
                        avg += parseFloat(this[parameter][row-1][col]);
                        div++;
                        if (col - 1 >= 0) {
                            avg += parseFloat(this[parameter][row-1][col-1]);
                            div++;
                        }
                        if (col + 1 < gridSize.n_x) {
                            avg += parseFloat(this[parameter][row-1][col+1]);
                            div++;
                        }
                    }

                    if (row + 1 < gridSize.n_y) {
                        avg += parseFloat(this[parameter][row+1][col]);
                        div++;
                        if (col - 1 >= 0) {
                            avg += parseFloat(this[parameter][row+1][col-1]);
                            div++;
                        }
                        if (col + 1 < gridSize.n_x) {
                            avg += parseFloat(this[parameter][row+1][col+1]);
                            div++;
                        }
                    }

                    if (col - 1 >= 0) {
                        avg += parseFloat(this[parameter][row][col-1]);
                        div++;
                    }

                    if (col + 1 < gridSize.n_x) {
                        avg += parseFloat(this[parameter][row][col+1]);
                        div++;
                    }

                    //console.log(`set ${parameter} at ${col} ${row} with value ${avg} / ${div}`);
                    this[parameter][row][col] = avg/div;
                }
            }
        }
    }

    zonesToParameters(gridSize, parameters = ['hk', 'hani', 'vka', 'ss', 'sy']) {
        if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }

        // sort zones by priority
        const zones = this.zones.sort((a, b) => {
            return a.priority - b.priority;
        });

        // loop through all the zones
        zones.forEach(zone => {
            // loop through all the parameters ...
            parameters.forEach(parameter => {
                // ... and check if the current zone has values for the parameter
                if (zone[parameter]) {
                    // apply array with default values to parameter, if zone with parameter exists
                    // x is number of columns, y number of rows (grid resolution of model)
                    if (!Array.isArray(this[parameter])) {
                        this[parameter] = new Array(gridSize.n_y).fill(0).map(() => new Array(gridSize.n_x).fill(this[parameter]));
                    }

                    // update the values for the parameter in the cells given by the zone
                    zone.activeCells.forEach(cell => {
                        //console.log(`set ${parameter} at ${cell[1]} ${cell[0]} with value ${zone[parameter]}`);
                        this[parameter][cell[1]][cell[0]] = zone[parameter];
                    });
                }
            });
        });

        return this;
    }

    addZone(zone) {
        if (!(zone instanceof SoilmodelZone)) {
            throw new Error('The zone object is not of type SoilmodelZone.');
        }
        const zones = this.zones;
        zones.push(zone);
        this.zones = zones;
        return this;
    }

    removeZone(zone) {
        this.zones = this.zones.filter(z => z.id !== zone.id);
        return this;
    }

    updateZone(zone) {
        let zoneExists = false;
        this.zones = this.zones.map(z => {
            if (z.id === zone.id) {
                zoneExists = true;
                return zone;
            }
            return z;
        });

        if (!zoneExists) {
            this.addZone(zone);
        }
        return this;
    }
}

export default SoilmodelLayer;