(function () {
    'use strict';
    if (window.vc && window.vc.events) {
        window.vc.events.on('shortcodeView:ready', function (model) {
            if ('sbs_wpb_openstreetmap' === model.get('shortcode')) {
                wpbEvents(model);
                if (model.view.$el.find('.vc_sbs_wpb_marker').length >= 2) {
                    hideParentActions(model);
                    hideChildActions(model);
                }
            }
        });

        function wpbEvents(model) {
            var child_tag = 'sbs_wpb_marker';
            window.vc.events.on('shortcodeView:ready:sbs_wpb_marker', function (model) {
                var parent_model = vc.shortcodes.get(model.get('parent_id'));
                if (parent_model.view.$el.find('.vc_sbs_wpb_marker').length >= 2) {
                    hideParentActions(parent_model);
                    hideChildActions(parent_model);
                }
            });
            window.vc.events.on('shortcodes:' + child_tag + ':destroy:parent:' + model.get('id'), function (model) {
                var parent_model = vc.shortcodes.get(model.get('parent_id'));
                if (parent_model.view.$el.find('.vc_sbs_wpb_marker').length < 2) {
                    showParentActions(parent_model);
                    showChildActions(parent_model);
                }
            });
        }
        function hideParentActions(model) {
            var element = model.view.$el;
            element.find('.vc_control-btn.vc_control-btn-prepend').hide();
            element.find('.vc_control-btn.vc_control-btn-append').hide();
        }

        function showParentActions(model) {
            var element = model.view.$el;
            element.find('.vc_control-btn.vc_control-btn-prepend').show();
            element.find('.vc_control-btn.vc_control-btn-append').show();
        }

        function hideChildActions(model) {
            var children = vc.shortcodes.where({parent_id: model.get('id')});
            _.each(children, function (model) {
                if (model.view)
                    model.view.$el.find('.vc_control-btn.vc_control-btn-clone').hide();
            });
        }

        function showChildActions(model) {
            var children = vc.shortcodes.where({parent_id: model.get('id')});
            _.each(children, function (model) {
                model.view.$el.find('.vc_control-btn.vc_control-btn-clone').show();
            });
        }
    }
})();
