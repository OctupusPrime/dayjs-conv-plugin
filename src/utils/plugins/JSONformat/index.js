export default (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.toJSON = function() {
    return this.format()
  }
}