<?php

if (!defined('WPINC')) {
    die;
}

if (class_exists('WPBakeryShortCode')) {

    /**
     * WPBakery Page Builder shortcode marker
     */
    class WPBakeryShortCode_SBS_WPB_Marker extends WPBakeryShortCode {

        /**
         * Register module with specified parameters
         */
        public static function register_module() {
            $defaults = SBS_OpenStreetMap_Base::merge_default_marker_attributes(array());
            vc_map(array(
                'name' => __('SBS OpenStreetMap Marker', 'sbs-wp-openstreetmap'),
                'base' => 'sbs_wpb_marker',
                'content_element' => true,
                'as_child' => array(
                    'only' => 'sbs_wpb_openstreetmap'
                ),
                'category' => esc_html__('Content', 'js_composer'),
                'description' => __('Configurable OpenStreetMap marker', 'sbs-wp-openstreetmap'),
                'icon' => plugin_dir_url(__FILE__) . '../assets/icons/sbs-marker-icon.png',
                'params' => array(
                    array(
                        'type' => 'dropdown',
                        'heading' => __('Determine Position By', 'sbs-wp-openstreetmap'),
                        'param_name' => 'marker_source',
                        'group' => __('Marker', 'sbs-wp-openstreetmap'),
                        'value' => array(
                            __('Address', 'sbs-wp-openstreetmap') => 'address',
                            __('Coordinates', 'sbs-wp-openstreetmap') => 'coordinates'
                        ),
                        'std' => $defaults['marker_source']
                    ),
                    array(
                        'type' => 'textfield',
                        'admin_label' => true,
                        'heading' => __('Address', 'sbs-wp-openstreetmap'),
                        'param_name' => 'marker_address',
                        'dependency' => array('element' => 'marker_source', 'value' => 'address'),
                        'group' => __('Marker', 'sbs-wp-openstreetmap')
                    ),
                    array(
                        'type' => 'textfield',
                        'admin_label' => true,
                        'edit_field_class' => 'vc_col-sm-6',
                        'heading' => __('Latitude', 'sbs-wp-openstreetmap'),
                        'param_name' => 'marker_latitude',
                        'dependency' => array('element' => 'marker_source', 'value' => 'coordinates'),
                        'group' => __('Marker', 'sbs-wp-openstreetmap')
                    ),
                    array(
                        'type' => 'textfield',
                        'admin_label' => true,
                        'edit_field_class' => 'vc_col-sm-6',
                        'heading' => __('Longitude', 'sbs-wp-openstreetmap'),
                        'param_name' => 'marker_longitude',
                        'dependency' => array('element' => 'marker_source', 'value' => 'coordinates'),
                        'group' => __('Marker', 'sbs-wp-openstreetmap')
                    ),
                    array(
                        'type' => 'iconpicker',
                        'edit_field_class' => 'vc_col-sm-6',
                        'heading' => __('Icon', 'sbs-wp-openstreetmap'),
                        'param_name' => 'marker_icon',
                        'settings' => array(
                            'type' => 'sbs-map-icons',
                        ),
                        'group' => __('Marker', 'sbs-wp-openstreetmap')
                    ),
                    array(
                        'type' => 'dropdown',
                        'edit_field_class' => 'vc_col-sm-6',
                        'heading' => __('Color', 'sbs-wp-openstreetmap'),
                        'param_name' => 'marker_color',
                        'group' => __('Marker', 'sbs-wp-openstreetmap'),
                        'value' => array(
                            __('Red', 'sbs-wp-openstreetmap') => 'red',
                            __('White', 'sbs-wp-openstreetmap') => 'white',
                            __('Blue', 'sbs-wp-openstreetmap') => 'dark_blue',
                            __('Green', 'sbs-wp-openstreetmap') => 'green',
                            __('Black', 'sbs-wp-openstreetmap') => 'black',
                            __('Orange', 'sbs-wp-openstreetmap') => 'orange',
                            __('Yellow', 'sbs-wp-openstreetmap') => 'yellow',
//                            __('Individual Color', 'sbs-wp-openstreetmap') => 'individual'
                        ),
                        'std' => $defaults['marker_color']
                    ),
//                    array(
//                        'type' => 'colorpicker',
//                        'heading' => __('Individual Marker Color', 'sbs-wp-openstreetmap'),
//                        'param_name' => 'individual_marker_color',
//                        'group' => __('Marker', 'sbs-wp-openstreetmap'),
//                        'dependency' => array(
//                            'element' => 'marker_color', 
//                            'value' => 'individual'),
//                        'std' => $defaults['individual_marker_color']
//                    ),
                    array(
                        'type' => 'textarea_html',
                        'heading' => __('Popup Text', 'sbs-wp-openstreetmap'),
                        'param_name' => 'content',
                        'group' => __('Marker', 'sbs-wp-openstreetmap')
                    )
                )
            ));
        }

        /**
         * Returns generated HTML from shortcode
         * 
         * @param array $attributes
         * @param string|null $content
         * @return string
         */
        protected function content($attributes, $content = null) {
            $attributes = SBS_OpenStreetMap_Base::merge_default_marker_attributes($attributes);
            return SBS_OpenStreetMap_Base::get_content_marker($attributes, $content);
        }

    }

}