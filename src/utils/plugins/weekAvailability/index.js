function getTimeInNumber(date) {
  return date.year() * 1000 + date.month() * 100 + date.date()
}

function isDayBefore(startDate, endDate) {
  const startTime = getTimeInNumber(startDate)
  const endTime = getTimeInNumber(endDate)

  return startTime < endTime
}

function isDaySame(startDate, endDate) {
  const startTime = getTimeInNumber(startDate)
  const endTime = getTimeInNumber(endDate)

  return startTime === endTime
}

function isDayAfter(startDate, endDate) {
  const startTime = getTimeInNumber(startDate)
  const endTime = getTimeInNumber(endDate)

  return startTime > endTime
}

function addMinutes(date, minutes) {
  const timeInMinutes = date.hour() * 60 + date.minute() + minutes

  const mergetHours = Math.floor(timeInMinutes / 60)
  const mergetMinutes = timeInMinutes % 60

  return date.hour(mergetHours).minute(mergetMinutes)
}

export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.getTimeSeconds = function() {
    return this.hour() * 3600 + this.minute() * 60 + this.second()
  }

  //conv to seconds and back
  dayjsClass.prototype.utcSecond = function(endTime) {
    const utcStartDate = this.isUTC() ? this : this.utc()
    const utcEndDate = endTime.isUTC() ? endTime : endTime.utc()

    if (isDayBefore(utcStartDate, this)) {
      if (isDayBefore(utcEndDate, this))
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

    if (isDayAfter(utcEndDate, this)) {
      if (isDayAfter(utcStartDate, this))
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

  //week avail
  dayjsFactory.generateAvail = (times, availDays) => {
    const newAvail = [[], [], [], [], [], [], []]

    for (let i = 0; i < 7; i++) {
      if (availDays[i]) {
        newAvail[i].push({
          start: times.start.day(i),
          end: times.end.day(i)
        })
      }
    }
  
    return newAvail
  }

  dayjsFactory.availToSeconds = (dayjsAvail) => {
    const flatArr = dayjsAvail.flat(1)

    const secondAvail = [[], [], [], [], [], [], []]

    flatArr.forEach((time) => {
      const dayIndex = time.start.day()
      const [previus, curr, next] = time.start.utcSecond(time.end)

      if (previus) 
        secondAvail[dayIndex - 1 < 0 ? 6 : dayIndex - 1].push(previus)
      
      if (curr)
        secondAvail[dayIndex].push(curr)

      if (next)
        secondAvail[dayIndex + 1 > 6 ? 0 : dayIndex + 1].push(next)
    });

    return secondAvail
  }

  dayjsClass.prototype.secondsToAvail = function(secondsAvail, tz) {
    const dayjsArr = []

    secondsAvail.forEach((day, index) => {
      day.forEach(el => {
        const dayDurr = this.day(index).convFromSeconds(el)

        const startTime = dayDurr.start.tz(tz)
        const endTime = dayDurr.end.tz(tz) 

        if (isDayAfter(endTime, startTime)) {
          dayjsArr.push({
            start: startTime,
            end: endTime.startOf('date')
          }, {
            start: endTime.startOf('date'),
            end: endTime
          })
        } else {
          dayjsArr.push({
            start: startTime,
            end: endTime
          })
        }
      })
    })
    //merge splited times
    const mergeTimes = []

    for (let i = 0; i < dayjsArr.length; i++) {
      const el = dayjsArr[i]
      const nextEl = dayjsArr[i + 1]
      
      if (nextEl) {
        if (el.end.isSame(nextEl.start) && isDaySame(el.start, nextEl.end)) {
          mergeTimes.push({
            start: el.start,
            end: nextEl.end
          })

          i++
        } else {
          mergeTimes.push({...el}) 
        }
      } else {
        mergeTimes.push({...el}) 
      }
    }

    //create new avail
    const newDayjsAvail = [[], [], [], [], [], [], []]

    mergeTimes.forEach(el => {
      const dayIndex = el.start.day()

      newDayjsAvail[dayIndex].push({...el})
    })

    return newDayjsAvail
  }

  dayjsClass.prototype.generateBlocksFromDurr = function(endTime, blockSize) {
    const blockSizeInMs = blockSize * 60000

    let startDate = this

    let startUnixSec = this.valueOf()
    const endUnixSec = endTime.valueOf()

    const blocksArr = []

    if (startUnixSec + blockSizeInMs > endUnixSec)
      return blocksArr

    while (endUnixSec > startUnixSec) {
      if (this.valueOf() + blockSizeInMs <= endUnixSec)
        blocksArr.push(startDate)

      startDate = addMinutes(startDate, blockSize)

      startUnixSec += blockSizeInMs
    }

    return blocksArr
  }

  dayjsFactory.availToBlockDurr = (dayjsAvail, blockSize) => {
    const blocksArr = dayjsAvail.map(el => 
      el.map(time => time.start.generateBlocksFromDurr(time.end, blockSize)).flat(1)
    )

    return blocksArr
  }

  dayjsFactory.addBlockedTimes = (dayjsDurr, blocksArr, itemSize) => {
    let arrWithBlocked = []

    if (!blocksArr.length)
      return dayjsDurr

    blocksArr.forEach((blockItem, index) => {
      //Initial blocks
      if (index === 0) {
        dayjsDurr.forEach(el => {
          if (el.isAfter(blockItem.end, 'minute') 
            || el.isSame(blockItem.end, 'minute')
            ||addMinutes(el, itemSize - 1).isBefore(blockItem.start, 'minute'))
            arrWithBlocked.push(el)
        })
      } else {
        arrWithBlocked = arrWithBlocked.filter(el => {
          if (el.isAfter(blockItem.end, 'minute') 
            || el.isSame(blockItem.end, 'minute')
            || addMinutes(el, itemSize - 1).isBefore(blockItem.start, 'minute'))
            return el
        })
      }
    })

    return arrWithBlocked
  }

  dayjsClass.prototype.availDurrChangeDate = function(availDurr) {
    //Generate from date to week of dates
    const weekDates = []

    for (let i = 0; i < 7; i++) {
      weekDates.push(this.day(i))
    }

    const newAvailDurr = availDurr.map((day, dayIndex) => {
      const selecedDate = weekDates[dayIndex]

      return day.map(time => 
        time
          .year(selecedDate.year())
          .month(selecedDate.month())
          .date(selecedDate.date())
        )
    })

    return newAvailDurr
  }
}