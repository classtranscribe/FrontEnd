import _ from 'lodash';

class Entity {
  constructor(data) {
    if (data && data.id) this.__id = data.id;
    this.__data = _.cloneDeep(data);
  }

  get id() {
    return this.__id;
  }

  toObject() {
    return _.cloneDeep(this.__data);
  }
}

export default Entity;