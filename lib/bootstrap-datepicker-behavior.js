(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone.marionette', 'bootstrap-datepicker'], factory);
  } else if (typeof exports !== 'undefined') {
    var Marionette = require('backbone.marionette');
    var BootstrapDatepicker = require('bootstrap-datepicker');
    module.exports = factory(Marionette);
  } else {
    root.BootstrapDatePickerBehavior = factory(root.Marionette);
  }
})(this, function (Marionette) {

  return Marionette.Behavior.extend({

    defaults: {
      selector: null,
      modelField: null,
      format: 'mm/dd/yyyy',
      startDate: null,
      endDate: null,
      orientation: 'auto',
      allowClear: false
    },

    modelEvents: function() {
      var modelEvents = {};
      modelEvents['change:' + this.getOption('modelField')] = '_updateView';
      return modelEvents;
    },

    ui: function() {
      return {el: this.getOption('selector')};
    },

    initialize: function() {
      if (!this.getOption('selector')) {
        throw new Error('Must specify selector in BootstrapDatePickerBehavior');
      }
      if (!this.getOption('modelField')) {
        throw new Error('Must specify modelField in BootstrapDatePickerBehavior');
      }
      if (!this.getOption('format')) {
        throw new Error('Must specify format in BootstrapDatePickerBehavior');
      }
      if (!this.getOption('orientation')) {
        throw new Error('Must specify orientation in BootstrapDatePickerBehavior');
      }
    },

    onRender: function() {
      this.ui.el.datepicker({
        format: this.getOption('format'),
        startDate: this.getOption('startDate'),
        endDate: this.getOption('endDate'),
        orientation: this.getOption('orientation'),
        clearBtn: this.getOption('allowClear'),
        autoclose: true
      });
      this._updateView();
      this._bindEvents();
    },

    onDestroy: function() {
      this._unbindEvents();
    },

    _bindEvents: function() {
      if (this._eventsBound) {
        return;
      }
      this._eventsBound = true;
      var that = this;
      this.ui.el.on('changeDate.datepickerbehavior', function (evt) {
        that._updateModel(evt);
      });
      this.ui.el.on('keydown.datepickerbehavior', function (evt) {
        that._handleKey(evt);
      });
    },

    _unbindEvents: function() {
      this.ui.el.off('.datepickerbehavior');
    },

    _updateView: function() {
      var modelField = this.getOption('modelField');
      var value = this.view.model.get(modelField) || '';
      this.ui.el.datepicker('setDate', value);
    },

    _updateModel: function (evt) {
      var modelField = this.getOption('modelField');
      var value = evt.format() || null;
      this.view.model.set(modelField, value);
    },

    _handleKey: function (evt) {
      if (this._shouldBlockKey(evt.which)) {
        evt.preventDefault();
      }
      // backspace or delete
      if ((evt.which === 8 || evt.which === 46) && this.getOption('allowClear')) {
        var modelField = this.getOption('modelField');
        this.view.model.set(modelField, null);
      }
    },

    _shouldBlockKey: function (which) {
      // not tab, escape, or arrows
      return which !== 9
          && which !== 27
          && which !== 37
          && which !== 38
          && which !== 39
          && which !== 40;
    }

  });

});
