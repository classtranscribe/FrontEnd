class Entity {
  constructor(data) {
    if (data && data.id) this.__id = data.id;
    this.__data = data;
  }

  get id() {
    return this.__id;
  }

  toObject() {
    return this.__data;
  }
}

export default Entity;