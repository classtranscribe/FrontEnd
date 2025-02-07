class EPubImageData {
  __data__ = {
    src: '',
    alt: 'Video screenshot',
    descriptions: ['']
  };

  constructor(imageLike) {
    // eslint-disable-next-line no-console
    if (typeof imageLike === 'string') {
      this.src = imageLike;
    } else if (imageLike) {
      if (imageLike.src) {
        this.src = imageLike.src;
      }

      if (imageLike.alt) {
        this.alt = imageLike.alt;
      }

      if (imageLike.descriptions) {
        this.descriptions = [...imageLike.descriptions];
      }
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

  get descriptions() {
    return this.__data__.descriptions;
  }

  set descriptions(descriptions) {
    this.__data__.descriptions = descriptions;
  }
}

export default EPubImageData;