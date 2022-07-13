export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.getTimeSeconds = function() {
    return this.hour() * 3600 + this.minute() * 60 + this.second()
  }

  dayjsClass.prototype.utcSecond = function(endTime) {
    const utcStartDate = this.utc()
    const utcEndDate = endTime.utc()

    //check is date - 1
    if (this.utc(true).isAfter(utcStartDate, 'day'))
      return [
        {
          start: utcStartDate.getTimeSeconds(),
          end: utcStartDate.endOf('day').getTimeSeconds()
        },
        {
          start: utcEndDate.startOf('day').getTimeSeconds(),
          end: utcEndDate.getTimeSeconds()
        },
        null
      ]

    //check is date + 1
    if (endTime.utc(true).isBefore(utcEndDate, 'day'))
      return [
        null,
        {
          start: utcStartDate.getTimeSeconds(),
          end: utcStartDate.endOf('day').getTimeSeconds()
        },
        {
          start: utcEndDate.startOf('day').getTimeSeconds(),
          end: utcEndDate.getTimeSeconds()
        }
      ]

    //check is date same
    return {
      start: utcStartDate.getTimeSeconds(),
      end: utcEndDate.getTimeSeconds()
    }
  }

  dayjsClass.prototype.convFromSeconds = function(secondsArr) {
    const currDate = this.utc(true).startOf('day')

    if (!Array.isArray(secondsArr))
      return {
        start: currDate.set('second', secondsArr.start),
        end: currDate.add(1, 'day').set('second', secondsArr.end)
      }

    const [previusTime, currTime, nextTime] = secondsArr

    if (previusTime)
      return {
        start: currDate.subtract(1, 'day').set('second', previusTime.start),
        end: currDate.set('second', currTime.end)
      }

    if (nextTime)
      return {
        start: currDate.set('second', currTime.start),
        end: currDate.add(1, 'day').set('second', nextTime.end)
      }

    return {
      start: currDate.set('second', currTime.start),
      end: currDate.set('second', currTime.end)
    }
  }
}