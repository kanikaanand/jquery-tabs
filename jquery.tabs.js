/**
* @file jQuery plugin that creates the basic interactivity for an ARIA tabs widget
* @author Ian McBurnie <ianmcburnie@hotmail.com>
* @version 0.3.0
* @requires jquery
* @requires jquery-next-id
* @requires jquery-roving-tabindex
* @requires jquery-prevent-scroll-keys
*/
(function($) {
    /**
    * jQuery plugin that creates the basic interactivity for an ARIA tabs widget
    *
    * @method "jQuery.fn.tabs"
    * @return {jQuery} chainable jQuery class
    */
    $.fn.tabs = function tabs(options) {
        options = $.extend({}, options);

        return this.each(function onEach() {
            var $tabsWidget = $(this);
            var $tablist = $tabsWidget.find('> ul:first-child, > ol:first-child, > div:first-child');
            var $tabs = $tablist.find('> li, > div');
            var $links = $tablist.find('a');
            var $panelcontainer = $tabsWidget.find('> div:last-child');
            var $panels = $panelcontainer.find('> div');
            var $panelHeadings = $panels.find('> h2:first-child, > h3:first-child');

            // set a unique widget id
            $tabsWidget.nextId('tabs');

            // add required ARIA roles, states and properties
            // first tabpanel is selected by default
            $tablist
                .attr('role', 'tablist');

            $tabs
                .attr('role', 'tab')
                .attr('aria-selected', 'false')
                .first()
                    .attr('aria-selected', 'true');

            $panels
                .attr('role', 'tabpanel')
                .attr('aria-hidden', 'true')
                .first()
                    .attr('aria-hidden', 'false');

            $panelHeadings.attr('aria-hidden', 'true');

            // remove hyperlink behaviour from links
            $links
                .attr('role', 'presentation')
                .removeAttr('href');

            if (options.livePanels === true) {
                $panelcontainer.attr('aria-live', 'polite');
            }

            // all panels are labelled and controlled by their respective tab
            $tabs.each(function onEachTab(idx, el) {
                var $tab = $(el);
                var tabId = $tabsWidget.attr('id') + '-tab-' + idx;
                var panelId = $tabsWidget.attr('id') + '-panel-' + idx;

                $tab
                    .attr('id', tabId)
                    .attr('aria-controls', panelId);

                $panels.eq(idx)
                    .attr('id', panelId)
                    .attr('aria-labelledby', tabId);
            });

            // Create a roving tab index on tabs
            $tablist.rovingTabindex('[role=tab]');

            $tablist.on('rovingTabindexChange', '[role=tab]', function(e, data) {
                var $selectedTab = $(this);
                var $activeTab = $tablist.find('[aria-selected=true]');
                var $activePanel = $panelcontainer.find('[aria-labelledby={0}]'.replace('{0}', $activeTab.attr('id')));
                var $selectedPanel = $panelcontainer.find('[aria-labelledby={0}]'.replace('{0}', $selectedTab.attr('id')));

                if ($selectedTab[0] !== $activeTab[0]) {
                    $activePanel.attr('aria-hidden', 'true');
                    $selectedPanel.attr('aria-hidden', 'false');
                    $selectedTab.attr('aria-selected', 'true');

                    setTimeout(function() {
                        $activeTab.attr('aria-selected', 'false');
                        $selectedTab.trigger('tabsSelect', data);
                    }, 0);
                }
            });

            // use a plugin to prevent page scroll
            $tabsWidget.preventScrollKeys('[role=tab]');

            // mark widget as initialised
            $tabsWidget.addClass('tabs--js');
        });
    };
}(jQuery));

/**
* The jQuery plugin namespace.
* @external "jQuery.fn"
* @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
*/

/**
* tabsSelect event
*
* @event tabsSelect
* @type {object}
* @property {object} event - event object
*/
