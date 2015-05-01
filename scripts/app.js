// Generated by CoffeeScript 1.9.2
(function() {
  var AppView, TimeModel, TimeViewModel, validate,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  TimeModel = (function() {
    function TimeModel() {
      this.minutes = new nx.Cell({
        value: new Date().getMinutes()
      });
      this.hours = new nx.Cell({
        value: new Date().getHours()
      });
    }

    return TimeModel;

  })();

  TimeViewModel = (function(superClass) {
    extend(TimeViewModel, superClass);

    function TimeViewModel() {
      TimeViewModel.__super__.constructor.apply(this, arguments);
      this.timeOfDay = new nx.Cell;
      this.timeOfDay['<-']([this.hours, this.minutes], function(hours, minutes) {
        if (!(+minutes < 60)) {
          return 'time is incorrect';
        } else if (+hours === 3) {
          return "now is night " + (60 - +minutes) + " minutes left until the morning!";
        } else if (+hours < 3 && +hours > -1) {
          return 'now is night';
        } else if (+hours === 9) {
          return "now is morning " + (60 - +minutes) + " minutes left until the day!";
        } else if (+hours >= 4 && +hours < 10) {
          return 'now is morning!';
        } else if (+hours === 17) {
          return "now is day " + (60 - +minutes) + " minutes left until the evening!";
        } else if (+hours >= 10 && +hours < 17) {
          return 'now is day!';
        } else if (+hours === 23) {
          return "now is evening " + (60 - +minutes) + " minutes left until the night!";
        } else if (+hours > 17 && +hours < 24) {
          return 'now is evening';
        } else {
          return 'time is incorrect!';
        }
      });
    }

    return TimeViewModel;

  })(TimeModel);

  AppView = function(context) {
    return nxt.Element('main', nxt.Element('h1', nxt.Text('Determination of the time of day')), nxt.Element('div', nxt.Class('time-now'), nxt.Element('span', nxt.Text('What time is it?')), nxt.Element('input', nxt.Class("time-input"), nxt.ValueBinding(context.hours), function(hours) {
      return nxt.Attr('value', hours);
    }, function(value) {
      return context.minutes = hours;
    }, nxt.Event('keypress', validate)), nxt.Text(':'), nxt.Element('input', nxt.Class("time-input"), nxt.ValueBinding(context.minutes), function(minutes) {
      return nxt.Attr('value', minutes);
    }, function(value) {
      return context.minutes = value;
    }, nxt.Event('keypress', validate))), nxt.Element('h2', nxt.Binding(context.timeOfDay, function(timeOfDay) {
      return nxt.Text(timeOfDay);
    })));
  };

  validate = function(event) {
    if (!(/[0-9]/.test(String.fromCharCode(event.keyCode))) || this.value.length === 2) {
      return event.returnValue = false;
    }
  };

  window.addEventListener('load', function() {
    window.model = new TimeViewModel;
    return document.body.appendChild(AppView(model).data.node);
  });

}).call(this);
