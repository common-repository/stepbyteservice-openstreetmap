(function (blocks, element, editor, blockEditor, components, i18n, stepbyteservice, classutils, osmglobals) {
    'use strict';
    var timer = null;
    blocks.registerBlockType('stepbyteservice/openstreetmap', {

        title: 'OpenStreetMap',
        icon: 'location-alt',
        category: 'embed',
        keywords: [
            i18n.__('map', 'sbs-wp-openstreetmap'),
            i18n.__('leaflet', 'sbs-wp-openstreetmap')
        ],
        attributes: {
            block_id: {
                type: 'string'
            },
            map_style: {
                type: 'string'
            },
            map_style_key: {
                type: 'string'
            },
            map_height: {
                type: 'integer'
            },
            zoom: {
                type: 'integer',
                default: parseInt(osmglobals.defaults.zoom) || null
            },
            ctrl_mouse_zoom: {
                type: 'boolean'
            },
            latitude: {
                type: 'number'
            },
            longitude: {
                type: 'number'
            },
            routing: {
                type: 'boolean'
            },
            destination_marker: {
                type: 'integer'
            },
            router: {
                type: 'string'
            },
            router_key: {
                type: 'string'
            },
            show_attribution: {
                type: 'boolean'
            },
            geocoder: {
                type: 'string'
            },
            geocoder_key: {
                type: 'string'
            },
            center_marker: {
                type: 'integer'
            },
            marker_list: {
                type: 'array',
            }
        },
        supports: {
            align: ['wide', 'full']
        },
        edit: function (_Component) {
            classutils._inherits(edit, _Component);
            function edit(props) {
                var _this;
                classutils._classCallCheck(this, edit);
                _this = classutils._possibleConstructorReturn(this, classutils._getPrototypeOf(edit).apply(this, arguments));
                _this.props = props;
                _this.update = true;
                return _this;
            }

            classutils._createClass(edit, [{
                    key: 'componentDidMount',
                    value: function componentDidMount() {
                        this.props.setAttributes({
                            block_id: this.props.clientId
                        });
                        stepbyteservice.OpenStreetMap.init(document.getElementById('sbs-openstreetmap-block-' + this.props.attributes.block_id))
                    }
                }, {
                    key: 'componentDidUpdate',
                    value: function componentDidUpdate(prevProps) {
                        if (this.props.attributes !== prevProps.attributes && this.update === true)
                            stepbyteservice.OpenStreetMap.init(document.getElementById('sbs-openstreetmap-block-' + this.props.attributes.block_id))
                    }
                }, {
                    key: 'render',
                    value: function render() {
                        var _this = this;
                        var attributes = classutils._objectSpread({}, osmglobals.defaults || {}, this.props.attributes);
                        if (attributes.map_style in osmglobals.deprecated_styles) {
                            attributes.map_style = osmglobals.deprecated_styles[attributes.map_style];
                        }
                        var InspectorControls = blockEditor && blockEditor.InspectorControls ? blockEditor.InspectorControls : editor.InspectorControls;
                        return element.createElement(element.Fragment, {}, [
                            element.createElement('div', {
                                id: 'sbs-openstreetmap-block-' + attributes.block_id,
                                key: 'map' + attributes.block_id,
                                className: 'sbs_openstreetmap_module',
                                'data-map-style': attributes.map_style,
                                'data-map-style-key': attributes.map_style_key,
                                'data-zoom': attributes.zoom,
                                'data-ctrl-mouse-zoom': attributes.ctrl_mouse_zoom,
                                'data-latitude': attributes.latitude,
                                'data-longitude': attributes.longitude,
                                'data-routing': attributes.routing,
                                'data-destination-marker': attributes.destination_marker,
                                'data-router': attributes.router,
                                'data-router-key': attributes.router_key,
                                'data-show-attribution': attributes.show_attribution,
                                'data-geocoder': attributes.geocoder,
                                'data-geocoder-key': attributes.geocoder_key,
                                'data-center-marker': attributes.center_marker,
                                'data-marker-list': JSON.stringify(attributes.marker_list)
                            }, element.createElement('div', {
                                className: 'sbs_openstreetmap_container',
                                style: {
                                    paddingBottom: attributes.map_height + '%'
                                }
                            })),
                            element.createElement(InspectorControls, {
                                key: 'controls' + attributes.block_id
                            },
                                    element.createElement('div', {
                                        className: 'sbs-openstreetmap-inspector-panel'
                                    },
                                            element.createElement(components.PanelBody, {
                                                title: i18n.__('Map', 'sbs-wp-openstreetmap'),
                                                initialOpen: true
                                            },
                                                    element.createElement(components.SelectControl, {
                                                        label: i18n.__('Map Style', 'sbs-wp-openstreetmap'),
                                                        value: attributes.map_style,
                                                        options: Object.entries(osmglobals.map_styles).map(function (entry) {
                                                            return {
                                                                label: entry[1].label,
                                                                value: entry[0]
                                                            };
                                                        }),
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                map_style: value
                                                            });
                                                        }
                                                    }),
                                                    element.createElement(components.ExternalLink, {
                                                        className: 'provider_term_link',
                                                        href: osmglobals.map_styles[attributes.map_style].terms
                                                    },
                                                            osmglobals.map_styles[attributes.map_style].provider + ' ' + i18n.__('Terms of Use', 'sbs-wp-openstreetmap')
                                                            ),
                                                    (osmglobals.map_styles[attributes.map_style].dependency === 'apikey' || osmglobals.map_styles[attributes.map_style].dependency === 'accesstoken') &&
                                                    element.createElement(components.TextControl, {
                                                        label: i18n.__("Map Style Key", 'sbs-wp-openstreetmap'),
                                                        help: i18n.__('You need an api key or acess token to use the chosen map style. Please inform yourself on the website of the provider.', 'sbs-wp-openstreetmap'),
                                                        type: 'string',
                                                        value: attributes.map_style_key,
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                map_style_key: value
                                                            });
                                                        }
                                                    }),
                                                    (osmglobals.map_styles[attributes.map_style].dependency === 'whitelist') &&
                                                    element.createElement('div', {
                                                        className: 'components-base-control'
                                                    },
                                                            i18n.__('You need to whitelist your domain to use the chosen map style. Please inform yourself on the website of the provider.', 'sbs-wp-openstreetmap')
                                                            ),
                                                    element.createElement(components.SelectControl, {
                                                        label: i18n.__('Map Height in Relation to Width', 'sbs-wp-openstreetmap'),
                                                        value: attributes.map_height,
                                                        options: [
                                                            {label: '20%', value: 20},
                                                            {label: '30%', value: 30},
                                                            {label: '50%', value: 50},
                                                            {label: '60%', value: 60},
                                                            {label: '100%', value: 100},
                                                        ],
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                map_height: parseInt(value)
                                                            });
                                                        }
                                                    }),
                                                    element.createElement(components.RangeControl, {
                                                        label: i18n.__('Zoom Level', 'sbs-wp-openstreetmap'),
                                                        value: attributes.zoom,
                                                        min: 10,
                                                        max: 20,
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                zoom: parseInt(value)
                                                            });
                                                        }
                                                    }),
                                                    element.createElement(components.CheckboxControl, {
                                                        label: i18n.__('Zoom With CTRL-Key Only', 'sbs-wp-openstreetmap'),
                                                        checked: attributes.ctrl_mouse_zoom === true || attributes.ctrl_mouse_zoom === 'true',
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                ctrl_mouse_zoom: value
                                                            });
                                                        }
                                                    }),
                                                    element.createElement(components.TextControl, {
                                                        label: i18n.__("Latitude of the Map's Center", 'sbs-wp-openstreetmap'),
                                                        help: i18n.__('Only needed if marker is not the center of the map', 'sbs-wp-openstreetmap'),
                                                        type: 'number',
                                                        value: _this.props.attributes.latitude,
                                                        onChange: function onChange(value) {
                                                            _this.update = false;
                                                            _this.props.setAttributes({
                                                                latitude: value
                                                            });
                                                            if (timer !== null) {
                                                                clearTimeout(timer);
                                                                timer = null;
                                                            }
                                                            timer = setTimeout(function () {
                                                                _this.update = true;
                                                                if (isNaN(parseFloat(value))) {
                                                                    _this.props.setAttributes({
                                                                        latitude: undefined
                                                                    });
                                                                } else {
                                                                    _this.props.setAttributes({
                                                                        latitude: parseFloat(value)
                                                                    });
                                                                }
                                                            }, 1000);
                                                        },
                                                    }),
                                                    element.createElement(components.TextControl, {
                                                        label: i18n.__("Longitude of the Map's Center", 'sbs-wp-openstreetmap'),
                                                        help: i18n.__('Only needed if marker is not the center of the map', 'sbs-wp-openstreetmap'),
                                                        type: 'number',
                                                        value: _this.props.attributes.longitude,
                                                        onChange: function onChange(value) {
                                                            _this.update = false;
                                                            _this.props.setAttributes({
                                                                longitude: value
                                                            });
                                                            if (timer !== null) {
                                                                clearTimeout(timer);
                                                                timer = null;
                                                            }
                                                            timer = setTimeout(function () {
                                                                _this.update = true;
                                                                if (isNaN(parseFloat(value))) {
                                                                    _this.props.setAttributes({
                                                                        longitude: undefined
                                                                    });
                                                                } else {
                                                                    _this.props.setAttributes({
                                                                        longitude: parseFloat(value)
                                                                    });
                                                                }
                                                            }, 1000);
                                                        }
                                                    }),
                                                    element.createElement(components.CheckboxControl, {
                                                        label: i18n.__('Activate Routing', 'sbs-wp-openstreetmap'),
                                                        checked: attributes.routing === true || attributes.routing === 'true',
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                routing: value
                                                            });
                                                        }
                                                    }),
                                                    element.createElement(components.CheckboxControl, {
                                                        label: i18n.__('Show Attribution', 'sbs-wp-openstreetmap'),
                                                        help: i18n.__('Attributions for content providers are shown as links on the bottom right corner of the map. If you disable the checkbox please consider the legal circumstances.', 'sbs-wp-openstreetmap'),
                                                        checked: attributes.show_attribution === true || attributes.show_attribution === 'true',
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                show_attribution: value
                                                            });
                                                        }
                                                    })
                                                    ),
                                            (attributes.routing === 'true' || attributes.routing === true) &&
                                            element.createElement(components.PanelBody, {
                                                title: i18n.__('Routing', 'sbs-wp-openstreetmap'),
                                                initialOpen: false
                                            },
                                                    element.createElement(components.SelectControl, {
                                                        label: i18n.__('Default Routing Destination', 'sbs-wp-openstreetmap'),
                                                        value: attributes.destination_marker,
                                                        options: [
                                                            {
                                                                label: (i18n.__('No Marker', 'sbs-wp-openstreetmap')),
                                                                value: -1
                                                            }
                                                        ].concat(
                                                                Object.keys(attributes.marker_list).map(function (key) {
                                                            return {
                                                                label: (i18n.__('Marker', 'sbs-wp-openstreetmap') + ' ' + (parseInt(key) + 1)),
                                                                value: parseInt(key)
                                                            };
                                                        })),
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                destination_marker: parseInt(value)
                                                            });
                                                        }
                                                    }),
                                                    (attributes.routing === 'true' || attributes.routing === true) &&
                                                    element.createElement(components.SelectControl, {
                                                        label: i18n.__('Routing Service', 'sbs-wp-openstreetmap'),
                                                        value: attributes.router,
                                                        options: Object.entries(osmglobals.routers).map(function (entry) {
                                                            return {
                                                                label: entry[1].label,
                                                                value: entry[0]
                                                            };
                                                        }),
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                router: value
                                                            });
                                                        }
                                                    }),
                                                    (attributes.router === 'osrmv1') &&
                                                    element.createElement('div', {
                                                        className: 'components-base-control css-1gbp77-StyledHelp'
                                                    },
                                                            i18n.__('This plugin uses OSRM`s demo server by default for demonstration purpose of the routing option. However it is not suitable for actual use as a routing service, as the server can deny access at any time or may not be available at all times. Please choose a different routing service for actual use on your website.', 'sbs-wp-openstreetmap')
                                                            ),
                                                    element.createElement(components.ExternalLink, {
                                                        className: 'router_term_link',
                                                        href: osmglobals.routers[attributes.router].terms
                                                    }, osmglobals.routers[attributes.router].label + ' ' + i18n.__('Terms of Use', 'sbs-wp-openstreetmap')),
                                                    (osmglobals.routers[attributes.router].dependency === 'apikey') &&
                                                    element.createElement(components.TextControl, {
                                                        label: i18n.__("Routing Key", 'sbs-wp-openstreetmap'),
                                                        help: i18n.__('You need an api key or an access token to use the chosen routing service. Please inform yourself on the website of the service provider. If chosen provider is same as map style provider, leave field empty to use key from map style key field.', 'sbs-wp-openstreetmap'),
                                                        type: 'string',
                                                        value: attributes.router_key,
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                router_key: value
                                                            });
                                                        }
                                                    }),
                                                    ),
                                            element.createElement(components.PanelBody, {
                                                title: i18n.__('Geocoding', 'sbs-wp-openstreetmap'),
                                                initialOpen: false
                                            },
                                                    element.createElement('div', {
                                                        className: 'components-base-control css-1gbp77-StyledHelp'
                                                    },
                                                            i18n.__('Geocoding is used for translating an address to latitude and longitude when choosing address as source for the marker position or when routing is activated.', 'sbs-wp-openstreetmap')
                                                            ),
                                                    element.createElement(components.SelectControl, {
                                                        label: i18n.__('Geocoding Service', 'sbs-wp-openstreetmap'),
                                                        value: attributes.geocoder,
                                                        options: Object.entries(osmglobals.geocoders).map(function (entry) {
                                                            return {
                                                                label: entry[1].label,
                                                                value: entry[0]
                                                            };
                                                        }),
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                geocoder: value
                                                            });
                                                        }
                                                    }),
                                                    element.createElement(components.ExternalLink, {
                                                        className: 'geocoder_term_link',
                                                        href: osmglobals.geocoders[attributes.geocoder].terms
                                                    },
                                                            osmglobals.geocoders[attributes.geocoder].label + ' ' + i18n.__('Terms of Use', 'sbs-wp-openstreetmap')
                                                            ),
                                                    (osmglobals.geocoders[attributes.geocoder].dependency === 'apikey') &&
                                                    element.createElement(components.TextControl, {
                                                        label: i18n.__("Geocoding Key", 'sbs-wp-openstreetmap'),
                                                        help: i18n.__('You need an api key or an access token to use the chosen geocoding service. Please inform yourself on the website of the service provider. If chosen provider is same as map style provider, leave field empty to use key from map style key field.', 'sbs-wp-openstreetmap'),
                                                        type: 'string',
                                                        value: attributes.geocoder_key,
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                geocoder_key: value
                                                            });
                                                        },
                                                    }),
                                                    ),
                                            element.createElement(components.PanelBody, {
                                                title: i18n.__('Markers', 'sbs-wp-openstreetmap'),
                                                initialOpen: false
                                            },
                                                    element.createElement(components.SelectControl, {
                                                        label: i18n.__('Center map on', 'sbs-wp-openstreetmap'),
                                                        value: attributes.center_marker,
                                                        options: [
                                                            {
                                                                label: (i18n.__('No Marker', 'sbs-wp-openstreetmap')),
                                                                value: -1
                                                            }
                                                        ].concat(
                                                                Object.keys(attributes.marker_list).map(function (key) {
                                                            return {
                                                                label: (i18n.__('Marker', 'sbs-wp-openstreetmap') + ' ' + (parseInt(key) + 1)),
                                                                value: parseInt(key)
                                                            };
                                                        })),
                                                        onChange: function onChange(value) {
                                                            _this.props.setAttributes({
                                                                center_marker: parseInt(value)
                                                            });
                                                        }
                                                    }),
                                                    element.createElement('div', {
                                                        className: 'marker_list'
                                                    },
                                                            attributes.marker_list.map(function (marker, key) {
                                                                return element.createElement('div', {
                                                                    className: 'marker_settings',
                                                                    key: 'marker_' + attributes.block_id + '_' + key
                                                                },
                                                                        element.createElement('div', {
                                                                            className: 'marker_settings_head'
                                                                        },
                                                                                element.createElement(components.Button, {
                                                                                    className: 'marker_settings_toggle',
                                                                                    onClick: function (event) {
                                                                                        jQuery(event.currentTarget).parents('.marker_settings').toggleClass('is-open');
                                                                                        jQuery(event.currentTarget).children('.marker_settings_toggle_icon').toggleClass('dashicons-arrow-down-alt2 dashicons-arrow-up-alt2');
                                                                                    }
                                                                                },
                                                                                        element.createElement('div', {

                                                                                        }, (i18n.__('Marker', 'sbs-wp-openstreetmap')) + ' ' + (key + 1)),
                                                                                        element.createElement(components.Icon, {
                                                                                            className: 'marker_settings_toggle_icon',
                                                                                            icon: 'arrow-down-alt2'
                                                                                        })
                                                                                        ),
                                                                                element.createElement(components.Button, {
                                                                                    className: 'marker_settings_delete',
                                                                                    onClick: function (event) {
                                                                                        _this.deleteMarker(attributes, key);
                                                                                    }
                                                                                },
                                                                                        element.createElement(components.Icon, {
                                                                                            className: 'marker_settings_delete_icon',
                                                                                            icon: 'no'
                                                                                        })
                                                                                        ),
                                                                                ),
                                                                        element.createElement('div', {
                                                                            className: 'marker_settings_body'
                                                                        },
                                                                                element.createElement(components.SelectControl, {
                                                                                    label: i18n.__('Determine Position By', 'sbs-wp-openstreetmap'),
                                                                                    value: marker.marker_source,
                                                                                    options: [
                                                                                        {label: i18n.__('Address', 'sbs-wp-openstreetmap'), value: 'address'},
                                                                                        {label: i18n.__('Coordinates', 'sbs-wp-openstreetmap'), value: 'coordinates'}
                                                                                    ],
                                                                                    onChange: function onChange(value) {
                                                                                        _this.updateMarkerList(attributes, key, 'marker_source', value);
                                                                                    }
                                                                                }),
                                                                                marker.marker_source === 'address' &&
                                                                                element.createElement(components.TextControl, {
                                                                                    label: i18n.__('Address', 'sbs-wp-openstreetmap'),
                                                                                    value: marker.marker_address,
                                                                                    onChange: function onChange(value) {
                                                                                        _this.update = false;
                                                                                        _this.updateMarkerList(attributes, key, 'marker_address', value);
                                                                                        if (timer !== null) {
                                                                                            clearTimeout(timer);
                                                                                            timer = null;
                                                                                        }
                                                                                        timer = setTimeout(function () {
                                                                                            _this.update = true;
                                                                                            _this.updateMarkerList(attributes, key, 'marker_address', value);
                                                                                        }, 1000);
                                                                                    },
                                                                                    onKeyDown: function onKeyDown(event) {
                                                                                        if (event.keyCode === 13) {
                                                                                            if (timer !== null) {
                                                                                                clearTimeout(timer);
                                                                                                timer = null;
                                                                                            }
                                                                                            _this.update = true;
                                                                                            _this._updateMarkerList(attributes, key, 'marker_address', jQuery(event.currentTarget).val());
                                                                                        }
                                                                                    }
                                                                                }),
                                                                                marker.marker_source === 'coordinates' &&
                                                                                element.createElement(components.TextControl, {
                                                                                    label: i18n.__('Latitude', 'sbs-wp-openstreetmap'),
                                                                                    type: 'number',
                                                                                    value: marker.marker_latitude,
                                                                                    onChange: function onChange(value) {
                                                                                        _this.update = false;
                                                                                        _this.updateMarkerList(attributes, key, 'marker_latitude', value);
                                                                                        if (timer !== null) {
                                                                                            clearTimeout(timer);
                                                                                            timer = null;
                                                                                        }
                                                                                        timer = setTimeout(function () {
                                                                                            _this.update = true;
                                                                                            _this.updateMarkerList(attributes, key, 'marker_latitude', value);
                                                                                        }, 1000);
                                                                                    }
                                                                                }),
                                                                                marker.marker_source === 'coordinates' &&
                                                                                element.createElement(components.TextControl, {
                                                                                    label: i18n.__('Longitude', 'sbs-wp-openstreetmap'),
                                                                                    type: 'number',
                                                                                    value: marker.marker_longitude,
                                                                                    onChange: function onChange(value) {
                                                                                        _this.update = false;
                                                                                        _this.updateMarkerList(attributes, key, 'marker_longitude', value);
                                                                                        if (timer !== null) {
                                                                                            clearTimeout(timer);
                                                                                            timer = null;
                                                                                        }
                                                                                        timer = setTimeout(function () {
                                                                                            _this.update = true;
                                                                                            _this.updateMarkerList(attributes, key, 'marker_longitude', value);
                                                                                        }, 1000);
                                                                                    }

                                                                                }),
                                                                                element.createElement(FontIconPicker, {
                                                                                    icons: osmglobals.icons.map(function (entry) {
                                                                                        return Object.keys(entry)[0];
                                                                                    }),
                                                                                    theme: 'default',
                                                                                    value: marker.marker_icon,
                                                                                    onChange: function onChange(value) {
                                                                                        if (marker.marker_icon !== value) {
                                                                                            _this.updateMarkerList(attributes, key, 'marker_icon', value);
                                                                                        }
                                                                                    },
                                                                                    allCatPlaceholder: i18n.__('Show From All', 'sbs-wp-openstreetmap'),
                                                                                    searchPlaceholder: i18n.__('Search Icons', 'sbs-wp-openstreetmap'),
                                                                                    noIconPlaceholder: i18n.__('No Icons Found', 'sbs-wp-openstreetmap'),
                                                                                    noSelectedPlaceholder: i18n.__('Select Icon', 'sbs-wp-openstreetmap')
                                                                                }),
                                                                                element.createElement(components.SelectControl, {
                                                                                    label: i18n.__('Color', 'sbs-wp-openstreetmap'),
                                                                                    value: marker.marker_color,
                                                                                    options: [
                                                                                        {label: i18n.__('Red', 'sbs-wp-openstreetmap'), value: 'red'},
                                                                                        {label: i18n.__('White', 'sbs-wp-openstreetmap'), value: 'white'},
                                                                                        {label: i18n.__('Blue', 'sbs-wp-openstreetmap'), value: 'dark_blue'},
                                                                                        {label: i18n.__('Green', 'sbs-wp-openstreetmap'), value: 'green'},
                                                                                        {label: i18n.__('Black', 'sbs-wp-openstreetmap'), value: 'black'},
                                                                                        {label: i18n.__('Orange', 'sbs-wp-openstreetmap'), value: 'orange'},
                                                                                        {label: i18n.__('Yellow', 'sbs-wp-openstreetmap'), value: 'yellow'},
//                                                                                        {label: i18n.__('Individual Color', 'sbs-wp-openstreetmap'), value: 'individual'},
                                                                                    ],
                                                                                    onChange: function onChange(value) {
                                                                                        _this.updateMarkerList(attributes, key, 'marker_color', value);
                                                                                    }
                                                                                }),
//                                                                                marker.marker_color === 'individual' &&
//                                                                                element.createElement(components.ColorPicker, {
//                                                                                    color: marker.individual_marker_color || '#00518c',
//                                                                                    disableAlpha: true,
//                                                                                    onChangeComplete: function onChange(value) {
//                                                                                        _this.update = false;
//                                                                                        _this.updateMarkerList(attributes, key, 'individual_marker_color', value.hex);
//                                                                                        if (timer !== null) {
//                                                                                            clearTimeout(timer);
//                                                                                            timer = null;
//                                                                                        }
//                                                                                        timer = setTimeout(function () {
//                                                                                            _this.update = true;
//                                                                                            _this.updateMarkerList(attributes, key, 'individual_marker_color', value.hex);
//                                                                                        }, 500);
//                                                                                    }
//                                                                                }),
                                                                                element.createElement(components.TextareaControl, {
                                                                                    label: i18n.__('Popup Text', 'sbs-wp-openstreetmap'),
                                                                                    value: marker.marker_text,
                                                                                    onChange: function onChange(value) {
                                                                                        _this.update = false;
                                                                                        _this.updateMarkerList(attributes, key, 'marker_text', value);
                                                                                        if (timer !== null) {
                                                                                            clearTimeout(timer);
                                                                                            timer = null;
                                                                                        }
                                                                                        timer = setTimeout(function () {
                                                                                            _this.update = true;
                                                                                            _this.updateMarkerList(attributes, key, 'marker_text', value);
                                                                                        }, 1000);
                                                                                    }
                                                                                }),
                                                                                )
                                                                        );
                                                            }),
                                                            (attributes.marker_list.length < 2) &&
                                                            element.createElement(components.Button, {
                                                                className: 'marker_settings_add is-primary',
                                                                onClick: function (event) {
                                                                    _this.addMarker(attributes);
                                                                }
                                                            }, element.createElement(components.Icon, {
                                                                className: 'marker_settings_add_icon',
                                                                icon: 'plus'
                                                            }),
                                                                    i18n.__('Add Marker', 'sbs-wp-openstreetmap'))
                                                            )
                                                    )
                                            )
                                    )
                        ]);
                    }
                }, {
                    key: 'updateMarkerList',
                    value: function updateMarkerList(attributes, marker_key, attribute, value) {
                        var newlist = attributes.marker_list.slice();
                        newlist[marker_key][attribute] = value;
                        this.props.setAttributes({
                            marker_list: newlist
                        });
                    }
                }, {
                    key: 'deleteMarker',
                    value: function deleteMarker(attributes, marker_key) {
                        var newlist = attributes.marker_list.slice();
                        newlist.splice(marker_key, 1);
                        if (newlist.length < 1) {
                            this.props.setAttributes({
                                marker_list: newlist,
                                destination_marker: -1,
                                center_marker: -1
                            });
                        } else {
                            this.props.setAttributes({
                                marker_list: newlist
                            });
                        }

                    }
                }, {
                    key: 'addMarker',
                    value: function addMarker(attributes) {
                        var newlist = attributes.marker_list.slice();
                        var defaults = Object.assign({}, osmglobals.defaults_marker);
                        newlist.push(defaults);
                        this.props.setAttributes({
                            marker_list: newlist
                        });
                    }
                }
            ]);
            return edit;
        }(element.Component),
        save: function (props) {
            var attributes = classutils._objectSpread({}, osmglobals.defaults || {}, props.attributes);
            return element.createElement('div', {
                id: 'sbs-openstreetmap-block-' + attributes.block_id,
                className: 'sbs_openstreetmap_module',
                'data-map-style': attributes.map_style,
                'data-map-style-key': attributes.map_style_key,
                'data-zoom': attributes.zoom,
                'data-ctrl-mouse-zoom': attributes.ctrl_mouse_zoom,
                'data-latitude': attributes.latitude,
                'data-longitude': attributes.longitude,
                'data-routing': attributes.routing,
                'data-destination-marker': attributes.destination_marker,
                'data-router': attributes.router,
                'data-router-key': attributes.router_key,
                'data-show-attribution': attributes.show_attribution,
                'data-geocoder': attributes.geocoder,
                'data-geocoder-key': attributes.geocoder_key,
                'data-center-marker': attributes.center_marker,
                'data-marker-list': JSON.stringify(attributes.marker_list)
            }, element.createElement('div', {
                className: 'sbs_openstreetmap_container',
                style: {
                    paddingBottom: attributes.map_height + '%'
                }
            }));
        },
        deprecated: [
            {
                attributes: {
                    block_id: {
                        type: 'string',
                        default: osmglobals.defaults.block_id || ''
                    },
                    map_style: {
                        type: 'string',
                        default: 'openstreetmap_de'
                    },
                    api_key: {
                        type: 'string',
                        default: osmglobals.defaults.api_key || null
                    },
                    access_token: {
                        type: 'string',
                        default: osmglobals.defaults.access_token || null
                    },
                    map_height: {
                        type: 'integer',
                        default: parseInt(osmglobals.defaults.map_height) || null
                    },
                    zoom: {
                        type: 'integer',
                        default: parseInt(osmglobals.defaults.zoom) || null
                    },
                    ctrl_mouse_zoom: {
                        type: 'boolean',
                        default: osmglobals.defaults.ctrl_mouse_zoom === true || osmglobals.defaults.ctrl_mouse_zoom === 'true' || false
                    },
                    latitude: {
                        type: 'number',
                        default: osmglobals.defaults.latitude || ''
                    },
                    longitude: {
                        type: 'number',
                        default: osmglobals.defaults.longitude || ''
                    },
                    show_attribution: {
                        type: 'boolean',
                        default: osmglobals.defaults.show_attribution === true || osmglobals.defaults.show_attribution === 'true' || false
                    },
                    marker_source: {
                        type: 'string',
                        default: osmglobals.defaults_marker.marker_source || ''
                    },
                    marker_address: {
                        type: 'string',
                        default: osmglobals.defaults_marker.marker_address || ''
                    },
                    marker_latitude: {
                        type: 'number',
                        default: osmglobals.defaults_marker.marker_latitude || ''
                    },
                    marker_longitude: {
                        type: 'number',
                        default: osmglobals.defaults_marker.marker_longitude || ''
                    },
                    marker_center: {
                        type: 'boolean',
                        default: osmglobals.defaults_marker.marker_center === true || osmglobals.defaults_marker.marker_center === 'true' || false
                    },
                    marker_icon: {
                        type: 'string',
                        default: osmglobals.defaults_marker.marker_icon || ''
                    },
                    marker_color: {
                        type: 'string',
                        default: osmglobals.defaults_marker.marker_color || null
                    },
                    marker_text: {
                        type: 'string'
                    }
                },
                supports: {
                    align: ['wide', 'full']
                },
                migrate: function (attributes) {
                    var marker_list = [
                        {
                            marker_source: attributes.marker_source,
                            marker_address: attributes.marker_address,
                            marker_latitude: attributes.marker_latitude,
                            marker_longitude: attributes.marker_longitude,
                            marker_icon: attributes.marker_icon,
                            marker_color: attributes.marker_color,
                            marker_text: attributes.marker_text
                        }
                    ];
                    var center_marker = '0';
                    if (typeof attributes.marker_center !== 'undefined' && attributes.marker_center == false)
                        center_marker = '-1';
                    var map_style_key = null;
                    if (attributes.map_style in osmglobals.deprecated_styles) {
                        attributes.map_style = osmglobals.deprecated_styles[attributes.map_style];
                    }
                    if (osmglobals.map_styles[attributes.map_style].dependency === 'accesstoken') {
                        var map_style_key = attributes.access_token;
                    } else if (osmglobals.map_styles[attributes.map_style].dependency === 'apikey') {
                        var map_style_key = attributes.api_key;
                    }
                    var attributes = classutils._objectSpread({}, attributes, {marker_list: marker_list, map_style_key: map_style_key, center_marker: center_marker});
                    return attributes;
                },
                save: function (props) {
                    var attributes = classutils._objectSpread({}, osmglobals.defaults || {}, props.attributes);
                    return element.createElement('div', {
                        id: 'sbs-openstreetmap-block-' + attributes.block_id,
                        className: 'sbs_openstreetmap_module',
                        'data-style': attributes.map_style,
                        'data-api-key': attributes.api_key,
                        'data-access-token': attributes.access_token,
                        'data-zoom': attributes.zoom,
                        'data-zoomable': attributes.ctrl_mouse_zoom,
                        'data-latitude': attributes.latitude,
                        'data-longitude': attributes.longitude,
                        'data-show-attribution': attributes.show_attribution,
                        'data-marker-source': attributes.marker_source,
                        'data-marker-address': attributes.marker_address,
                        'data-marker-latitude': attributes.marker_latitude,
                        'data-marker-longitude': attributes.marker_longitude,
                        'data-marker-center': attributes.marker_center,
                        'data-marker-icon': attributes.marker_icon,
                        'data-marker-color': attributes.marker_color,
                        'data-marker-text': attributes.marker_text
                    }, element.createElement('div', {
                        className: 'sbs_openstreetmap_container',
                        style: {
                            paddingBottom: attributes.map_height + '%'
                        }
                    }));
                }
            }
        ]
    });
})(window.wp.blocks, window.wp.element, window.wp.editor, window.wp.blockEditor, window.wp.components, window.wp.i18n, window.stepbyteservice, window.stepbyteservice.classutils, window.stepbyteservice.osmglobals);
