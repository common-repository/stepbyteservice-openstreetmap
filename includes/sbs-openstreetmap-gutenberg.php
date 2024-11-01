<?php

if (!defined('WPINC')) {
    die;
}

if (!class_exists('SBS_OpenStreetMap_Gutenberg')) {

    /**
     * Gutenberg block
     */
    class SBS_OpenStreetMap_Gutenberg extends SBS_OpenStreetMap_Base {

        /**
         * Constructor
         */
        public function __construct() {
            parent::__construct();
            add_action('init', array($this, 'register_block_assets'));
        }

        /**
         * Enqueue assets if needed
         */
        public function check_enqueue_assets() {
            $post = parent::check_enqueue_assets();
            if (!is_null($post) && function_exists('has_block') && has_block('stepbyteservice/openstreetmap', $post))
                $this->enqueue_assets();
        }

        /**
         * Register assets for Gutenberg block
         */
        public function register_block_assets() {
            wp_register_style('sbs-openstreetmap-react-iconpicker-base', plugins_url('../assets/lib/react-fonticonpicker/fonticonpicker.base-theme.react.css', __FILE__));
            wp_register_style('sbs-openstreetmap-react-iconpicker-material', plugins_url('../assets/lib/react-fonticonpicker/fonticonpicker.material-theme.react.css', __FILE__));
            wp_register_script('sbs-openstreetmap-prop-types', plugins_url('../assets/lib/prop-types/prop-types.min.js', __FILE__));
            wp_register_script('sbs-openstreetmap-classnames', plugins_url('../assets/lib/classnames/index.js', __FILE__));
            wp_register_script('sbs-openstreetmap-react-transition-group', plugins_url('../assets/lib/react-transition-group/react-transition-group.min.js', __FILE__));
            wp_register_script('sbs-openstreetmap-react-iconpicker', plugins_url('../assets/lib/react-fonticonpicker/fonticonpicker.react.js', __FILE__), array('wp-components', 'react', 'react-dom', 'sbs-openstreetmap-prop-types', 'sbs-openstreetmap-classnames', 'sbs-openstreetmap-react-transition-group'));

            wp_register_script(
                    'sbs-openstreetmap-block',
                    plugins_url('../assets/js/openstreetmap-block.js', __FILE__),
                    array('wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-block-editor', 'sbs-openstreetmap', 'sbs-openstreetmap-react-iconpicker'),
                    false,
                    true
            );
            wp_set_script_translations('sbs-openstreetmap-block', 'sbs-wp-openstreetmap', plugin_dir_path(__FILE__) . '../languages');
            wp_register_style(
                    'sbs-openstreetmap-block',
                    plugins_url('../assets/css/blockeditor.css', __FILE__),
                    array('sbs-openstreetmap', 'sbs-openstreetmap-react-iconpicker-base', 'sbs-openstreetmap-react-iconpicker-material')
            );

            register_block_type('stepbyteservice/openstreetmap', array(
                'editor_script' => 'sbs-openstreetmap-block',
                'editor_style' => 'sbs-openstreetmap-block',
            ));
        }

    }

}
