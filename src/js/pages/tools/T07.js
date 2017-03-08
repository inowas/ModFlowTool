import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Chart from 'react-c3js';

import CrossSectionMap from '../../components/primitive/CrossSectionMap';
import Drawer from '../../components/primitive/Drawer';
import Header from '../../components/tools/Header';
import Icon from '../../components/primitive/Icon';
import Navbar from '../Navbar';
import ScenarioSelect from '../../components/tools/ScenarioSelect';

import '../../../less/4TileTool.less';
import '../../../less/toolT07.less';

import {
    fetchModelDetails,
    updateResults,
    setSelectedLayer,
    setSelectedResultType,
    setSelectedTotalTime,
    toggleModelSelection,
    setMapView,
    setBounds,
    setActiveGridCell
} from '../../actions/T07';

import LayerNumber from '../../model/LayerNumber';
import ResultType from '../../model/ResultType';
import TotalTime from '../../model/TotalTime';
import ModflowModelResult from '../../model/ModflowModelResult';

@connect(( store ) => {
    return { tool: store.T07 };
})
export default class T07 extends Component {

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        params: PropTypes.object,
        tool: PropTypes.object.isRequired
    };

    state = {
        navigation: [
            {
                name: 'Cross section',
                path: '',
                icon: <Icon name="layer_horizontal_hatched"/>
            }, {
                name: 'Scenarios difference',
                path: '',
                icon: <Icon name="layer_horizontal_hatched"/>
            }, {
                name: 'Time series',
                path: '',
                icon: <Icon name="layer_horizontal_hatched"/>
            }, {
                name: 'Overall budget',
                path: '',
                icon: <Icon name="layer_horizontal_hatched"/>
            }
        ]
    };

    componentWillMount( ) {
        this.props.dispatch(fetchModelDetails( this.props.params.id ));
    }

    setCrossSection = ( cell ) => {
        this.props.dispatch( setActiveGridCell(cell) );
    };

    toggleSelection = id => {
        return ( e ) => {
            this.props.dispatch(toggleModelSelection( id ));
            this.updateModelResults( this.props.tool.selectedResultType, this.props.tool.selectedLayerNumber, this.props.tool.selectedTotalTime );

            // manually emit a resize event so the leaflet maps recalculate their container size
            const event = document.createEvent( 'HTMLEvents' );
            event.initEvent( 'resize', true, false );
            e.target.dispatchEvent( event );
        };
    };

    changeLayerValue = ( layerNumber, resultType ) => {
        this.props.dispatch(setSelectedLayer( layerNumber ));
        this.props.dispatch(setSelectedResultType( resultType ));
        this.updateModelResults( resultType, layerNumber, this.props.tool.selectedTotalTime );
    };

    changeTotalTime = totalTime => {
        this.props.dispatch(setSelectedTotalTime( totalTime ));
        this.updateModelResults( this.props.tool.selectedResultType, this.props.tool.selectedLayerNumber, totalTime );
    };

    updateModelResults( resultType, layerNumber, totalTime ) {
        if ( layerNumber instanceof LayerNumber === false ) {
            console.error( 'Cannot update ModelResults, due layerNumber is not from Type LayerNumber.' );
            return;
        }

        if ( resultType instanceof ResultType === false ) {
            console.error( 'Cannot update ModelResults, due resultType is not from Type ResultType.' );
            return;
        }

        if ( totalTime instanceof TotalTime === false ) {
            console.error( 'Cannot update ModelResults, due totalTime is not from Type TotalTime.' );
            return;
        }

        this.props.tool.models.forEach(m => {
            if ( m.isSelected( ) === false ) {
                return;
            }

            if ( m.result instanceof ModflowModelResult ) {
                if (m.result.resultType( ).sameAs( resultType ) && m.result.layerNumber( ).sameAs( layerNumber ) && m.result.totalTime( ).sameAs( totalTime )) {
                    return;
                }
            }

            this.props.dispatch(updateResults( m.modelId, resultType, layerNumber, totalTime ));
        });
    }

    updateMapView = ( latLng, zoom ) => {
        this.props.dispatch(setMapView( latLng, zoom ));
    };

    updateBounds = (bounds) => {
        this.props.dispatch(setBounds( bounds ));
    }

    renderMaps( models ) {
        const { mapPosition, activeGridCell } = this.props.tool;
        return models.filter(model => {
            return model.selected;
        }).map(( model ) => {
            return (
                <section key={model.modelId} className="tile col col-min-2 stretch">
                    <CrossSectionMap model={model} min={models[0].minValue( )} max={models[0].maxValue( )} mapPosition={mapPosition} updateMapView={this.updateMapView} updateBounds={this.updateBounds} setClickedCell={this.setCrossSection} activeCell={activeGridCell}/>
                </section>
            );
        });
    }

    renderChart() {
        const models = this.props.tool.models;

        if (models.countModelsWithResults() === 0) {
            return null;
        }

        const rowNumber = this.props.tool.activeGridCell.y;
        if (rowNumber === null) {
            return null;
        }

        const columns = [];
        let leftBorder = 0;
        let rightBorder = 0;

        models.models().forEach( m => {
            if (m.isSelected() && m.hasResult()) {
                columns.push(m.chartDataByRowNumber(rowNumber));
            }
        });

        const chartData = {columns: columns};
        let grid = {};

        const baseModel = models.models()[0];

        if (baseModel.hasResult()) {
            leftBorder = baseModel.chartLeftBorderByRowNumber(rowNumber);
            rightBorder = baseModel.chartRightBorderByRowNumber(rowNumber);

            grid = {
                x: {
                    show: true,
                    lines: [
                        {value: leftBorder, text: 'Eastern model border', position: 'middle'},
                        {value: rightBorder, text: 'Western model border', position: 'middle'}
                    ]
                }
            };
        }

        return (
            <div className="grid-container">
                <section className="tile col stretch">
                    <Chart data={chartData} grid={grid} element="testchart" type="pie" />
                </section>
            </div>
        );
    }

    render() {
        const { navigation } = this.state;
        let models = this.props.tool.models.models();
        models = models.map(m => {
            m.thumbnail = 'scenarios_thumb.png';
            return m;
        });


        return (
            <div className="toolT07 app-width">
                <Navbar links={navigation}/>
                <Drawer visible>
                    <ScenarioSelect scenarios={models} toggleSelection={this.toggleSelection}/>
                </Drawer>
                <Header title={'T07. Scenario Analysis'}/>
                <div className="grid-container">
                    {this.renderMaps( models )}
                </div>
                {this.renderChart()}
            </div>
        );
    }
}
