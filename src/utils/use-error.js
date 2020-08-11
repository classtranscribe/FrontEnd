function CTError(name, message) {
  this.name = name;
  this.message = message;
}

CTError.prototype = Error.prototype;

export default CTError;