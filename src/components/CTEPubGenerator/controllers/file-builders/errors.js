import CTError from 'utils/use-error';

/**
 * An error which occurred while loading the images for an ePub
 */
export const LoadImageError = new CTError('LoadImageError', 'Failed to load images.');

/**
 * An error which occurred when the required information for creating an ePub file is invalid
 */
export const EPubValidationError = new CTError('EPubValidationError', 'Invalid ePub data.');