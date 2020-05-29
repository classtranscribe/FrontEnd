/**
 * A template class for handling states
 */
export class StateController {
  dispatches = {};

  /**
   * Set state
   * @param {String} funcName - The name of the set-state function
   * @param {String} stateName - The name of the state
   * @param {*} value - the value to set
   */
  setState(funcName, stateName, value) {
    const setState = this.dispatches[funcName];
    if (setState) {
      setState(value);
      this[stateName] = value;
    }
  }

  /**
   * Register the set state functions
   * @param {Object} dispatches - The set-state functions to register
   * @param {Boolean} replace - True if replace the registered functions
   */
  register(dispatches, replace) {
    if (replace) {
      this.dispatches = { ...dispatches };
    } else {
      this.dispatches = { ...this.dispatches, ...dispatches };
    }
  }
}