export default (dayjsInst, dayjsClass, dayjsFactory) => {
  const dayjs = dayjsInst

  dayjsClass.prototype.toJSON = function() {
    return this.format()
  }

  dayjsClass.prototype.properTz = function(tz) {
    return this.utc(true).startOf('date').tz(tz, true).hour(this.hour()).minute(this.minute()).second(this.second())
  }

  dayjsFactory.stringToDate = (isoString) => {
    const lastChar = isoString.charAt(isoString.length - 1);
    if (lastChar === 'Z') {
      return dayjs(isoString).utc()
    }

    const [hours, minutes] = isoString.slice(-6).split(':')

    const minutesOffset = Number(hours) < 0 ? 
      (Number(hours) * 60 - Number(minutes)) : 
      (Number(hours) * 60 + Number(minutes))

    return dayjs(isoString).utc().utcOffset(minutesOffset)
  }
}