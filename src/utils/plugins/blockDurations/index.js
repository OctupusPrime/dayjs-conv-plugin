export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.getBlocksDuration = function(endTime, blockSize) {
    const blockSizeInMs = blockSize * 60000

    let startDate = this.utc().clone()

    let startUnixSec = this.utc().valueOf()
    const endUnixSec = endTime.utc().valueOf()

    const blocksArr = []

    if (startUnixSec + blockSizeInMs - 6000 > endUnixSec)
      return blocksArr

    while (endUnixSec > startUnixSec) {
      if (startDate.valueOf() + blockSizeInMs <= endUnixSec)
        blocksArr.push(startDate)

      startDate = startDate.add(blockSize, 'minute')

      startUnixSec += blockSizeInMs
    }

    return blocksArr
  }
}