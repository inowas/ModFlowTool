import React, { Component } from 'react';
import PropTypes from 'prop-types';
import md5 from 'js-md5';
import { GeoJSON, Map, Rectangle, TileLayer} from 'react-leaflet';
import * as mapHelpers from '../../calculations/map';
import ConfiguredRadium from 'ConfiguredRadium';
import { geoJSON } from 'leaflet';

const styles = {
    map: {
        minHeight: 300
    }
};

@ConfiguredRadium
class ModelEditorGeneralMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            model: props.model
        };
    }

    componentDidMount( ) {
        mapHelpers.disableMap( this.map );
        mapHelpers.invalidateSize( this.map );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            model: nextProps.model
        });
    }

    generateKeyFunction = ( geometry ) => {
        return md5(JSON.stringify(geometry));
    };

    getBounds = ( geometry ) => {
        if ( geometry ) {
            return geoJSON(geometry).getBounds();
        }

        return null;
    };

    getStyle = ( type, subtype ) => {
        const modelStyles = this.state.model.styles;

        if (!(type in modelStyles)) {
            return modelStyles.default;
        }

        if (subtype === undefined) {
            return modelStyles[type];
        }

        if (!(subtype in modelStyles[type])) {
            return modelStyles.default;
        }

        return modelStyles[type][subtype];
    };


    render( ) {
        const area = this.state.model.geometry;
        const boundingBox = this.state.model.bounding_box;
        const bounds = [[boundingBox[0][1], boundingBox[0][0]], [boundingBox[1][1], boundingBox[1][0]]];

        if (area) {
            return (
                <Map className="crossSectionMap" style={styles.map} ref={map => {this.map = map;}} zoomControl={false} bounds={this.getBounds(area)} >
                    <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'/>
                    <GeoJSON key={this.generateKeyFunction( area )} data={area} style={this.getStyle('area')} />
                    <Rectangle bounds={bounds} {...this.getStyle('bounding_box')}/>
                </Map>
            );
        }

        return (
            <Map className="crossSectionMap" style={styles.map} ref={map => {this.map = map;}} zoomControl={false} center={[20, 140]} zoom={1} >
                <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'/>
            </Map>
        );
    }
}

ModelEditorGeneralMap.propTypes = {
    model: PropTypes.object
};

export default ModelEditorGeneralMap;
