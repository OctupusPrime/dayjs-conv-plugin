const minTzStep = 15

export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.getBlocksDuration = function(endTime, blockSize) {
    const blockSizeInMs = blockSize * 60000

    let startDate = this.utc().clone()

    let startUnixSec = this.utc().valueOf()
    const endUnixSec = endTime.utc().valueOf()

    const blocksArr = []

    if (startUnixSec + blockSizeInMs > endUnixSec)
      return blocksArr

    while (endUnixSec > startUnixSec) {
      if (startDate.valueOf() + blockSizeInMs <= endUnixSec)
        blocksArr.push(startDate)

      startDate = startDate.add(blockSize, 'minute')

      startUnixSec += blockSizeInMs
    }

    return blocksArr
  }

  dayjsClass.prototype.toJSON = function() {
    return this.format()
  }

  dayjsClass.prototype.convAvailToUTC = function(secondsTime) {
    const selectedDate = this.utc(true)

    const TimesArr = secondsTime.map((el, index) => 
      el.map(time => selectedDate.day(index).convFromSeconds(time)))

    const DayjsAvail = TimesArr.map(el => 
      el.map(time => time.start.getBlocksDuration(time.end, minTzStep)).flat(1))

    return DayjsAvail
  }

  dayjsFactory.changeAvailOpts = (availArr, tz, dur) => {
    let newAvailArrWithTz = [[], [], [], [], [], [], []]

    //Get all days in one arr
    const datesArr = availArr.flat(1).map(el => el.tz(tz))

    //Check pos in week index and set
    datesArr.forEach(date => {
      newAvailArrWithTz[date.day()].push(date)
    })

    //Sort merged dates
    const sortedNewAvail = newAvailArrWithTz.map(day => 
      day.sort((a, b) => b.isBefore(a)))

    if (!dur) 
      return sortedNewAvail

    //Change block duration
    const blockDur = dur / minTzStep - 1
    
    const mergedBlocksAvail = [[], [], [], [], [], [], []]

    sortedNewAvail.forEach((day, index) => {
      for (let i = 0; i < day.length; i++) {
        if (i + blockDur < day.length) {
          mergedBlocksAvail[index].push(day[i])
          i = i + blockDur
        }
      }
    })

    return mergedBlocksAvail
  }

  dayjsFactory.createWeekAvail = (dates, secondsTime) => {
    let availArr = [[], [], [], [], [], [], []]

    const [previus, curr, next] = secondsTime

    for (let i = 0; i < 7; i++) {
      if (dates.includes(i + '')) {
        if (previus) 
          availArr[i - 1 < 0 ? 6 : i - 1].push(previus)
        
        if (curr)
          availArr[i].push(curr)

        if (next)
          availArr[i + 1 > 6 ? 0 : i + 1].push(next)
      }
    }

    return availArr
  }

  dayjsFactory.weekDurationTz = (durationArr, tz) => {
    let newDurationArr = [[], [], [], [], [], [], []]

    //Get all days in one arr
    const datesArr = durationArr.flat(1).map(el => el.tz(tz))

    //Check pos in week index and set
    datesArr.forEach(date => {
      newDurationArr[date.day()].push(date)
    })

    return newDurationArr
  }
}