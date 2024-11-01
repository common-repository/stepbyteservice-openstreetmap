<?php
if (!defined('WPINC')) {
    die;
}

if (!class_exists('SBS_OpenStreetMap_Base')) {

    /**
     * Base class for components
     */
    abstract class SBS_OpenStreetMap_Base {

        /**
         * Migration Shortcodes
         */
        private static $migration_shortcodes = array(
            'sbs_wpb_openstreetmap' => 'sbs_wpb_marker',
            'sbs_openstreetmap' => 'sbs_marker'
        );

        /**
         * Constructor
         */
        public function __construct() {
            add_action('wp_enqueue_scripts', array($this, 'check_enqueue_assets'), 0);
        }

        /**
         * Check if registered assets need to be enqueued. Returns the post if true, null otherwise.
         * 
         * @global WP_Post|null $post
         * @return WP_Post|null
         */
        public function check_enqueue_assets() {
            global $post;
            if (!is_a($post, 'WP_Post') || !is_singular())
                return null;
            return $post;
        }

        /**
         * Enqueue registered assets
         */
        public function enqueue_assets() {
            wp_enqueue_style('sbs-openstreetmap');
            wp_enqueue_script('sbs-openstreetmap');
        }

        /**
         * Create global openstreetmap object
         * 
         * @return array
         */
        public static function get_sbs_openstreetmap_object() {
            return array(
                'defaults' => self::merge_default_attributes(array('destination_marker' => '0', 'center_marker' => '0')),
                'defaults_marker' => self::merge_default_marker_attributes(array()),
                'deprecated_styles' => self::get_deprecated_map_styles(),
                'map_styles' => self::get_map_styles(),
                'mapbox_styles' => self::get_mapbox_styles(),
                'routers' => self::get_router_options(),
                'geocoders' => self::get_geocoder_options(),
                'icons' => self::get_material_icons()
            );
        }

        /**
         * Merge given attributes with default values
         * 
         * @param array $attributes
         * @return array
         */
        public static function merge_default_attributes($attributes) {
            return shortcode_atts(array(
                'block_id' => '',
                'map_style' => 'OpenStreetMap.DE',
                'map_style_key' => null,
                'map_height' => '50',
                'zoom' => '15',
                'ctrl_mouse_zoom' => 'false',
                'latitude' => '52.4679888',
                'longitude' => '13.3257928',
                'routing' => 'false',
                'destination_marker' => '1',
                'router' => 'osrmv1',
                'router_key' => null,
                'show_attribution' => 'true',
                'geocoder' => 'nominatim',
                'geocoder_key' => null,
                'center_marker' => '1',
                'marker_list' => array(
                    self::merge_default_marker_attributes(array())
                ),
                    ), $attributes);
        }

        /**
         * Merge given marker attributes with default values
         * 
         * @param array $attributes
         * @return array
         */
        public static function merge_default_marker_attributes($attributes) {
            return shortcode_atts(array(
                'marker_source' => 'address',
                'marker_address' => '',
                'marker_latitude' => '52.4679888',
                'marker_longitude' => '13.3257928',
                'marker_center' => 'true',
                'marker_icon' => '',
                'marker_color' => 'dark_blue',
//                'individual_marker_color' => '#00518c'
                    ), $attributes);
        }

        /**
         * Return deprecated map styles
         * 
         * @return array
         */
        public static function get_deprecated_map_styles() {
            return array(
                'openstreetmap_de' => 'OpenStreetMap.DE',
                'opentopomap' => 'OpenTopoMap',
                'stamen_toner' => 'Stamen.Toner',
                'stamen_toner_light' => 'Stamen.TonerLite',
                'stamen_terrain' => 'Stamen.Terrain',
                'stamen_watercolor' => 'Stamen.Watercolor',
                'wikimedia' => 'OpenStreetMap.DE',
            );
        }

        /**
         * Get mapbox styles
         * 
         * @return array
         */
        public static function get_mapbox_styles() {
            return array(
                'Streets' => 'mapbox/streets-v11',
                'Outdoors' => 'mapbox/outdoors-v11',
                'Light' => 'mapbox/light-v10',
                'Dark' => 'mapbox/dark-v10',
                'Satellite' => 'mapbox/satellite-v9',
            );
        }

        /**
         * Get provider with variants
         * 
         * @return array
         */
        public static function get_provider_with_variants() {
            return array(
                'OpenStreetMap' => array(
                    'terms' => 'https://operations.osmfoundation.org/policies/tiles/',
                    'variants' => array(
                        'DE',
                        'Mapnik',
                        'France',
                        'HOT'
                    )
                ),
                'OpenTopoMap' => array(
                    'terms' => 'https://opentopomap.org/about',
                ),
                'Stamen' => array(
                    'terms' => 'http://maps.stamen.com/',
                    'variants' => array(
                        'Toner',
                        'Toner Lite',
                        'Terrain',
                        'Watercolor'
                    )
                ),
                'Stadia' => array(
                    'dependency' => 'whitelist',
                    'terms' => 'https://stadiamaps.com/terms-of-service/',
                    'variants' => array(
                        'Alidade Smooth',
                        'Alidade Smooth Dark',
                        'Outdoors',
                        'OSM Bright'
                    )
                ),
                'Thunderforest' => array(
                    'dependency' => 'apikey',
                    'terms' => 'https://www.thunderforest.com/terms/',
                    'variants' => array(
                        'OpenCycleMap',
                        'Transport',
                        'Transport Dark',
                        'SpinalMap',
                        'Landscape',
                        'Outdoors',
                        'Pioneer',
                        'MobileAtlas',
                        'Neighbourhood'
                    )
                ),
                'MapBox' => array(
                    'dependency' => 'accesstoken',
                    'terms' => 'https://www.mapbox.com/legal/tos/',
                    'variants' => array_keys(self::get_mapbox_styles())
                ),
                'CartoDB' => array(
                    'terms' => 'https://carto.com/legal/',
                    'variants' => array(
                        'Positron',
                        'DarkMatter',
                        'Voyager'
                    )
                ),
                'MapTiler' => array(
                    'dependency' => 'apikey',
                    'terms' => 'https://www.maptiler.com/cloud/terms/',
                    'variants' => array(
                        'Basic',
                        'Bright',
                        'Pastel',
                        'Positron',
                        'Hybrid',
                        'Streets',
                        'Toner',
                        'Topo',
                        'Voyager'
                    )
                )
            );
        }

        /**
         * Get map styles array from providers and their variants
         * 
         * @return array
         */
        public static function get_map_styles() {
            $styles = array();
            foreach (self::get_provider_with_variants() as $key => $provider) {
                if (isset($provider['variants'])) {
                    foreach ($provider['variants'] as $variant_key => $variant) {
                        $map_key = $key . '.' . str_replace(' ', '', $variant);
                        $styles[$map_key] = array(
                            'label' => $key . ' ' . $variant,
                            'dependency' => isset($provider['dependency']) ? $provider['dependency'] : null,
                            'terms' => isset($provider['terms']) ? $provider['terms'] : null,
                            'provider' => ucfirst($key),
                        );
                    }
                } else {
                    $styles[$key] = array(
                        'label' => ucfirst($key),
                        'dependency' => isset($provider['dependency']) ? $provider['dependency'] : null,
                        'terms' => isset($provider['terms']) ? $provider['terms'] : null,
                        'provider' => ucfirst($key)
                    );
                }
            }
            return $styles;
        }

        /**
         * Get Styles for one specific dependency
         * 
         * @param string $dependency
         * @return array
         */
        public static function get_dependent_styles($dependency) {
            $styles = array();
            foreach (self::get_map_styles() as $key => $style) {
                if ($style['dependency'] === $dependency) {
                    $styles[] = $key;
                }
            }
            return $styles;
        }

        /**
         * Get geocoder options
         * 
         * @return array
         */
        public static function get_geocoder_options() {
            return array(
                'nominatim' => array(
                    'label' => 'Nominatim',
                    'terms' => 'https://operations.osmfoundation.org/policies/nominatim/'
                ),
                'mapbox' => array(
                    'label' => 'Mapbox',
                    'dependency' => 'apikey',
                    'terms' => 'https://www.mapbox.com/legal/tos/'
                ),
            );
        }

        /**
         * Get router options
         * 
         * @return array
         */
        public static function get_router_options() {
            return array(
                'osrmv1' => array(
                    'label' => 'OSRM Demo Server',
                    'terms' => 'https://github.com/Project-OSRM/osrm-backend/wiki/Api-usage-policy'
                ),
                'mapbox' => array(
                    'label' => 'Mapbox',
                    'dependency' => 'apikey',
                    'terms' => 'https://www.mapbox.com/legal/tos/'
                )
            );
        }

        /**
         * Get material icons
         * 
         * @return array
         */
        public static function get_material_icons() {
            return array(
                array('sbs-map-icon sbs-map-360' => '360'),
                array('sbs-map-icon sbs-map-ac-unit' => 'AC Unit'),
                array('sbs-map-icon sbs-map-airport-shuttle' => 'Airport Shuttle'),
                array('sbs-map-icon sbs-map-all-inclusive' => 'All Inclusive'),
                array('sbs-map-icon sbs-map-apartment' => 'Apartment'),
                array('sbs-map-icon sbs-map-atm' => 'ATM'),
                array('sbs-map-icon sbs-map-bathtub' => 'Bathtub'),
                array('sbs-map-icon sbs-map-beach-access' => 'Beach Access'),
                array('sbs-map-icon sbs-map-beenhere' => 'Beenhere'),
                array('sbs-map-icon sbs-map-business-center' => 'Business Center'),
                array('sbs-map-icon sbs-map-cake' => 'Cake'),
                array('sbs-map-icon sbs-map-casino' => 'Casino'),
                array('sbs-map-icon sbs-map-category' => 'Category'),
                array('sbs-map-icon sbs-map-child-care' => 'Child Care'),
                array('sbs-map-icon sbs-map-child-friendly' => 'Child Friendly'),
                array('sbs-map-icon sbs-map-compass-calibration' => 'Compass Calibration'),
                array('sbs-map-icon sbs-map-deck' => 'Deck'),
                array('sbs-map-icon sbs-map-departure-board' => 'Departure Board'),
                array('sbs-map-icon sbs-map-directions' => 'Directions'),
                array('sbs-map-icon sbs-map-directions-bike' => 'Directions Bike'),
                array('sbs-map-icon sbs-map-directions-boat' => 'Directions Boat'),
                array('sbs-map-icon sbs-map-directions-bus' => 'Directions Bus'),
                array('sbs-map-icon sbs-map-directions-car' => 'Directions Car'),
                array('sbs-map-icon sbs-map-directions-railway' => 'Directions Railway'),
                array('sbs-map-icon sbs-map-directions-run' => 'Directions Run'),
                array('sbs-map-icon sbs-map-directions-subway' => 'Directions Subway'),
                array('sbs-map-icon sbs-map-directions-transit' => 'Directions Transit'),
                array('sbs-map-icon sbs-map-directions-walk' => 'Directions Walk'),
                array('sbs-map-icon sbs-map-edit-attributes' => 'Edit Attributes'),
                array('sbs-map-icon sbs-map-emoji-emotions' => 'Emoji Emotions'),
                array('sbs-map-icon sbs-map-emoji-events' => 'Emoji Events'),
                array('sbs-map-icon sbs-map-emoji-flags' => 'Emoji Flags'),
                array('sbs-map-icon sbs-map-emoji-food-beverage' => 'Emoji Food Beverage'),
                array('sbs-map-icon sbs-map-emoji-nature' => 'Emoji Nature'),
                array('sbs-map-icon sbs-map-emoji-objects' => 'Emoji Objects'),
                array('sbs-map-icon sbs-map-emoji-people' => 'Emoji People'),
                array('sbs-map-icon sbs-map-emoji-symbols' => 'Emoji Symbols'),
                array('sbs-map-icon sbs-map-emoji-transportation' => 'Emoji Transportation'),
                array('sbs-map-icon sbs-map-ev-station' => 'EV Station'),
                array('sbs-map-icon sbs-map-fastfood' => 'Fastfood'),
                array('sbs-map-icon sbs-map-fireplace' => 'Fireplace'),
                array('sbs-map-icon sbs-map-fitness-center' => 'Fitness Center'),
                array('sbs-map-icon sbs-map-flight' => 'Flight'),
                array('sbs-map-icon sbs-map-free-breakfast' => 'Free Breakfast'),
                array('sbs-map-icon sbs-map-golf-course' => 'Golf Course'),
                array('sbs-map-icon sbs-map-group' => 'Group'),
                array('sbs-map-icon sbs-map-group-add' => 'Group Add'),
                array('sbs-map-icon sbs-map-hot-tub' => 'Hot Tub'),
                array('sbs-map-icon sbs-map-hotel' => 'Hotel'),
                array('sbs-map-icon sbs-map-house' => 'House'),
                array('sbs-map-icon sbs-map-king-bed' => 'King Bed'),
                array('sbs-map-icon sbs-map-kitchen' => 'Kitchen'),
                array('sbs-map-icon sbs-map-layers' => 'Layers'),
                array('sbs-map-icon sbs-map-layers-clear' => 'Layers Clear'),
                array('sbs-map-icon sbs-map-local-activity' => 'Local Activity'),
                array('sbs-map-icon sbs-map-local-airport' => 'Local Airport'),
                array('sbs-map-icon sbs-map-local-atm' => 'Local ATM'),
                array('sbs-map-icon sbs-map-local-bar' => 'Local Bar'),
                array('sbs-map-icon sbs-map-local-cafe' => 'Local Cafe'),
                array('sbs-map-icon sbs-map-local-car-wash' => 'Local Car Wash'),
                array('sbs-map-icon sbs-map-local-convenience-store' => 'Local Convenience Store'),
                array('sbs-map-icon sbs-map-local-dining' => 'Local Dining'),
                array('sbs-map-icon sbs-map-local-drink' => 'Local Drink'),
                array('sbs-map-icon sbs-map-local-florist' => 'Local Florist'),
                array('sbs-map-icon sbs-map-local-gas-station' => 'Local Gas Station'),
                array('sbs-map-icon sbs-map-local-grocery-store' => 'Local Grocery Store'),
                array('sbs-map-icon sbs-map-local-hospital' => 'Local Hospital'),
                array('sbs-map-icon sbs-map-local-hotel' => 'Local Hotel'),
                array('sbs-map-icon sbs-map-local-laundry-service' => 'Local Laundry Service'),
                array('sbs-map-icon sbs-map-local-library' => 'Local Library'),
                array('sbs-map-icon sbs-map-local-mall' => 'Local Mall'),
                array('sbs-map-icon sbs-map-local-movies' => 'Local Movies'),
                array('sbs-map-icon sbs-map-local-offer' => 'Local Offer'),
                array('sbs-map-icon sbs-map-local-parking' => 'Local Parking'),
                array('sbs-map-icon sbs-map-local-pharmacy' => 'Local Pharmacy'),
                array('sbs-map-icon sbs-map-local-phone' => 'Local Phone'),
                array('sbs-map-icon sbs-map-local-pizza' => 'Local Pizza'),
                array('sbs-map-icon sbs-map-local-play' => 'Local Play'),
                array('sbs-map-icon sbs-map-local-post-office' => 'Local Post Office'),
                array('sbs-map-icon sbs-map-local-printshop' => 'Local Printshop'),
                array('sbs-map-icon sbs-map-local-see' => 'Local See'),
                array('sbs-map-icon sbs-map-local-shipping' => 'Local Shipping'),
                array('sbs-map-icon sbs-map-local-taxi' => 'Local Taxi'),
                array('sbs-map-icon sbs-map-location-city' => 'Location City'),
                array('sbs-map-icon sbs-map-map' => 'Map'),
                array('sbs-map-icon sbs-map-meeting-room' => 'Meeting Room'),
                array('sbs-map-icon sbs-map-menu-book' => 'Menu Book'),
                array('sbs-map-icon sbs-map-money' => 'Money'),
                array('sbs-map-icon sbs-map-mood' => 'Mood'),
                array('sbs-map-icon sbs-map-mood-bad' => 'Mood Bad'),
                array('sbs-map-icon sbs-map-museum' => 'Museum'),
                array('sbs-map-icon sbs-map-my-location' => 'My Location'),
                array('sbs-map-icon sbs-map-navigation' => 'Navigation'),
                array('sbs-map-icon sbs-map-near-me' => 'Near Me'),
                array('sbs-map-icon sbs-map-nights-stay' => 'Nights Stay'),
                array('sbs-map-icon sbs-map-no-meeting-room' => 'No Meeting Room'),
                array('sbs-map-icon sbs-map-notifications' => 'Notifications'),
                array('sbs-map-icon sbs-map-notifications-active' => 'Notifications Active'),
                array('sbs-map-icon sbs-map-notifications-none' => 'Notifications None'),
                array('sbs-map-icon sbs-map-notifications-off' => 'Notifications Off'),
                array('sbs-map-icon sbs-map-notifications-paused' => 'Notifications Paused'),
                array('sbs-map-icon sbs-map-outdoor-grill' => 'Outdoor Grill'),
                array('sbs-map-icon sbs-map-pages' => 'Pages'),
                array('sbs-map-icon sbs-map-party-mode' => 'Party Mode'),
                array('sbs-map-icon sbs-map-people' => 'People'),
                array('sbs-map-icon sbs-map-people-alt' => 'People Alt'),
                array('sbs-map-icon sbs-map-people-outline' => 'People Outline'),
                array('sbs-map-icon sbs-map-person' => 'Person'),
                array('sbs-map-icon sbs-map-person-add' => 'Person Add'),
                array('sbs-map-icon sbs-map-person-outline' => 'Person Outline'),
                array('sbs-map-icon sbs-map-person-pin' => 'Person Pin'),
                array('sbs-map-icon sbs-map-plus-one' => 'Plus One'),
                array('sbs-map-icon sbs-map-poll' => 'Poll'),
                array('sbs-map-icon sbs-map-pool' => 'Pool'),
                array('sbs-map-icon sbs-map-public' => 'Public'),
                array('sbs-map-icon sbs-map-rate-review' => 'Rate Review'),
                array('sbs-map-icon sbs-map-restaurant' => 'Restaurant'),
                array('sbs-map-icon sbs-map-restaurant-menu' => 'Restaurant Menu'),
                array('sbs-map-icon sbs-map-room-service' => 'Room Service'),
                array('sbs-map-icon sbs-map-rv-hookup' => 'RV Hookup'),
                array('sbs-map-icon sbs-map-satellite' => 'Satellite'),
                array('sbs-map-icon sbs-map-school' => 'School'),
                array('sbs-map-icon sbs-map-sentiment-dissatisfied' => 'Sentiment Dissatisfied'),
                array('sbs-map-icon sbs-map-sentiment-satisfied' => 'Sentiment Satisfied'),
                array('sbs-map-icon sbs-map-sentiment-very-dissatisfied' => 'Sentiment Very Dissatisfied'),
                array('sbs-map-icon sbs-map-sentiment-very-satisfied' => 'Sentiment Very Satisfied'),
                array('sbs-map-icon sbs-map-share' => 'Share'),
                array('sbs-map-icon sbs-map-single-bed' => 'Single Bed'),
                array('sbs-map-icon sbs-map-smoke-free' => 'Smoke Free'),
                array('sbs-map-icon sbs-map-smoking-rooms' => 'Smoking Rooms'),
                array('sbs-map-icon sbs-map-spa' => 'Spa'),
                array('sbs-map-icon sbs-map-sports' => 'Sports'),
                array('sbs-map-icon sbs-map-sports-baseball' => 'Sports Baseball'),
                array('sbs-map-icon sbs-map-sports-basketball' => 'Sports Basketball'),
                array('sbs-map-icon sbs-map-sports-cricket' => 'Sports Cricket'),
                array('sbs-map-icon sbs-map-sports-esports' => 'Sports Esports'),
                array('sbs-map-icon sbs-map-sports-football' => 'Sports Football'),
                array('sbs-map-icon sbs-map-sports-golf' => 'Sports Golf'),
                array('sbs-map-icon sbs-map-sports-handball' => 'Sports Handball'),
                array('sbs-map-icon sbs-map-sports-hockey' => 'Sports Hockey'),
                array('sbs-map-icon sbs-map-sports-kabaddi' => 'Sports Kabaddi'),
                array('sbs-map-icon sbs-map-sports-mma' => 'Sports MMA'),
                array('sbs-map-icon sbs-map-sports-motorsports' => 'Sports Motorsports'),
                array('sbs-map-icon sbs-map-sports-rugby' => 'Sports Rugby'),
                array('sbs-map-icon sbs-map-sports-soccer' => 'Sports Soccer'),
                array('sbs-map-icon sbs-map-sports-tennis' => 'Sports Tennis'),
                array('sbs-map-icon sbs-map-sports-volleyball' => 'Sports Volleyball'),
                array('sbs-map-icon sbs-map-store-mall-directory' => 'Store Mall Directory'),
                array('sbs-map-icon sbs-map-storefront' => 'Storefront'),
                array('sbs-map-icon sbs-map-streetview' => 'Streetview'),
                array('sbs-map-icon sbs-map-subway' => 'Subway'),
                array('sbs-map-icon sbs-map-terrain' => 'Terrain'),
                array('sbs-map-icon sbs-map-thumb-down-alt' => 'Thumb Down Alt'),
                array('sbs-map-icon sbs-map-thumb-up-alt' => 'Thumb Up Alt'),
                array('sbs-map-icon sbs-map-traffic' => 'Traffic'),
                array('sbs-map-icon sbs-map-train' => 'Train'),
                array('sbs-map-icon sbs-map-tram' => 'Tram'),
                array('sbs-map-icon sbs-map-transfer-within-a-station' => 'Transfer Within A Station'),
                array('sbs-map-icon sbs-map-transit-enterexit' => 'Transit Enterexit'),
                array('sbs-map-icon sbs-map-trip-origin' => 'Trip Origin'),
                array('sbs-map-icon sbs-map-whatshot' => "What's Hot"),
                array('sbs-map-icon sbs-map-zoom-out-map' => 'Zoom Out Map')
            );
        }

        /**
         * Generate and return HTML output from shortcode
         * 
         * @param array $attributes
         * @param string|null $content
         * @return string
         */
        public static function get_content($attributes, $content = null) {
            extract($attributes);
            $ctrl_mouse_zoom = filter_var($ctrl_mouse_zoom, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
            $show_attribution = filter_var($show_attribution, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
            $routing = filter_var($routing, FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false';
            $deprecated_styles = self::get_deprecated_map_styles();
            if (array_key_exists($map_style, $deprecated_styles)) {
                $map_style = $deprecated_styles[$map_style];
            }
            $destination_marker = $destination_marker - 1;
            $center_marker = $center_marker - 1;
            //marker list
            preg_match_all('/[^\/](?:sbs_wpb_marker|sbs_marker)([^\]]*)(?:])([^\[]*)/i', $content, $matches, PREG_SET_ORDER);
            $marker_list = array();
            foreach ($matches as $marker) {
                $marker_atts = SBS_OpenStreetMap_Base::merge_default_marker_attributes(shortcode_parse_atts($marker[1]));
                if (!empty($marker[2])) {
                    $marker_atts['marker_text'] = $marker[2];
                }
                if (!in_array($marker_atts['marker_source'], array('address', 'coordinates'), true)) {
                    $marker_atts['marker_source'] = 'coordinates';
                }
//                if ($marker_atts['marker_color'] === 'individual') {
//                    $marker_atts['marker_color'] = $marker_atts['individual_marker_color'];
//                }
                $marker_list[] = $marker_atts;
            }
            if (empty($block_id)) {
                $block_id = uniqid();
            }
            $id = 'sbs-openstreetmap-block-' . htmlspecialchars($block_id);
            $content = do_shortcode(shortcode_unautop($content));
            ob_start();
            ?><div
                id="<?php echo $id ?>" 
                class="sbs_openstreetmap_module" 
                data-map-style="<?php echo esc_attr($map_style); ?>"
                data-map-style-key="<?php echo esc_attr($map_style_key); ?>"
                data-zoom="<?php printf('%d', $zoom); ?>" 
                data-ctrl-mouse-zoom="<?php echo $ctrl_mouse_zoom; ?>" 
                data-latitude="<?php printf('%F', $latitude); ?>" 
                data-longitude="<?php printf('%F', $longitude); ?>" 
                data-routing="<?php echo esc_attr($routing); ?>" 
                data-destination-marker="<?php echo esc_attr($destination_marker); ?>" 
                data-router="<?php echo esc_attr($router); ?>" 
                data-router-key="<?php echo esc_attr($router_key); ?>" 
                data-show-attribution="<?php echo esc_attr($show_attribution); ?>" 
                data-geocoder="<?php echo esc_attr($geocoder); ?>" 
                data-geocoder-key="<?php echo esc_attr($geocoder_key); ?>" 
                data-center-marker="<?php echo esc_attr($center_marker); ?>"
                data-marker-list='<?php echo json_encode($marker_list); ?>'>
                <div class="sbs_openstreetmap_container" style="padding-bottom: <?php printf('%d%%', $map_height); ?>"></div>
                <div class="marker_list">
                    <?php echo $content; ?>
                </div>
            </div><?php
            return ob_get_clean();
        }

        /**
         * Generate and return HTML output from marker shortcode
         * 
         * @param array $attributes
         * @param string|null $content
         * @return string
         */
        public static function get_content_marker($attributes, $content = null) {
            extract($attributes);
            $marker_info = '';
            if ($marker_source === 'address') {
                $marker_info = $marker_address;
            } else {
                $marker_source = 'coordinates';
                $marker_info = 'lat: ' . $marker_latitude . ', lng: ' . $marker_longitude;
            }
//            if ($marker_color === 'individual') {
//                $marker_color = $individual_marker_color;
//            }
            ob_start();
            ?><div class="marker_element"
                 data-marker-source="<?php echo esc_attr($marker_source); ?>" 
                 data-marker-address="<?php echo esc_attr($marker_address); ?>" 
                 data-marker-latitude="<?php printf('%F', $marker_latitude); ?>" 
                 data-marker-longitude="<?php printf('%F', $marker_longitude); ?>"
                 data-marker-icon="<?php echo esc_attr($marker_icon); ?>" 
                 data-marker-color="<?php echo esc_attr($marker_color); ?>"
                 data-marker-text="<?php echo esc_attr($content); ?>">Marker <span class="marker_number"></span> (<?php echo htmlspecialchars($marker_info); ?>)</div><?php
            return ob_get_clean();
        }

        /**
         * Filter content string to migrate old shortcodes
         * 
         * @param string $content
         * @return string
         */
        public static function migrate_shortcode($content) {
            if (false === strpos($content, '[sbs')) {
                return $content;
            }

            $pattern = get_shortcode_regex(array_keys(self::$migration_shortcodes));
            $content = preg_replace_callback("/$pattern/", array(__CLASS__, 'migrate_marker'), $content);
            $content = preg_replace_callback("/$pattern/", array(__CLASS__, 'migrate_map_atts'), $content);

            return $content;
        }

        /**
         * Migrate content of specified post
         * 
         * @param WP_Post $post
         */
        public static function migrate_post($post) {
            if (!empty($post->post_content))
                $post->post_content = static::migrate_shortcode($post->post_content);
        }

        /**
         * Preg Replace callback to replace shortcode strings
         * 
         * @param array $matches
         * @return string
         */
        private static function migrate_marker($matches) {
            if (strpos($matches[3], 'marker_') === false)
                return $matches[0];

            $atts = shortcode_parse_atts($matches[3]);
            if (!is_array($atts))
                return $matches[0];
            $marker_atts = array();
            foreach ($atts as $key => $value) {
                if ($key === 'marker_center' && $value == false) {
                    $atts['center_marker'] = '0';
                    unset($atts[$key]);
                } elseif (substr($key, 0, 7) === 'marker_') {
                    $marker_atts[$key] = $value;
                    unset($atts[$key]);
                }
            }

            $inner = self::get_shortcode_string(
                            self::$migration_shortcodes[$matches[2]],
                            $marker_atts,
                            $matches[5]
            );
            return self::get_shortcode_string(
                            $matches[2],
                            $atts,
                            $inner,
                            $matches[1] === '[' && $matches[6] === ']'
            );
        }

        /**
         * Preg Replace callback to replace shortcode strings
         * 
         * @param array $matches
         * @return string
         */
        private static function migrate_map_atts($matches) {
            if (strpos($matches[3], 'api_') === false && strpos($matches[3], 'access_') === false)
                return $matches[0];

            $atts = shortcode_parse_atts($matches[3]);
            if (!is_array($atts))
                return $matches[0];

            $map_styles = self::get_map_styles();
            if (empty($atts['map_style_key'])) {
                switch ($map_styles[$atts['map_style']]['dependency']) {
                    case 'apikey':
                        $atts['map_style_key'] = !empty($atts['api_key']) ? $atts['api_key'] : null;
                        break;
                    case 'accesstoken':
                        $atts['map_style_key'] = !empty($atts['access_token']) ? $atts['access_token'] : null;
                        break;
                }
            }
            return self::get_shortcode_string(
                            $matches[2],
                            $atts,
                            $matches[5],
                            $matches[1] === '[' && $matches[6] === ']'
            );
        }

        /**
         * Generate shortcode strings with given params
         * 
         * @param string $name
         * @param array $attributes
         * @param string $content
         * @param boolean|false $double_bracket
         * @return string
         */
        private static function get_shortcode_string($name, $attributes, $content, $double_bracket = false) {
            return sprintf(
                    "[%s%s%s]%s[/%s%s]",
                    $double_bracket ? '[' : '',
                    $name,
                    empty($attributes) ? '' : ' ' . self::get_attributes_string($attributes),
                    $content,
                    $name,
                    $double_bracket ? ']' : ''
            );
        }

        /**
         * Get attribute string from array
         * @param array $attributes
         * @return string
         */
        private static function get_attributes_string($attributes) {
            $result = array();
            foreach ($attributes as $key => $value)
                $result[] = $key . '="' . esc_attr($value) . '"';
            return implode(' ', $result);
        }
    }

}