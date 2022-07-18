export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.getTimeSeconds = function() {
    return this.hour() * 3600 + this.minute() * 60 + this.second()
  }

  dayjsClass.prototype.utcSecond = function(endTime, currDate) {
    const currUtcDate = currDate.utc(true).startOf('day')

    const utcStartDate = this.utc()
    const utcEndDate = endTime.utc()

    if (utcStartDate.isBefore(currUtcDate, 'day')) {
      if (utcEndDate.isBefore(currUtcDate, 'day'))
        return [
          {
            start: utcStartDate.getTimeSeconds(),
            end: utcEndDate.getTimeSeconds()
          },
          null,
          null
        ]

      if (utcEndDate.getTimeSeconds() === 0) 
        return [
          {
            start: utcStartDate.getTimeSeconds(),
            end: utcEndDate.endOf('day').getTimeSeconds() + 1
          },
          null,
          null
        ]

      return [
        {
          start: utcStartDate.getTimeSeconds(),
          end: utcStartDate.endOf('day').getTimeSeconds() + 1
        },
        {
          start: utcEndDate.startOf('day').getTimeSeconds(),
          end: utcEndDate.getTimeSeconds()
        },
        null
      ]  
    }

    if (utcEndDate.isAfter(currUtcDate, 'day')) {
      if (utcStartDate.isAfter(currUtcDate, 'day'))
        return [
          null,
          null,
          {
            start: utcStartDate.getTimeSeconds(),
            end: utcEndDate.getTimeSeconds()
          }
        ]

      //check is end === 0 and start === 0
      if (utcEndDate.getTimeSeconds() === 0)
        return [
          null,
          {
            start: utcStartDate.getTimeSeconds(),
            end: utcStartDate.endOf('day').getTimeSeconds() + 1
          },
          null
        ]

      return [
        null,
        {
          start: utcStartDate.getTimeSeconds(),
          end: utcStartDate.endOf('day').getTimeSeconds() + 1
        },
        {
          start: utcEndDate.startOf('day').getTimeSeconds(),
          end: utcEndDate.getTimeSeconds()
        }
      ]
    }

    //check is date same
    return [
      null,
      {
        start: utcStartDate.getTimeSeconds(),
        end: utcEndDate.getTimeSeconds()
      },
      null
    ]
  }

  dayjsClass.prototype.convFromSeconds = function(secondsArr) {
    const currDate = this.utc(true).startOf('day')

    if (!Array.isArray(secondsArr))
      return {
        start: currDate.set('second', secondsArr.start),
        end: currDate.set('second', secondsArr.end)
      }

    const [previusTime, currTime, nextTime] = secondsArr

    if (previusTime) {
      if (!currTime) 
        return {
          start: currDate.subtract(1, 'day').set('second', previusTime.start),
          end: currDate.subtract(1, 'day').set('second', previusTime.end)
        }
      
      return {
        start: currDate.subtract(1, 'day').set('second', previusTime.start),
        end: currDate.set('second', currTime.end)
      }
    }

    if (nextTime) {
      if (!currTime)
        return {
          start: currDate.add(1, 'day').set('second', nextTime.start),
          end: currDate.add(1, 'day').set('second', nextTime.end)
        }

      return {
        start: currDate.set('second', currTime.start),
        end: currDate.add(1, 'day').set('second', nextTime.end)
      }
    }

    return {
      start: currDate.set('second', currTime.start),
      end: currDate.set('second', currTime.end)
    }
  }
}