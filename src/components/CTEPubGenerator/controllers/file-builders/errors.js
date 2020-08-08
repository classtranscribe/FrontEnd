/**
 * An error which occurred while loading the images for an ePub
 */
function _LoadImageError() {
  this.name = 'LoadImageError';
  this.message = 'Failed to load images.';
}
_LoadImageError.prototype = Error.prototype;

export const LoadImageError = new _LoadImageError();

/**
 * An error which occurred when the required information for creating an ePub file is invalid
 */
export function _EPubValidationError() {
  this.name = 'EPubValidationError';
  this.message = 'Invalid ePub data.';
}
_EPubValidationError.prototype = Error.prototype;

export const EPubValidationError = new _EPubValidationError();