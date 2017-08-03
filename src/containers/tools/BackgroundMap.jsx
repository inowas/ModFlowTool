
import md5 from 'js-md5'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FeatureGroup,GeoJSON, LayersControl, Map, CircleMarker, TileLayer } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"

class BackgroundMap extends Component {
    generateKeyFunction( geometry ) {
        return md5(JSON.stringify(geometry))
    }

    getBounds( geometry ) {
        if ( geometry ) {
            return L.geoJSON(geometry).getBounds();
        }
    }

    getStyle( type, subtype ) {
        const styles = this.props.model.styles;

        if (!(type in styles)) {
            return styles['default'];
        }

        if (subtype === undefined) {
            return styles[type];
        }

        if (!(subtype in styles[type])) {
            return styles['default'];
        }

        return styles[type][subtype];
    }

    renderArea( geometry ) {
        if (geometry) {
            return (
                <LayersControl.Overlay name='Area Geometry' checked={true}>
                    <GeoJSON key={this.generateKeyFunction( geometry )} data={geometry} style={this.getStyle('area')} />
                </LayersControl.Overlay>
            )
        }
    }

    renderConstantHeads( boundaries ) {

        const constantHeads =  boundaries.map( b => (
            <GeoJSON key={this.generateKeyFunction( b.geometry )} data={b.geometry} style={this.getStyle(b.type)} />
        ));

        if (constantHeads.length===0) {
            return null;
        }

        return (
            <LayersControl.Overlay name='Constant Head Boundaries' checked={true}>
                <FeatureGroup>
                    {constantHeads}
                </FeatureGroup>
            </LayersControl.Overlay>
        )
    }

    renderGeneralHeads( boundaries ) {

        const generalHeads =  boundaries.map( b => (
            <GeoJSON key={this.generateKeyFunction( b.geometry )} data={b.geometry} style={this.getStyle(b.type)} />
        ));

        if (generalHeads.length===0) {
            return null;
        }

        return (
            <LayersControl.Overlay name='General Head Boundaries' checked={true}>
                <FeatureGroup>
                    {generalHeads}
                </FeatureGroup>
            </LayersControl.Overlay>
        )
    }

    renderRecharges( boundaries ) {

        const recharges =  boundaries.map( b => (
            <GeoJSON key={this.generateKeyFunction( b.geometry )} data={b.geometry} style={this.getStyle(b.type)} />
        ));

        if (recharges.length===0) {
            return null;
        }

        return (
            <LayersControl.Overlay name='Recharge Boundaries' checked={true}>
                <FeatureGroup>
                    {recharges}
                </FeatureGroup>
            </LayersControl.Overlay>
        )
    }

    renderRivers( boundaries ) {

        const rivers =  boundaries.map( b => (
            <GeoJSON key={this.generateKeyFunction( b.geometry )} data={b.geometry} style={this.getStyle(b.type)} />
        ));

        if (rivers.length===0) {
            return null;
        }

        return (
            <LayersControl.Overlay name='River Boundaries' checked={true}>
                <FeatureGroup>
                    {rivers}
                </FeatureGroup>
            </LayersControl.Overlay>
        )
    }

    renderWells( boundaries ) {
        const wells =  boundaries.map( w => (
            <CircleMarker key={w.id} center={[w.geometry.coordinates[1], w.geometry.coordinates[0]]} {...this.getStyle(w.type, 'puw')} />
        ));

        if (wells.length===0) {
            return null;
        }

        return (
            <LayersControl.Overlay name='Wells' checked={true}>
                <FeatureGroup>
                    {wells}
                </FeatureGroup>
            </LayersControl.Overlay>
        )
    }

    renderEditControl() {
        return (
            <FeatureGroup>
                <EditControl
                    position='bottomright'
                    onEdited={this._onEditPath}
                    onCreated={this._onCreate}
                    onDeleted={this._onDeleted}
                    draw={{
                        rectangle: false
                    }}
                />
            </FeatureGroup>
        );
    }

    render( ) {
        const area = this.props.model.geometry;
        const boundingBox = this.props.model.boundingBox;
        const boundaries = this.props.model.boundaries;

        const constantHeads = boundaries.filter( b => { if (b.type === 'chd') return b });
        const generalHeads = boundaries.filter( b => { if (b.type === 'ghb') return b });
        const recharges = boundaries.filter( b => { if (b.type === 'rch') return b });
        const rivers = boundaries.filter( b => { if (b.type === 'riv') return b });
        const wells = boundaries.filter( b => { if (b.type === 'wel') return b });

        return (
            <div className="map-wrapper">
                <Map id="background-map" ref="map" bounds={this.getBounds(area)} zoomControl={false} boundsOptions={{padding: [50, 50]}} >
                    <LayersControl position='topright'>
                        <LayersControl.BaseLayer name='OSM' checked={true}>
                            <TileLayer
                                url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name='OSM.BlackAndWhite'>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url='http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name='OSM.Mapnik'>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name='Empty'>
                            <TileLayer/>
                        </LayersControl.BaseLayer>

                        {this.renderArea( area )}
                        {this.renderConstantHeads( constantHeads )}
                        {this.renderGeneralHeads( generalHeads )}
                        {this.renderRecharges( recharges )}
                        {this.renderRivers( rivers )}
                        {this.renderWells( wells )}


                    </LayersControl>

                    {this.renderEditControl()}
                </Map>
            </div>
        );
    }
}

const mapStateToProps = (state, { tool, params }) => {
    console.log('mapStateToProps', state);
    return {
        model: state[tool].model
    };
};

const actions = {
};

const mapDispatchToProps = (dispatch, { tool }) => {
    const wrappedActions = {};
    for ( const key in actions ) {
        if (actions.hasOwnProperty( key )) {
            // eslint-disable-next-line no-loop-func
            wrappedActions[key] = function( ) {
                const args = Array.prototype.slice.call( arguments );
                dispatch(actions[key]( tool, ...args ));
            };
        }
    }

    return wrappedActions;
};

BackgroundMap = connect( mapStateToProps, mapDispatchToProps )( BackgroundMap );

export default BackgroundMap;

