function mergeTimes(arr, check) {
  const mergedArr = []

  let currItem = null

  for (let i = 0; i < arr.length; i++) {
    const el = arr[i]
    const nextEl = arr[i + 1]
    // copy
    if (!currItem)
      currItem = {
        start: el.start.clone(),
        end: el.end.clone()
      }
      
    if (nextEl) {
      if (check(el, nextEl))
        currItem.end = nextEl.end
      else {
        mergedArr.push(currItem)
        currItem = {
          start: nextEl.start.clone(),
          end: nextEl.end.clone()
        }
      }
  
    } else
      mergedArr.push(currItem)
  }

  return mergedArr
}

export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.secondsToAvail2 = function (secondsAvail, tz){
    //convert to selected timezone
    const parsedAvail = [[], [], [], [], [], [], []]

    for (let dayIndex in secondsAvail) {
      for (let timeStamp of secondsAvail[dayIndex]) {
        const { start, end } = this.day(dayIndex).convFromSeconds(timeStamp);

        const startTz = start.tz(tz)
        const endTz = end.tz(tz)

        const startTzIndex = startTz.day()
        //if hour 0 retrun previus day
        const endTzIndex = endTz.hour() === 0 
          ? endTz.day(endTz.day() - 1).day() 
          : endTz.day()

        if (startTzIndex === endTzIndex) {
          parsedAvail[startTzIndex].push({
            start: startTz,
            end: endTz
          })
        } else {
          parsedAvail[startTzIndex].push({
            start: startTz,
            end: endTz.startOf('day')
          })

          parsedAvail[endTzIndex].unshift({
            start: endTz.startOf('day'),
            end: endTz
          })
        }
      }
    }
    //sorting timeStamps to be shure (and dont fucking refactoring this for next month)
    const sortedParsedAvail = parsedAvail.map(day => day.sort((a, b) => a.start.valueOf() - b.start.valueOf()))
    console.log(JSON.stringify(sortedParsedAvail))
    //merge splited times within a day
    return sortedParsedAvail.map(day => {
      return mergeTimes(day, (el, nextEl) => el.end.isSame(nextEl.start))
    })
  }
}