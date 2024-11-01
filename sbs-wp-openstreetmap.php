<?php

/**
 * Plugin Name:       OpenStreetMap for Gutenberg and WPBakery Page Builder (formerly Visual Composer)
 * Description:       OpenStreetMap Gutenberg block, WPBakery PageBuilder content element and standalone WordPress shortcode
 * Version:           1.1.2
 * Author:            Step-Byte-Service GmbH
 * Author URI:        https://www.step-byte-service.com
 * License:           GPLv2
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       sbs-wp-openstreetmap
 */
if (!defined('WPINC')) {
    die;
}

if (!class_exists('SBS_Plugin_OpenStreetMap')) {

    require __DIR__ . '/includes/sbs-openstreetmap-base.php';
    require __DIR__ . '/includes/sbs-openstreetmap-shortcode.php';
    require __DIR__ . '/includes/sbs-openstreetmap-gutenberg.php';
    require __DIR__ . '/includes/sbs-openstreetmap-wpbakery.php';

    class SBS_Plugin_OpenStreetMap {

        /**
         * Constructor
         * 
         * Initialize components
         */
        public function __construct() {
            add_action('init', array($this, 'register_assets'), 0);
            add_action('plugins_loaded', array($this, 'load_textdomain'));
            if (!defined('DISABLE_SBSOSM_MARKER_MIGRATION') || DISABLE_SBSOSM_MARKER_MIGRATION !== true) {
                add_filter('the_editor_content', array('SBS_OpenStreetMap_Base', 'migrate_shortcode'), 9);
                add_filter('the_content', array('SBS_OpenStreetMap_Base', 'migrate_shortcode'), 9);
                add_action('the_post', array('SBS_OpenStreetMap_Base', 'migrate_post'), 9);
            }
            new SBS_OpenStreetMap_Shortcode();
            new SBS_OpenStreetMap_Gutenberg();
            new SBS_OpenStreetMap_WPBakery();
        }

        /**
         * Register JavaScript and CSS files for WordPress frontend (also used by Gutenberg backend)
         */
        public function register_assets() {
            wp_register_style('sbs-openstreetmap-leaflet', plugins_url('assets/lib/leaflet/leaflet.css', __FILE__));
            wp_register_script('sbs-openstreetmap-leaflet', plugins_url('assets/lib/leaflet/leaflet.js', __FILE__));
            wp_register_style('sbs-openstreetmap-gesture_handler', plugins_url('assets/lib/leaflet-gesture-handling/leaflet-gesture-handling.min.css', __FILE__));
            wp_register_script('sbs-openstreetmap-gesture_handler', plugins_url('assets/lib/leaflet-gesture-handling/leaflet-gesture-handling.min.js', __FILE__));
            wp_register_script('sbs-openstreetmap-providers', plugins_url('assets/lib/leaflet-providers/leaflet-providers.js', __FILE__));
            wp_register_style('sbs-openstreetmap-routing_machine', plugins_url('assets/lib/leaflet-routing-machine/leaflet-routing-machine.css', __FILE__));
            wp_register_script('sbs-openstreetmap-routing_machine', plugins_url('assets/lib/leaflet-routing-machine/leaflet-routing-machine.js', __FILE__));
            wp_register_script('sbs-openstreetmap-control-geocoder', plugins_url('assets/lib/leaflet-control-geocoder/Control.Geocoder.js', __FILE__));
            wp_register_style('sbs-openstreetmap', plugins_url('assets/css/style.css', __FILE__), array('sbs-openstreetmap-leaflet', 'sbs-openstreetmap-gesture_handler', 'sbs-openstreetmap-routing_machine'));
            wp_register_script('sbs-openstreetmap', plugins_url('assets/js/sbs-wp-openstreetmap.js', __FILE__), array('jquery', 'sbs-openstreetmap-leaflet', 'sbs-openstreetmap-gesture_handler', 'sbs-openstreetmap-providers', 'sbs-openstreetmap-routing_machine', 'sbs-openstreetmap-control-geocoder'), false, true);    
            $script = 'window.stepbyteservice = window.stepbyteservice || {};';
            $script .= 'window.stepbyteservice.osmglobals =' . json_encode(SBS_OpenStreetMap_Base::get_sbs_openstreetmap_object(), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
            wp_add_inline_script('sbs-openstreetmap', $script, 'before');
        }

        /**
         * Load the text domain according to WordPress locale
         */
        public function load_textdomain() {
            load_textdomain(
                    'sbs-wp-openstreetmap',
                    plugin_dir_path(__FILE__)
                    . 'languages/'
                    . 'sbs-wp-openstreetmap'
                    . '-'
                    . (is_admin() ? get_user_locale() : get_locale())
                    . '.mo'
            );
        }

    }

    new SBS_Plugin_OpenStreetMap();
}
