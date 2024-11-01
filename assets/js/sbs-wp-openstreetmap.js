(function ($, stepbyteservice) {
    'use strict';
    stepbyteservice.classutils = {
        _inherits: function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
            if (superClass)
                stepbyteservice.classutils._setPrototypeOf(subClass, superClass);
        },
        _classCallCheck: function _classCallCheck(instance, Constructor) {
            if (!stepbyteservice.classutils._instanceof(instance, Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        },
        _possibleConstructorReturn: function _possibleConstructorReturn(self, call) {
            if (call && (stepbyteservice.classutils._typeof(call) === "object" || typeof call === "function")) {
                return call;
            }
            return stepbyteservice.classutils._assertThisInitialized(self);
        },
        _setPrototypeOf: function _setPrototypeOf(o, p) {
            var _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                o.__proto__ = p;
                return o;
            };
            return _setPrototypeOf(o, p);
        },
        _defineProperties: function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        },
        _createClass: function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
                stepbyteservice.classutils._defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                stepbyteservice.classutils._defineProperties(Constructor, staticProps);
            return Constructor;
        },
        _instanceof: function _instanceof(left, right) {
            if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
                return !!right[Symbol.hasInstance](left);
            } else {
                return left instanceof right;
            }
        },
        _getPrototypeOf: function _getPrototypeOf(o) {
            var _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            };
            return _getPrototypeOf(o);
        },
        _assertThisInitialized: function _assertThisInitialized(self) {
            if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self;
        },
        _defineProperty: function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                obj[key] = value;
            }

            return obj;
        },
        _objectSpread: function _objectSpread(target) {
            var _this = this;
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i] != null ? arguments[i] : {};
                var ownKeys = Object.keys(source);
                if (typeof Object.getOwnPropertySymbols === 'function') {
                    ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
                        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                    }));
                }

                ownKeys.forEach(function (key) {
                    _this._defineProperty(target, key, source[key]);
                });
            }

            return target;
        },
    }

    stepbyteservice.OpenStreetMap = function ($, classutils, osmglobals) {
        var DATA_KEY = 'stepbyteservice.openstreetmap';
        function OpenStreetMap(element) {
            classutils._classCallCheck(this, OpenStreetMap);
            this.map = null;
            this.control = null;
            this.geocodingResults = [];
        }

        classutils._createClass(OpenStreetMap, [{
                key: 'initMap',
                value: function initMap(element) {
                    if (this.control) {
                        this.map.removeControl(this.control);
                        this.control = null;
                    }
                    if (this.map) {
                        this.map.remove();
                        this.map = null;
                    }
                    element = $(element);
                    var container = element.find('.sbs_openstreetmap_container');
                    if (element.length === 0 || container.length === 0)
                        return;
                    var _this = this;
                    var mapStyle = element.attr('data-map-style') || element.attr('data-style') || osmglobals.defaults.map_style || null;
                    if (mapStyle in osmglobals.deprecated_styles)
                        mapStyle = osmglobals.deprecated_styles[mapStyle];
                    var mapStyleKey = element.attr('data-map-style-key') || osmglobals.defaults.map_style_key || null;
                    var zoom = element.attr('data-zoom') || osmglobals.defaults.zoom || 1;
                    var ctrlMouseZoom = element.attr('data-ctrl-mouse-zoom') || element.attr('zoomable') || osmglobals.defaults.ctrl_mouse_zoom || false;
                    var latitude = element.attr('data-latitude') || osmglobals.defaults.latitude || 0;
                    var longitude = element.attr('data-longitude') || osmglobals.defaults.longitude || 0;
                    var routing = element.attr('data-routing') || osmglobals.defaults.routing || false;
                    var geocoder = element.attr('data-geocoder') || osmglobals.defaults.geocoder || null;
                    var geocoderKey = element.attr('data-geocoder-key') || osmglobals.defaults.geocoder_key || null;
                    var router = element.attr('data-router') || osmglobals.defaults.router || null;
                    var routerKey = element.attr('data-router-key') || osmglobals.defaults.router_key || null;
                    var showAttribution = element.attr('data-show-attribution') || osmglobals.defaults.show_attribution || false;
                    var centerMarker = element.attr('data-center-marker') || osmglobals.defaults.center_marker || 0;
                    var destinationMarker = element.attr('data-destination-marker') || osmglobals.defaults.destination_marker || 0;
                    var userLang = navigator.language || navigator.userLanguage;
                    var markerList = typeof element.attr('data-marker-list') !== 'undefined' ? JSON.parse(element.attr('data-marker-list')) : [];
                    var markerElements = element.find('.marker_list .marker_element');
                    if (markerElements.length != 0) {
                        [].forEach.call(markerElements, function (marker, key) {
                            $(marker).find('.marker_number').html(key + 1);
                        });
                    }
                    if (markerList.length === 0 && markerElements.length != 0) {
                        [].forEach.call(markerElements, function (marker) {
                            marker = $(marker);
                            markerList.push({
                                marker_source: marker.attr('data-marker-source'),
                                marker_address: marker.attr('data-marker-address'),
                                marker_latitude: marker.attr('data-marker-latitude'),
                                marker_longitude: marker.attr('data-marker-longitude'),
                                marker_icon: marker.attr('data-marker-icon'),
                                marker_color: marker.attr('data-marker-color'),
                                marker_text: marker.attr('data-marker-text')
                            });
                        });
                        element.attr('data-marker-list', JSON.stringify(markerList));
                    } else if (markerList.length === 0 && markerElements.length === 0) {
                        // support old gutenberg blocks in frontend
                        var marker = {};
                        $.each(element.data(), function(i,v) {
                            if (i === 'markerCenter' && v == false) {
                                centerMarker = '-1';
                                element.attr('data-center-marker', '-1')
                            }else if (i.startsWith('marker') && i !== 'markerList') {
                                i = i.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                                marker[i] = v;
                            }
                        });
                        if (Object.keys(marker).length !== 0) {
                            markerList.push(marker);
                            element.attr('data-marker-list', JSON.stringify(markerList)); 
                        }
                    }
                    var mapConfigs = {
                        center: [latitude, longitude],
                        trackResize: true,
                        zoom: zoom,
                        gestureHandling: ctrlMouseZoom === true || ctrlMouseZoom === 'true',
                        attributionControl: false
                    };
                    if (showAttribution === true || showAttribution === 'true') {
                        mapConfigs.attributionControl = true;
                    }
                    this.map = L.map(container[0], mapConfigs);
                    var providerOptions = {};
                    var providerStyle = mapStyle;

                    switch (osmglobals.map_styles[mapStyle].dependency) {
                        case 'apikey':
                            mapStyleKey = mapStyleKey || element.attr('data-api-key') || null;
                            providerStyle.startsWith('MapTiler') ? providerOptions.key = mapStyleKey : providerOptions.apikey = mapStyleKey;
                            break;
                        case 'accesstoken':
                            mapStyleKey = mapStyleKey || element.attr('data-access-token') || null;
                            if (providerStyle.startsWith('MapBox')) {
                                var provider = mapStyle.split('.');
                                providerStyle = provider[0];
                                providerOptions.id = osmglobals.mapbox_styles[provider[1]];
                            }
                            providerOptions.accessToken = mapStyleKey;
                            break;
                        default:
                            break;
                    }
                    // user mapStyleKey for geocoding/routing if provider is the same
                    if (routerKey === null && providerStyle.toLowerCase() === router)
                        routerKey = mapStyleKey;
                    if (geocoderKey === null && providerStyle.toLowerCase() === geocoder)
                        geocoderKey = mapStyleKey;
                    var geocodingOptions = {
                        defaultMarkGeocode: false
                    };
                    if (osmglobals.geocoders[geocoder].dependency === 'apikey')
                        geocodingOptions['apiKey'] = geocoderKey;
                    var layer = L.tileLayer.provider(providerStyle, providerOptions);
                    this.map.addLayer(layer);
                    markerList.forEach(function (marker, key) {
//                        if (marker.marker_color === 'individual') {
//                            marker.individual_color = true;
//                            marker.marker_color = (isValidHex(marker.individual_marker_color)) ? marker.individual_marker_color : '#00518c';
//                            marker.icon_color = isDark(marker.marker_color) ? '#FFF' : '#000';
//                        } else if (marker.marker_color.startsWith('#')) {
//                            marker.individual_color = true;
//                            if (!isValidHex(marker.marker_color)) {
//                                marker.marker_color = '#00518c';
//                            }
//                            marker.icon_color = isDark(marker.marker_color) ? '#FFF' : '#000';
//                        } else {
//                            marker.individual_color = false;
//                        }
                        if (marker.marker_source === 'address') {
                            if (marker.marker_address) {
                                try {
                                    var provider = L.Control.Geocoder[geocoder](geocodingOptions);
                                    if (typeof _this.geocodingResults[key] !== 'undefined' && _this.geocodingResults[key].address === marker.marker_address) {
                                        placeMarker(_this.geocodingResults[key].value, key, marker);
                                    } else {
                                        provider.geocode(marker.marker_address, function (value) {
                                            _this.geocodingResults[key] = {
                                                address: marker.marker_address,
                                                value: value
                                            }
                                            placeMarker(value, key, marker);
                                        });
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            } else {
                                if ((routing === true || routing === 'true') && destinationMarker == key) {
                                    if (_this.control === null) {
                                        createRouting(null, null, key);
                                    }
                                }
                            }
                        } else if (marker.marker_latitude != 0 && marker.marker_longitude != 0) {
                            if ((routing === true || routing === 'true') && destinationMarker == key) {
                                if (_this.control === null) {
                                    createRouting(marker.marker_latitude, marker.marker_longitude, key);
                                }
                            } else {
                                var markerSymbol = L.marker([marker.marker_latitude, marker.marker_longitude], {icon: L.divIcon({
//                                        html: '<div class="sbs_marker_body ' + (marker.individual_color ? '' : marker.marker_color) + '"><svg version="1.1" class="sbs_marker_background" ' + (marker.individual_color ? 'fill="' + marker.marker_color + '" ' : '') + 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve"><path d="M24,46C24,25.2,40.1,8.3,60,8.3S96,25.2,96,46c0,7.1-3.6,16.7-10.1,28.7c-2,3.6-4.2,7.4-6.5,11.3c-3.5,5.8-7.3,11.5-11.1,17c-1.3,1.9-2.6,3.6-3.7,5.2c-0.4,0.5-0.7,1-1,1.4c-0.2,0.2-0.3,0.4-0.4,0.5c-1.6,2.2-4.7,2.2-6.3,0c-0.1-0.1-0.2-0.3-0.4-0.5c-0.3-0.4-0.6-0.9-1-1.4c-1.1-1.5-2.3-3.3-3.7-5.2c-3.8-5.5-7.6-11.2-11.1-17c-2.4-3.9-4.6-7.7-6.5-11.3C27.6,62.7,24,53.1,24,46z"/></svg><i class="' + marker.marker_icon + ' sbs_marker_icon" ' + (marker.individual_color ? 'style="color:' + marker.icon_color + ';"' : '') + '></i></div>',
                                        html: '<div class="sbs_marker_body ' + marker.marker_color + '"><svg version="1.1" class="sbs_marker_background" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve"><path d="M24,46C24,25.2,40.1,8.3,60,8.3S96,25.2,96,46c0,7.1-3.6,16.7-10.1,28.7c-2,3.6-4.2,7.4-6.5,11.3c-3.5,5.8-7.3,11.5-11.1,17c-1.3,1.9-2.6,3.6-3.7,5.2c-0.4,0.5-0.7,1-1,1.4c-0.2,0.2-0.3,0.4-0.4,0.5c-1.6,2.2-4.7,2.2-6.3,0c-0.1-0.1-0.2-0.3-0.4-0.5c-0.3-0.4-0.6-0.9-1-1.4c-1.1-1.5-2.3-3.3-3.7-5.2c-3.8-5.5-7.6-11.2-11.1-17c-2.4-3.9-4.6-7.7-6.5-11.3C27.6,62.7,24,53.1,24,46z"/></svg><i class="' + marker.marker_icon + ' sbs_marker_icon"></i></div>',
                                        iconSize: [46, 46],
                                        iconAnchor: [23, 45],
                                        popupAnchor: [0, -37],
                                        className: 'sbs_map_marker'
                                    })}).addTo(_this.map);
                                if (marker.marker_text)
                                    markerSymbol.bindPopup(marker.marker_text);
                                if (centerMarker == key) {
                                    _this.map.panTo([marker.marker_latitude, marker.marker_longitude]);
                                }
                            }
                        }
                    });

                    if ((routing === true || routing === 'true') && (destinationMarker === '-1' || markerList.length < 1)) {
                        if (_this.control === null) {
                            createRouting(null, null, null);
                        }
                    }
                    // routing buttons mapbox
                    if ((routing === true || routing === 'true') && router === 'mapbox') {
                        var RoutingButtons = L.Control.extend({
                            options: {
                                position: 'topleft'
                            },
                            onAdd: function (map) {
                                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                                var walkButton = L.DomUtil.create('div', 'leaflet-walk-button leaflet-routing-button', container);
                                var walkIcon = L.DomUtil.create('i', 'sbs-map-icon sbs-map-directions-walk', walkButton);
                                var bikeButton = L.DomUtil.create('div', 'leaflet-bike-button leaflet-routing-button', container);
                                var bikeIcon = L.DomUtil.create('i', 'sbs-map-icon sbs-map-directions-bike', bikeButton);
                                var carButton = L.DomUtil.create('div', 'leaflet-car-button leaflet-routing-button', container);
                                var carIcon = L.DomUtil.create('i', 'sbs-map-icon sbs-map-directions-car', carButton);
                                walkButton.onclick = function () {
                                    _this.control.getRouter().options.profile = 'mapbox/walking';
                                    element.find('.start_marker .sbs_marker_icon').removeClass('sbs-map-directions-walk sbs-map-directions-bike sbs-map-directions-car').addClass('sbs-map-directions-walk');
                                    _this.control.route();
                                };
                                bikeButton.onclick = function () {
                                    _this.control.getRouter().options.profile = 'mapbox/cycling';
                                    element.find('.start_marker .sbs_marker_icon').removeClass('sbs-map-directions-walk sbs-map-directions-bike sbs-map-directions-car').addClass('sbs-map-directions-bike');
                                    _this.control.route();
                                };
                                carButton.onclick = function () {
                                    _this.control.getRouter().options.profile = 'mapbox/driving-traffic';
                                    element.find('.start_marker .sbs_marker_icon').removeClass('sbs-map-directions-walk sbs-map-directions-bike sbs-map-directions-car').addClass('sbs-map-directions-car');
                                    _this.control.route();
                                };
                                return container;
                            }
                        });
                        this.map.addControl(new RoutingButtons);
                    }

                    function placeMarker(geocodingResult, key, marker) {
                        if (typeof geocodingResult[0] !== 'undefined') {
                            marker.marker_longitude = geocodingResult[0]['center'].lng;
                            marker.marker_latitude = geocodingResult[0]['center'].lat;
                            if ((routing === true || routing === 'true') && destinationMarker == key) {
                                if (_this.control === null) {
                                    createRouting(marker.marker_latitude, marker.marker_longitude, key);
                                }
                            } else {
                                var markerSymbol = L.marker([marker.marker_latitude, marker.marker_longitude], {icon: L.divIcon({
//                                        html: '<div class="sbs_marker_body ' + (marker.individual_color ? '' : marker.marker_color) + '"><svg version="1.1" class="sbs_marker_background" ' + (marker.individual_color ? 'fill="' + marker.marker_color + '" ' : '') + 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve"><path d="M24,46C24,25.2,40.1,8.3,60,8.3S96,25.2,96,46c0,7.1-3.6,16.7-10.1,28.7c-2,3.6-4.2,7.4-6.5,11.3c-3.5,5.8-7.3,11.5-11.1,17c-1.3,1.9-2.6,3.6-3.7,5.2c-0.4,0.5-0.7,1-1,1.4c-0.2,0.2-0.3,0.4-0.4,0.5c-1.6,2.2-4.7,2.2-6.3,0c-0.1-0.1-0.2-0.3-0.4-0.5c-0.3-0.4-0.6-0.9-1-1.4c-1.1-1.5-2.3-3.3-3.7-5.2c-3.8-5.5-7.6-11.2-11.1-17c-2.4-3.9-4.6-7.7-6.5-11.3C27.6,62.7,24,53.1,24,46z"/></svg><i class="' + marker.marker_icon + ' sbs_marker_icon" ' + (marker.individual_color ? 'style="color:' + marker.icon_color + ';"' : '') + '></i></div>',
                                        html: '<div class="sbs_marker_body ' + marker.marker_color + '"><svg version="1.1" class="sbs_marker_background" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve"><path d="M24,46C24,25.2,40.1,8.3,60,8.3S96,25.2,96,46c0,7.1-3.6,16.7-10.1,28.7c-2,3.6-4.2,7.4-6.5,11.3c-3.5,5.8-7.3,11.5-11.1,17c-1.3,1.9-2.6,3.6-3.7,5.2c-0.4,0.5-0.7,1-1,1.4c-0.2,0.2-0.3,0.4-0.4,0.5c-1.6,2.2-4.7,2.2-6.3,0c-0.1-0.1-0.2-0.3-0.4-0.5c-0.3-0.4-0.6-0.9-1-1.4c-1.1-1.5-2.3-3.3-3.7-5.2c-3.8-5.5-7.6-11.2-11.1-17c-2.4-3.9-4.6-7.7-6.5-11.3C27.6,62.7,24,53.1,24,46z"/></svg><i class="' + marker.marker_icon + ' sbs_marker_icon"></i></div>',
                                        iconSize: [46, 46],
                                        iconAnchor: [23, 45],
                                        popupAnchor: [0, -37],
                                        className: 'sbs_map_marker'
                                    })}).addTo(_this.map);
                                if (marker.marker_text)
                                    markerSymbol.bindPopup(marker.marker_text);
                                if (centerMarker == key) {
                                    _this.map.panTo([marker.marker_latitude, marker.marker_longitude]);
                                }
                            }
                        }
                    }

                    function createRouting(markerLat, markerLong, key) {
                        _this.control = L.Routing.control({
                            router: L.Routing[router](routerKey, {
                                language: userLang.startsWith('de') ? 'de' : 'en',
                            }),
                            plan: L.Routing.plan([L.latLng(), L.latLng(markerLat, markerLong)], {
                                createMarker: function (i, wp, n) {
                                    if (i == 0) {
                                        var profile = _this.control.getRouter().options.profile;
                                        var iconClass = 'sbs-map-directions-car';
                                        switch (profile) {
                                            case 'mapbox/walking':
                                                iconClass = 'sbs-map-directions-walk';
                                                break;
                                            case 'mapbox/cycling':
                                                iconClass = 'sbs-map-directions-bike';
                                                break;
                                            case 'mapbox/driving-traffic':
                                                iconClass = 'sbs-map-directions-car';
                                                break;
                                            default:
                                                break;
                                        }
                                        var markerSymbol = L.marker(wp.latLng, {
                                            icon: L.divIcon({
                                                html: '<div class="sbs_marker_body"><svg viewBox="0 0 120 120" class="sbs_marker_background" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="50" stroke="white" stroke-width="3"/></svg><i class=" sbs-map-icon ' + iconClass + ' sbs_marker_icon"></i></div>',
                                                iconSize: [30, 30],
                                                iconAnchor: [15, 15],
                                                className: 'sbs_map_marker start_marker'
                                            })
                                        });
                                    } else if (wp.latLng.lat == markerLat && wp.latLng.lng == markerLong) {
                                        var markerSymbol = L.marker(wp.latLng, {
                                            icon: L.divIcon({
//                                                html: '<div class="sbs_marker_body ' + (markerList[key].individual_color ? '' : markerList[key].marker_color) + '"><svg version="1.1" class="sbs_marker_background" ' + (markerList[key].individual_color ? 'fill="' + markerList[key].marker_color + '" ' : '') + 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve"><path d="M24,46C24,25.2,40.1,8.3,60,8.3S96,25.2,96,46c0,7.1-3.6,16.7-10.1,28.7c-2,3.6-4.2,7.4-6.5,11.3c-3.5,5.8-7.3,11.5-11.1,17c-1.3,1.9-2.6,3.6-3.7,5.2c-0.4,0.5-0.7,1-1,1.4c-0.2,0.2-0.3,0.4-0.4,0.5c-1.6,2.2-4.7,2.2-6.3,0c-0.1-0.1-0.2-0.3-0.4-0.5c-0.3-0.4-0.6-0.9-1-1.4c-1.1-1.5-2.3-3.3-3.7-5.2c-3.8-5.5-7.6-11.2-11.1-17c-2.4-3.9-4.6-7.7-6.5-11.3C27.6,62.7,24,53.1,24,46z"/></svg><i class="' + markerList[key].marker_icon + ' sbs_marker_icon" ' + (markerList[key].individual_color ? 'style="color:' + markerList[key].icon_color + ';"' : '') + '></i></div>',
                                                html: '<div class="sbs_marker_body ' + markerList[key].marker_color + '"><svg version="1.1" class="sbs_marker_background" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve"><path d="M24,46C24,25.2,40.1,8.3,60,8.3S96,25.2,96,46c0,7.1-3.6,16.7-10.1,28.7c-2,3.6-4.2,7.4-6.5,11.3c-3.5,5.8-7.3,11.5-11.1,17c-1.3,1.9-2.6,3.6-3.7,5.2c-0.4,0.5-0.7,1-1,1.4c-0.2,0.2-0.3,0.4-0.4,0.5c-1.6,2.2-4.7,2.2-6.3,0c-0.1-0.1-0.2-0.3-0.4-0.5c-0.3-0.4-0.6-0.9-1-1.4c-1.1-1.5-2.3-3.3-3.7-5.2c-3.8-5.5-7.6-11.2-11.1-17c-2.4-3.9-4.6-7.7-6.5-11.3C27.6,62.7,24,53.1,24,46z"/></svg><i class="' + markerList[key].marker_icon + ' sbs_marker_icon"></i></div>',
                                                iconSize: [46, 46],
                                                iconAnchor: [23, 45],
                                                popupAnchor: [0, -37],
                                                className: 'sbs_map_marker'
                                            })});
                                        if (markerList[key].marker_text)
                                            markerSymbol.bindPopup(markerList[key].marker_text);
                                        if (centerMarker == key) {
                                            _this.map.panTo(wp.latLng);
                                        }
                                    } else {
                                        var markerExists = false
                                        var markerSymbol = null;
                                        markerList.forEach(function (marker, key) {
                                            if (wp.latLng.lat === marker.marker_latitude || wp.latLng.lng === marker.marker_longitude) {
                                                markerExists = true;
                                            }
                                        });
                                        if (!markerExists) {
                                            markerSymbol = L.marker(wp.latLng, {
                                                icon: L.divIcon({
//                                                    html: '<div class="sbs_marker_body ' + (markerList[key].individual_color ? '' : markerList[key].marker_color) + '"><svg version="1.1" class="sbs_marker_background" ' + (markerList[key].individual_color ? 'fill="' + markerList[key].marker_color + '" ' : '') + 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve"><path d="M24,46C24,25.2,40.1,8.3,60,8.3S96,25.2,96,46c0,7.1-3.6,16.7-10.1,28.7c-2,3.6-4.2,7.4-6.5,11.3c-3.5,5.8-7.3,11.5-11.1,17c-1.3,1.9-2.6,3.6-3.7,5.2c-0.4,0.5-0.7,1-1,1.4c-0.2,0.2-0.3,0.4-0.4,0.5c-1.6,2.2-4.7,2.2-6.3,0c-0.1-0.1-0.2-0.3-0.4-0.5c-0.3-0.4-0.6-0.9-1-1.4c-1.1-1.5-2.3-3.3-3.7-5.2c-3.8-5.5-7.6-11.2-11.1-17c-2.4-3.9-4.6-7.7-6.5-11.3C27.6,62.7,24,53.1,24,46z"/></svg><i class="sbs_marker_icon" ' + (markerList[key].individual_color ? 'style="border:2px solid ' + markerList[key].icon_color + ';"' : '') + '></div>',
                                                    html: '<div class="sbs_marker_body ' + markerList[key].marker_color + '"><svg version="1.1" class="sbs_marker_background" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve"><path d="M24,46C24,25.2,40.1,8.3,60,8.3S96,25.2,96,46c0,7.1-3.6,16.7-10.1,28.7c-2,3.6-4.2,7.4-6.5,11.3c-3.5,5.8-7.3,11.5-11.1,17c-1.3,1.9-2.6,3.6-3.7,5.2c-0.4,0.5-0.7,1-1,1.4c-0.2,0.2-0.3,0.4-0.4,0.5c-1.6,2.2-4.7,2.2-6.3,0c-0.1-0.1-0.2-0.3-0.4-0.5c-0.3-0.4-0.6-0.9-1-1.4c-1.1-1.5-2.3-3.3-3.7-5.2c-3.8-5.5-7.6-11.2-11.1-17c-2.4-3.9-4.6-7.7-6.5-11.3C27.6,62.7,24,53.1,24,46z"/></svg><i class="sbs_marker_icon"></div>',
                                                    iconSize: [36, 36],
                                                    iconAnchor: [18, 35],
                                                    className: 'sbs_map_marker between_marker'
                                                })
                                            });
                                        }
                                    }
                                    return markerSymbol;
                                },
                                geocoderClass: function (i, n) {
                                    if (i === n - 1) {
                                        return 'end_input';
                                    } else if (i === 0) {
                                        return 'start_input';
                                    }
                                },
                                dragStyles: [
                                    {color: 'black', opacity: 0.15, weight: 7},
                                    {color: 'white', opacity: 0.8, weight: 4},
                                    {color: '#007acd', opacity: 1, weight: 2, dashArray: '7,12'}
                                ],
                                geocoder: L.Control.Geocoder[geocoder](geocodingOptions)
                            }),
                            showAlternatives: true,
                            altLineOptions: {
                                styles: [
                                    {color: 'black', opacity: 0.15, weight: 9},
                                    {color: 'white', opacity: 0.8, weight: 6},
                                    {color: '#007acd', opacity: 0.5, weight: 4}
                                ]
                            },
                            lineOptions: {
                                styles: [
                                    {color: 'black', opacity: 0.15, weight: 9},
                                    {color: 'white', opacity: 0.8, weight: 6},
                                    {color: '#007acd', opacity: 1, weight: 4}
                                ],
                                missingRouteStyles: [
                                    {color: 'black', opacity: 0.15, weight: 9},
                                    {color: 'white', opacity: 0.8, weight: 6},
                                    {color: '#007acd', opacity: 0.8, weight: 4, dashArray: '7,12'}
                                ]
                            },
                            pointMarkerStyle: {
                                radius: 4,
                                color: '#00518c',
                                fillColor: 'white',
                                opacity: 1,
                                fillOpacity: 0.7
                            },
                            collapsible: true,
                            show: false
                        }).on('routesfound', function () {
                            var geocoderContainer = element.find('.leaflet-routing-geocoders');
                            var maxHeight = element.height() - geocoderContainer.outerHeight(true) - 30;
                            element.find('.leaflet-routing-alternatives-container').css('max-height', maxHeight);
                            if (geocoderContainer.find('.leaflet-routing-collapse-waypoints').length === 0) {
                                var collapseButtonIcon = $('<span>').addClass('dashicons');
                                var collapseButton = $('<button>').addClass('leaflet-routing-collapse-waypoints').prop('type', 'button').append(collapseButtonIcon);
                                collapseButton.on('click', function () {
                                    element.find('.leaflet-routing-geocoders').toggleClass('geocoder-fields-hidden');
                                    var maxHeight = element.height() - geocoderContainer.outerHeight(true) - 30;
                                    element.find('.leaflet-routing-alt').css('max-height', maxHeight - 10);
                                    element.find('.leaflet-routing-alternatives-container').css('max-height', maxHeight);
                                });
                                element.find('.leaflet-routing-geocoders').append(collapseButton);
                            }
                        }).on('routeselected', function () {
                            var maxHeight = element.height() - element.find('.leaflet-routing-geocoders').outerHeight(true) - 40;
                            element.find('.leaflet-routing-alt').css('max-height', maxHeight);
                        }).addTo(_this.map);
                    }

                    function isDark(color) {
                        var r, g, b, hsp;
                        // If hex --> Convert it to RGB: http://gist.github.com/983661
                        color = +("0x" + color.slice(1).replace(
                                color.length < 5 && /./g, '$&$&'));

                        r = color >> 16;
                        g = color >> 8 & 255;
                        b = color & 255;

                        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
                        hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
                        return (hsp <= 127.5) ? true : false;
                    }

                    function isValidHex(color) {
                        var regex = /^#([0-9A-F]{3}){1,2}$/i;
                        return regex.test(color);
                    }

                    $(document).on('invalidate.sbs.openstreetmap vc-full-width-row shown.bs.tab shown.bs.collapse show.vc.tab afterShow.vc.accordion', function (event) {
                        if (_this.map)
                            _this.map.invalidateSize();
                    });
                }
            }], [{
                key: 'init',
                value: function init(element) {
                    element = $(element);
                    var data = element.data(DATA_KEY);
                    if (!data) {
                        data = new OpenStreetMap(element);
                        element.data(DATA_KEY, data);
                    }
                    data.initMap(element);
                }
            }]);
        return OpenStreetMap;
    }($, stepbyteservice.classutils, stepbyteservice.osmglobals);

    $(function () {
        $('.sbs_openstreetmap_module').each(function () {
            window.stepbyteservice.OpenStreetMap.init(this);
        });
        if (typeof window.vc !== 'undefined' && typeof window.vc.events !== 'undefined') {
            window.vc.events.on('shortcodeView:ready:sbs_wpb_openstreetmap', function (model) {
                try {
                    stepbyteservice.OpenStreetMap.init(model.view.el.firstChild);
                } catch (e) {
                }
            });
            window.vc.events.on('shortcodeView:updated:sbs_wpb_openstreetmap', function (model) {
                try {
                    stepbyteservice.OpenStreetMap.init(model.view.el.firstChild);
                } catch (e) {
                }
            });
            window.vc.events.on('shortcodeView:updated:sbs_wpb_marker', function (model) {
                try {
                    var parent = $(model.view.el).closest('[data-model-id="' + model.attributes.parent_id + '"]').children('.sbs_openstreetmap_module');
                    parent.attr('data-marker-list', '[]');
                    stepbyteservice.OpenStreetMap.init(parent);
                } catch (e) {
                }
            });
            window.vc.events.on('shortcodes:sbs_wpb_marker:destroy', function (model) {
                try {
                    var parent = vc.shortcodes.get(model.get('parent_id')).view.el.firstChild;
                    $(parent).attr('data-marker-list', '[]');
                    stepbyteservice.OpenStreetMap.init(parent);
                } catch (e) {
                }
            });
        }
        $(document).on('sortreceive sortremove', $('.vc_sbs_wpb_openstreetmap').find('.ui-sortable'), function (event, ui) {
            try {
                var jQueryParent = window.parent.jQuery;
                var model = jQueryParent(event.target.parentElement);
                model.attr('data-marker-list', '[]');
                window.parent.stepbyteservice.OpenStreetMap.init(model);
            } catch (e) {
                console.log(e);
            }
        });
    });
})(jQuery, window.stepbyteservice);
