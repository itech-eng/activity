!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t("object"==typeof exports?require("jquery"):jQuery)}(function(t){"use strict";function i(e,o){this.$element=t(e),this.options=t.extend({},i.DEFAULTS,t.isPlainObject(o)&&o),this.init()}var e=(window.FormData,"qor.activity"),o="enable."+e,a="disable."+e,r="click."+e,n="submit."+e,s=".qor-activity__edit-button",d=".qor-tab__activity",c=".qor-activity__edit-note_form",l=".qor-activity__new-note_form",_="#template__qor-activity__list",u=".qor-activity__lists";return i.prototype={constructor:i,init:function(){this.$element;this.bind(),this.initTabs()},bind:function(){this.$element.on(r,t.proxy(this.click,this)).on(n,"form",t.proxy(this.submit,this)),t(document).on(r,d,t.proxy(this.tabClick,this))},submit:function(i){var e,o=(i.target,t(i.target)),a=this;return i.preventDefault(),e=o.serialize(),t.ajax(o.prop("action"),{method:o.prop("method"),data:e,dataType:"json"}).done(function(i){i.errors||(o.is(c)&&(a.hideEditForm(o),o.find(".qor-activity__list-note").html(i.Note)),o.is(l)&&(t(u).append(a.renderActivityList(i)),a.clearForm()))}),!1},renderActivityList:function(t){var e=i.ACTIVITY_LIST_TEMPLATE;return Mustache.parse(e),Mustache.render(e,t)},clearForm:function(){t('textarea[data-toggle="qor.redactor"]').redactor("code.set",""),t(l).find("textarea").val("")},click:function(i){var e=t(i.target);if(i.stopPropagation(),e.is(s)){var o=e.closest(".qor-activity__list");this.showEditForm(o)}},tabClick:function(i){var e=this,o=t(u).find(".qor-activity__list").size();if(!o){var a=t(d).data("actionId"),r="/admin/orders/"+a+"/!qor_activities";o?t(u).find(".mdl-spinner").remove():t.ajax({url:r,method:"GET",dataType:"json",success:function(i){if(i.length){t(u).html("");for(var o=i.length-1;o>=0;o--)t(u).append(e.renderActivityList(i[o]))}t(u).find(".mdl-spinner").remove()}})}},showEditForm:function(t){t.find(".qor-activity__list-note,.qor-activity__edit-button").removeClass("show").addClass("hide"),t.find(".qor-activity__edit-feilds,.qor-activity__edit-save-button").removeClass("hide").addClass("show")},hideEditForm:function(t){t.find(".qor-activity__list-note,.qor-activity__edit-button").removeClass("hide").addClass("show"),t.find(".qor-activity__edit-feilds,.qor-activity__edit-save-button").removeClass("show").addClass("hide")},initTabs:function(){t(".qor-slideout.is-shown").get(0)||(i.ACTIVITY_LIST_TEMPLATE=t(_).html(),t(".qor-page__body").append(i.CONTENT_HTML),t(".qor-form-container").appendTo(t("#scroll-tab-form")),t("#scroll-tab-activity").appendTo(".mdl-layout__content"),t(".qor-page__header .qor-tab-bar--activity-header").prependTo(".mdl-layout.qor-sliderout__activity-container"),t(".qor-page .qor-page__header").hide(),t(".qor-layout .mdl-layout__content.has-header").removeClass("has-header"),t(".qor-page").css("position","relative"),t(".qor-page__header + .qor-page__body").css("padding-top","0"),t(".qor-page .mdl-layout__container").css("position","relative"),t(".qor-sliderout__activity-container").css("margin","0"),t("#scroll-tab-activity").wrapInner('<div class="qor-form-container"></div>'))}},i.CONTENT_HTML='<div class="mdl-layout mdl-js-layout qor-sliderout__activity-container"><main class="mdl-layout__content qor-slideout--activity-content"><div class="mdl-layout__tab-panel is-active" id="scroll-tab-form"></div></main></div>',i.DEFAULTS={},i.ACTIVITY_LIST_TEMPLATE={},i.plugin=function(o){return this.each(function(){var a,r=t(this),n=r.data(e);if(!n){if(/destroy/.test(o))return;r.data(e,n=new i(this,o))}"string"==typeof o&&t.isFunction(a=n[o])&&a.apply(n)})},t.fn.qorSliderAfterShow.qorActivityinit=function(e,o){var a=t(".qor-slideout > .qor-slideout__body"),r=t(".qor-slideout .qor-tab-bar--activity-header");i.ACTIVITY_LIST_TEMPLATE=t(_).html(),a.wrapInner(i.CONTENT_HTML),t(".qor-slideout .qor-page__header").hide(),t(".qor-sliderout__activity-container").prepend(r),t(".qor-slideout--activity-content").append(t(".qor-slideout #scroll-tab-activity"))},t(function(){var e='[data-toggle="qor.activity"]';t(document).on(a,function(o){i.plugin.call(t(e,o.target),"destroy")}).on(o,function(o){i.plugin.call(t(e,o.target))}).triggerHandler(o)}),i});