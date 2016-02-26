(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function ($) {

  'use strict';

  var FormData = window.FormData;
  var NAMESPACE = 'qor.activity';
  var EVENT_ENABLE = 'enable.' + NAMESPACE;
  var EVENT_DISABLE = 'disable.' + NAMESPACE;
  var EVENT_CLICK = 'click.' + NAMESPACE;
  var EVENT_SUBMIT = 'submit.' + NAMESPACE;
  var CLASS_EDIT_NOTE = '.qor-activity__edit-button';
  var CLASS_TAB_ACTIVITY = '.qor-tab__activity';
  var CLASS_EDIT_NOTE_FORM = '.qor-activity__edit-note_form';
  var CLASS_NEW_NOTE_FORM = '.qor-activity__new-note_form';
  var ID_LIST_TEMPLATE = '#template__qor-activity__list';
  var CLASS_LISTS = '.qor-activity__lists';

  function QorActivity(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, QorActivity.DEFAULTS, $.isPlainObject(options) && options);
    this.init();
  }

  QorActivity.prototype = {
    constructor: QorActivity,

    init: function () {
      var $this = this.$element;
      this.bind();
      this.initTabs();
    },

    bind: function () {
      this.$element.
      on(EVENT_CLICK, $.proxy(this.click, this)).
      on(EVENT_SUBMIT, 'form', $.proxy(this.submit, this));

      $(document).on(EVENT_CLICK, CLASS_TAB_ACTIVITY, $.proxy(this.tabClick, this));
    },

    submit: function (e) {
      var form = e.target;
      var $form = $(e.target);
      var FormDatas;
      var _this = this;

      e.preventDefault();

      FormDatas = $form.serialize();
      $.ajax($form.prop('action'), {
        method: $form.prop('method'),
        data: FormDatas,
        dataType: 'json'
      }).done(function (data) {
        if (data.errors){
          return;
        }
        if ($form.is(CLASS_EDIT_NOTE_FORM)){
          _this.hideEditForm($form);
          $form.find('.qor-activity__list-note').html(data.Note);
        }

        if ($form.is(CLASS_NEW_NOTE_FORM)){

          $(CLASS_LISTS).prepend(_this.renderActivityList(data));
          _this.clearForm();
        }
      });
      return false;
    },

    renderActivityList: function (data) {
      var activityListTemplate = QorActivity.ACTIVITY_LIST_TEMPLATE;
      Mustache.parse(activityListTemplate);
      return Mustache.render(activityListTemplate, data);
    },

    clearForm: function () {
      $('textarea[data-toggle="qor.redactor"]').redactor('code.set', '');
      $(CLASS_NEW_NOTE_FORM).find('[name="QorResource.Content"],[name="QorResource.Note"]').val('');
    },

    click: function (e) {
      var $target = $(e.target);
      e.stopPropagation();

      if ($target.is(CLASS_EDIT_NOTE)){
        var parents = $target.closest('.qor-activity__list');
        this.showEditForm(parents);
      }
    },

    tabClick: function (e) {
      var _this = this;
      var activityList = $(CLASS_LISTS).find('.qor-activity__list').size();

      if (activityList){
        return;
      }

      var actionId = $(CLASS_TAB_ACTIVITY).data('actionId');
      var url = '/admin/orders/' + actionId + '/!qor_activities';

      if (!activityList){
        $.ajax({
          url: url,
          method: 'GET',
          dataType: 'json',
          success: function (data) {
            if (data.length){
              $(CLASS_LISTS).html('');
              for (var i = data.length - 1; i >= 0; i--) {
                $(CLASS_LISTS).append(_this.renderActivityList(data[i]));
              }
            }
            $(CLASS_LISTS).find('.mdl-spinner').remove();

          }
        });
      } else {
        $(CLASS_LISTS).find('.mdl-spinner').remove();
      }
    },

    showEditForm: function (ele) {
      ele.find('.qor-activity__list-note,.qor-activity__edit-button').removeClass('show').addClass('hide');
      ele.find('.qor-activity__edit-feilds,.qor-activity__edit-save-button').removeClass('hide').addClass('show');
    },

    hideEditForm: function (ele) {
      ele.find('.qor-activity__list-note,.qor-activity__edit-button').removeClass('hide').addClass('show');
      ele.find('.qor-activity__edit-feilds,.qor-activity__edit-save-button').removeClass('show').addClass('hide');
    },

    initTabs : function () {
      if (!$('.qor-slideout.is-shown').get(0)) {
        QorActivity.ACTIVITY_LIST_TEMPLATE = $(ID_LIST_TEMPLATE).html();
        $('.qor-page__body').append(QorActivity.CONTENT_HTML);
        $('.qor-form-container').appendTo($('#scroll-tab-form'));
        $('#scroll-tab-activity').appendTo('.mdl-layout__content');
        $('.qor-page__header .qor-tab-bar--activity-header').prependTo('.mdl-layout.qor-sliderout__activity-container');
        $('.qor-page > .qor-page__header').hide();
        $('.qor-page > .qor-page__header .qor-action-forms').prependTo('#scroll-tab-form');
        $('.qor-layout .mdl-layout__content.has-header').removeClass('has-header');
        $('#scroll-tab-activity').wrapInner('<div class="qor-form-container"></div>');
      }
    }
  };

  QorActivity.CONTENT_HTML = (
    '<div class="mdl-layout mdl-js-layout qor-sliderout__activity-container">' +
      '<main class="mdl-layout__content qor-slideout--activity-content">' +
        '<div class="mdl-layout__tab-panel is-active" id="scroll-tab-form"></div>' +
      '</main>' +
    '</div>'
  );

  QorActivity.DEFAULTS = {};

  QorActivity.ACTIVITY_LIST_TEMPLATE = {};

  QorActivity.plugin = function (options) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data(NAMESPACE);
      var fn;

      if (!data) {

        if (/destroy/.test(options)) {
          return;
        }

        $this.data(NAMESPACE, (data = new QorActivity(this, options)));
      }

      if (typeof options === 'string' && $.isFunction(fn = data[options])) {
        fn.apply(data);
      }
    });
  };

  // init activity html after sliderout loaded.
  $.fn.qorSliderAfterShow.qorActivityinit = function (url, html) {
    var $target = $('.qor-slideout > .qor-slideout__body');
    var $tab = $('.qor-slideout .qor-tab-bar--activity-header');
    QorActivity.ACTIVITY_LIST_TEMPLATE = $(ID_LIST_TEMPLATE).html();
    $target.wrapInner(QorActivity.CONTENT_HTML);
    $('.qor-sliderout__activity-container').prepend($tab);
    $('.qor-slideout--activity-content').append($('.qor-slideout #scroll-tab-activity'));
  };

  $(function () {
    var selector = '[data-toggle="qor.activity"]';

    $(document).
      on(EVENT_DISABLE, function (e) {
        QorActivity.plugin.call($(selector, e.target), 'destroy');
      }).
      on(EVENT_ENABLE, function (e) {
        QorActivity.plugin.call($(selector, e.target));
      }).
      triggerHandler(EVENT_ENABLE);
  });

  return QorActivity;

});
