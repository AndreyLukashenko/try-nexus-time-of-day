// Generated by CoffeeScript 1.9.1
var AppView, TimeModel, TimeOfDay, TimeViewModel,
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

TimeOfDay = (function() {
  var time_of_day_intervals;

  function TimeOfDay() {}

  TimeOfDay.MORNING = 0;

  TimeOfDay.DAY = 1;

  TimeOfDay.EVENING = 2;

  TimeOfDay.NIGHT = 3;

  TimeOfDay.TIME_OF_DAY_COUNT = 4;

  time_of_day_intervals = [[5, 10], [11, 17], [18, 23], [0, 4]];

  TimeOfDay.from_hours = function(hours) {
    var end, index, start, time_of_day;
    time_of_day = ((function() {
      var i, len, ref, results;
      results = [];
      for (index = i = 0, len = time_of_day_intervals.length; i < len; index = ++i) {
        ref = time_of_day_intervals[index], start = ref[0], end = ref[1];
        if ((start <= hours && hours <= end)) {
          results.push(index);
        }
      }
      return results;
    })())[0];
    return time_of_day;
  };

  TimeOfDay.is_last_hour = function(hours) {
    return time_of_day_intervals.some(function(arg) {
      var end;
      end = arg[arg.length - 1];
      return hours === end;
    });
  };

  TimeOfDay.name_of = function(time_of_day) {
    return ['morning', 'day', 'evening', 'night'][time_of_day];
  };

  TimeOfDay.next = function(time_of_day) {
    return (time_of_day + 1) % TimeOfDay.TIME_OF_DAY_COUNT;
  };

  return TimeOfDay;

})();

TimeViewModel = (function(superClass) {
  extend(TimeViewModel, superClass);

  function TimeViewModel() {
    var _;
    TimeViewModel.__super__.constructor.apply(this, arguments);
    this.time_of_day = new nx.Cell;
    this.time_of_day['<-'](this.hours, TimeOfDay.from_hours);
    _ = function(f1, f2) {
      return function() {
        return f2(f1.apply(null, arguments));
      };
    };
    this.status = new nx.Cell;
    this.status['<-']([this.hours, this.minutes], function(hours, minutes) {
      if (hours > 23 || hours < 0) {
        return {
          message: 'Please use 0-23 format for hours',
          valid: false
        };
      } else if (minutes > 59 || minutes < 0) {
        return {
          message: 'Please use 0-59 format for minutes',
          valid: false
        };
      } else {
        return {
          valid: true
        };
      }
    });
    this.message = new nx.Cell;
    this.message['<-']([this.time_of_day, this.hours, this.minutes], function(time_of_day, hours, minutes) {
      var message, next_time_of_day;
      message = "now is " + (TimeOfDay.name_of(time_of_day));
      if (TimeOfDay.is_last_hour(hours)) {
        next_time_of_day = _(TimeOfDay.next, TimeOfDay.name_of)(time_of_day);
        message += " " + (60 - minutes) + " minutes left until the " + next_time_of_day + "!";
      }
      return message;
    });
  }

  return TimeViewModel;

})(TimeModel);

AppView = function(context) {
  return nxt.Element('main', nxt.Element('h1', nxt.Text('Determination of the time of day')), nxt.Element('div', nxt.Class('time-now'), nxt.Element('span', nxt.Text('What time is it?')), nxt.Element('input', nxt.Attr('type', 'number'), nxt.Class("time-input"), nxt.ValueBinding(context.hours, function(hours) {
    return hours;
  }, function(value) {
    return +value;
  })), nxt.Text(':'), nxt.Element('input', nxt.Attr('type', 'number'), nxt.Class("time-input"), nxt.ValueBinding(context.minutes, function(minutes) {
    return minutes;
  }, function(value) {
    return +value;
  }))), nxt.Binding(context.status, function(arg) {
    var message, valid;
    valid = arg.valid, message = arg.message;
    if (valid) {
      return nxt.Element('h2', nxt.Binding(context.message, nxt.Text));
    } else {
      return nxt.Element('div', nxt.Class('invalid'), nxt.Text(message));
    }
  }));
};

window.addEventListener('load', function() {
  window.model = new TimeViewModel;
  return document.body.appendChild(AppView(model).data.node);
});
