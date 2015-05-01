class TimeModel
  constructor: ->
    @minutes = new nx.Cell value: new Date().getMinutes()
    @hours = new nx.Cell value: new Date().getHours()


class TimeViewModel extends TimeModel
     constructor: ->
       super
       @timeOfDay = new nx.Cell
       @timeOfDay['<-'] [@hours, @minutes], (hours, minutes) ->
         if !(+minutes < 60)
           'time is incorrect'
         else if +hours is 3
           "now is night #{60 - +minutes} minutes left until the morning!"
         else if +hours < 3 and +hours > -1
           'now is night'
         else if +hours is 9
           "now is morning #{60 - +minutes} minutes left until the day!"
         else if +hours >= 4 and +hours < 10
           'now is morning!'
         else if +hours is 17
           "now is day #{60 - +minutes} minutes left until the evening!"
         else if +hours >= 10 and +hours < 17
           'now is day!'
         else if +hours is 23
           "now is evening #{60 - +minutes} minutes left until the night!"
         else if +hours > 17 and +hours < 24
           'now is evening'
         else
           'time is incorrect!'


AppView = (context) ->
  nxt.Element 'main',
    nxt.Element 'h1',
      nxt.Text 'Determination of the time of day'
    nxt.Element 'div',
      nxt.Class 'time-now'
      nxt.Element 'span',
        nxt.Text 'What time is it?'
      nxt.Element 'input',
        nxt.Class "time-input"
        nxt.ValueBinding context.hours
        (hours) ->
          nxt.Attr 'value', hours
        (value) ->
          context.minutes = hours
        nxt.Event 'keypress', validate
      nxt.Text ':'
      nxt.Element 'input',
        nxt.Class "time-input"
        nxt.ValueBinding context.minutes
        (minutes) ->
          nxt.Attr 'value', minutes
        (value) ->
          context.minutes = value
        nxt.Event 'keypress', validate
    nxt.Element 'h2',
      nxt.Binding context.timeOfDay, (timeOfDay) ->
        nxt.Text timeOfDay


validate = (event) ->
   if !(/[0-9]/.test String.fromCharCode event.keyCode) or this.value.length is 2
     event.returnValue = false;

window.addEventListener 'load', ->
  window.model = new TimeViewModel
  document.body.appendChild AppView(model).data.node
