import md5 from 'js-md5';
import React, { Component, PropTypes } from 'react';
import { GeoJSON, Map, CircleMarker, TileLayer } from 'react-leaflet';
import * as mapHelpers from '../../calculations/map';
import ConfiguredRadium from 'ConfiguredRadium';
import styleGlobals from 'styleGlobals';

const RadiumMap = ConfiguredRadium(Map);

const styles = {
    map: {
        zIndex: -1
    }
};

@ConfiguredRadium
export default class BoundaryMap extends Component {
    static propTypes = {
        area: PropTypes.object,
        boundary: PropTypes.object,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        styles: PropTypes.object
    };

    componentDidMount() {
        mapHelpers.disableMap(this.map);
    }

    generateKeyFunction = geometry => {
        return md5(JSON.stringify(geometry));
    };

    getBounds = geometry => {
        return L.geoJSON(geometry).getBounds();
    };

    getStyle = (type, subtype) => {
        const styles = this.props.styles;

        if (!(type in styles)) {
            return styles.default;
        }

        if (subtype === undefined) {
            return styles[type];
        }

        if (!(subtype in styles[type])) {
            return styles.default;
        }

        return styles[type][subtype];
    };

    renderObservationPoints(b) {
        if (b.observation_points && b.observation_points.length > 1) {
            return b.observation_points.map(op => {
                return (
                    <CircleMarker
                        key={op.id}
                        center={[
                            op.geometry.coordinates[1],
                            op.geometry.coordinates[0]
                        ]}
                        {...this.getStyle(b.type + '_op')}
                    />
                );
            });
        }

        return null;
    }

    renderBoundary(b) {
        if (b.type === 'wel') {
            return (
                <CircleMarker
                    key={b.id}
                    center={[
                        b.geometry.coordinates[1],
                        b.geometry.coordinates[0]
                    ]}
                    {...this.getStyle(b.type, b.metadata.well_type)}
                />
            );
        }

        return (
            <GeoJSON
                key={this.generateKeyFunction(b.geometry)}
                data={b.geometry}
                style={this.getStyle(b.type)}
            />
        );
    }

    render() {
        const { area: areaGeometry, boundary, style } = this.props;

        return (
            <RadiumMap
                style={[styles.map, style]}
                className="boundaryMap"
                ref={map => {
                    this.map = map;
                }}
                zoomControl={false}
                bounds={this.getBounds(areaGeometry)}
            >
                <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                <GeoJSON
                    key={this.generateKeyFunction(areaGeometry)}
                    data={areaGeometry}
                    style={this.getStyle('area')}
                />
                {this.renderBoundary(boundary)}
                {this.renderObservationPoints(boundary)}
            </RadiumMap>
        );
    }
}