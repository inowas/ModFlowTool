export const getInitialState = (tool) => {
    return {
        name: 'New simple tool',
        description: 'Simple tool description',
        permissions: 'rwx',
        public: false,
        tool: tool,
        parameters: [{
            order: 0,
            id: 'h',
            name: 'Freshwater thickness, h [m]',
            min: 0,
            max: 10,
            value: 1,
            stepSize: 0.1,
            decimals: 1
        }, {
            order: 1,
            id: 'df',
            name: 'Density of freshwater [g/cm³]',
            min: 0.9,
            validMin: function(x) {
                return x >= 0.9;
            },
            max: 1.03,
            validMax: function(x) {
                return x <= 1.05;
            },
            value: 1.000,
            stepSize: 0.001,
            decimals: 3
        }, {
            order: 2,
            id: 'ds',
            name: 'Density of saltwater [g/cm³]',
            min: 0.9,
            validMin: function(x) {
                return x >= 0.9;
            },
            max: 1.03,
            validMax: function(x) {
                return x <= 1.05;
            },
            value: 1.025,
            stepSize: 0.001,
            decimals: 3
        }]
    };
};
