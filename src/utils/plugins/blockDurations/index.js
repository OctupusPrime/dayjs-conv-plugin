export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.getBlocksDuration = function(endTime, blockSize) {
    let startDate = this.utc().clone()

    let startUnixSec = this.utc().valueOf()
    const endUnixSec = endTime.utc().valueOf()

    const blocksArr = []

    while (endUnixSec > startUnixSec) {
      blocksArr.push(startDate)

      startDate = startDate.add(blockSize, 'minute')

      startUnixSec += blockSize * 60000
    }

    return blocksArr
  }
}