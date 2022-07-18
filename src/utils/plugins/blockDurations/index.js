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