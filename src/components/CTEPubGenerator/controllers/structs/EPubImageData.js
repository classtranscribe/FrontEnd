class EPubImageData {
  __data__ = {
    src: '',
    alt: 'Video screenshot',
    description: ''
  };
  
  constructor(imageLike) {
    if (imageLike instanceof EPubImageData) {
      this.__data__ = { ...imageLike.__data__ };
    } else if (typeof imageLike === 'string') {
      this.src = imageLike;
    } else {
      this.src = imageLike.src;
      this.alt = imageLike.alt;
      this.description = imageLike.description;
    }
  }

  toObject() {
    return { ...this.__data__ };
  }

  get src() {
    return this.__data__.src;
  }

  set src(src) {
    this.__data__.src = src;
  }

  get alt() {
    return this.__data__.alt;
  }

  set alt(alt) {
    this.__data__.alt = alt;
  }

  get description() {
    return this.__data__.description;
  }

  set description(description) {
    this.__data__.description = description;
  }
}

export default EPubImageData;