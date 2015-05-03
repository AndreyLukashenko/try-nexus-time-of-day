class TimeModel
  constructor: ->
    @minutes = new nx.Cell value: new Date().getMinutes()
    @hours = new nx.Cell value: new Date().getHours()

class TimeOfDay

  @MORNING: 0
  @DAY: 1
  @EVENING: 2
  @NIGHT: 3

  @TIME_OF_DAY_COUNT: 4

  time_of_day_intervals = [
    [5, 10]
    [11, 17]
    [18, 23]
    [0, 4]
  ]

  @from_hours: (hours) ->
    [time_of_day] = (index for [start, end], index in time_of_day_intervals when start <= hours <= end)
    time_of_day

  @is_last_hour: (hours) ->
    time_of_day_intervals.some ([..., end]) -> hours is end

  @name_of: (time_of_day) ->
    [
      'morning'
      'day'
      'evening'
      'night'
    ][time_of_day]

  @next = (time_of_day) ->
    (time_of_day + 1) % TimeOfDay.TIME_OF_DAY_COUNT


class TimeViewModel extends TimeModel
  constructor: ->
    super

    @time_of_day = new nx.Cell
    @time_of_day['<-'] @hours, TimeOfDay.from_hours

    _ = (f1, f2) -> -> f2(f1 arguments...)

    @status = new nx.Cell
    @status['<-'] [@hours, @minutes], (hours, minutes) ->
      if hours > 23 or hours < 0
        message: 'Please use 0-23 format for hours'
        valid: no
      else if minutes > 59 or minutes < 0
        message: 'Please use 0-59 format for minutes'
        valid: no
      else
        valid: yes

    @message = new nx.Cell
    @message['<-'] [@time_of_day, @hours, @minutes], (time_of_day, hours, minutes) ->
     message = "now is #{TimeOfDay.name_of time_of_day}"
     if TimeOfDay.is_last_hour hours
       next_time_of_day = _(TimeOfDay.next, TimeOfDay.name_of) time_of_day
       message += " #{60 - minutes} minutes left until the #{next_time_of_day}!"
     message

AppView = (context) ->
  nxt.Element 'main',
    nxt.Element 'h1',
      nxt.Text 'Determination of the time of day'
    nxt.Element 'div',
      nxt.Class 'time-now'
      nxt.Element 'span',
        nxt.Text 'What time is it?'
      nxt.Element 'input',
        nxt.Attr 'type', 'number'
        nxt.Class "time-input"
        nxt.ValueBinding context.hours,
          (hours) -> hours
          (value) -> +value
      nxt.Text ':'
      nxt.Element 'input',
        # manual range validation is deliberate
        nxt.Attr 'type', 'number'
        nxt.Class "time-input"
        nxt.ValueBinding context.minutes,
          (minutes) -> minutes
          (value) -> +value
    nxt.Binding context.status, ({valid, message}) ->
      if valid
        nxt.Element 'h2',
          nxt.Binding context.message, nxt.Text
      else
        nxt.Element 'div',
          nxt.Class 'invalid'
          nxt.Text message


# validate = (event) ->
#    if !(/[0-9]/.test String.fromCharCode event.keyCode) or this.value.length is 2
#      event.returnValue = false;

window.addEventListener 'load', ->
  window.model = new TimeViewModel
  document.body.appendChild AppView(model).data.node
