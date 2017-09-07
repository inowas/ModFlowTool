import percentile from 'percentile';

export function extractRangeFromHeatMapData(heatMapData) {
    if (heatMapData.length === 0) {
        return {
            min: -1,
            max: 1
        };
    }

    let min = percentile( 5, heatMapData, o => o.value ).value;
    let max = percentile( 95, heatMapData, o => o.value ).value;

    if (min === max) {
        min = min - 1;
        max = max + 1;
    }

    return {
        min,
        max
    };
}