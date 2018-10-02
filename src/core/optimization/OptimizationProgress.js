class SimplexProgress {
    _progressLog = [];
    _iteration = 0;
    _iterationTotal = 0;
    _final = false;

    static fromObject(obj) {
        const progress = new SimplexProgress();
        if (obj) {
            progress.progressLog = obj.progress_log;
            progress.iteration = obj.iteration;
            progress.iterationTotal = obj.iteration_total;
            progress.final = obj.final;
        }
        return progress;
    }

    constructor() {
    }

    get progressLog() {
        return this._progressLog;
    }

    set progressLog(value) {
        this._progressLog = value ? value : [];
    }

    get iteration() {
        return this._iteration;
    }

    set iteration(value) {
        this._iteration = value ? value : 0;
    }

    get iterationTotal() {
        return this._iterationTotal;
    }

    set iterationTotal(value) {
        this._iterationTotal = value ? value : 0;
    }

    get final() {
        return this._final;
    }

    set final(value) {
        this._final = value ? value : false;
    }

    get toObject() {
        return {
            'progress_log': this.progressLog,
            'iteration': this.iteration,
            'iteration_total': this.iterationTotal,
            'final': this.final
        };
    }

    calculate() {
        return (this.iteration / this.iterationTotal * 100).toFixed(1);
    }

    get toChartData() {
        return this.progressLog.map((p, key) => {
            return {
                name: key,
                log: parseFloat(p.toFixed(2))
            };
        });
    }
}

class GAProgress {
    _progressLog = [];
    _iteration = 0;
    _iterationTotal = 0;
    _simulation = 0;
    _simulationTotal = 0;
    _final = false;

    static fromObject(obj) {
        const progress = new GAProgress();
        if (obj) {
            progress.progressLog = obj.progress_log;
            progress.iteration = obj.iteration;
            progress.iterationTotal = obj.iteration_total;
            progress.final = obj.final;
            progress.simulation = obj.simulation;
            progress.simulationTotal = obj.simulation_total;
        }
        return progress;
    }

    constructor() {
    }

    get progressLog() {
        return this._progressLog;
    }

    set progressLog(value) {
        this._progressLog = value;
    }

    get iteration() {
        return this._iteration;
    }

    set iteration(value) {
        this._iteration = value;
    }

    get iterationTotal() {
        return this._iterationTotal;
    }

    set iterationTotal(value) {
        this._iterationTotal = value;
    }

    get final() {
        return this._final;
    }

    set final(value) {
        this._final = value;
    }

    get simulation() {
        return this._simulation;
    }

    set simulation(value) {
        this._simulation = value ? value : null;
    }

    get simulationTotal() {
        return this._simulationTotal;
    }

    set simulationTotal(value) {
        this._simulationTotal = value ? value : null;
    }

    get toObject() {
        return {
            'progress_log': this.progressLog,
            'simulation': this.simulation,
            'simulation_total': this.simulationTotal,
            'iteration': this.iteration,
            'iteration_total': this.iterationTotal,
            'final': this.final
        };
    }

    calculate() {
        const i = this.iteration;
        const iMax = this.iterationTotal;
        const s = this.simulation;
        const sMax = this.simulationTotal;

        if (iMax > 0 && sMax > 0) {
            const progress = (((i - 1) * sMax + s) / (iMax * sMax) * 100).toFixed(1);
            if (progress > 100) {
                return 100;
            }
            return progress;
        }
        return 0;
    }

    get toChartData() {
        return this.progressLog.map((p, key) => {
            return {
                name: key,
                log: parseFloat(p.toFixed(2))
            };
        });
    }
}

class OptimizationProgress {
    _GA = null;
    _Simplex = null;

    static fromObject(obj) {
        const progress = new OptimizationProgress();
        if(obj) {
            progress.GA = GAProgress.fromObject(obj.GA);
            progress.Simplex = SimplexProgress.fromObject(obj.Simplex);
        }
        return progress;
    }

    get GA() {
        return this._GA;
    }

    set GA(value) {
        this._GA = value ? value : new GAProgress();
    }

    get Simplex() {
        return this._Simplex;
    }

    set Simplex(value) {
        this._Simplex = value ? value : new SimplexProgress();
    }

    get toObject() {
        return {
            'GA': this.GA ? this.GA.toObject : null,
            'Simplex': this.Simplex ? this.Simplex.toObject : null
        };
    }
}

export default OptimizationProgress;