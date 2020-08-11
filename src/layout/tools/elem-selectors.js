import React from 'react';

export const isRenderable = (Renderable) => {
  if (!Renderable) {
    return true
  } if (Array.isArray(Renderable)) {
    return Renderable.reduce((isValid, curr) => (isValid && isRenderable(curr)));
  } 
    return React.isValidElement(Renderable)
};

export const makeEl = (Renderable, props = {}) => {
  if (isRenderable(Renderable)) {
    return Renderable;
  } if (Renderable) {
    return React.createElement(Renderable, props);
  }
};

export const altEl = (
  Component,
  use,
  props,
  AltComponent, 
  altProps = {}
) => {
  let element = null;
  if (use) {
    element = makeEl(Component, props);
  } else if (AltComponent) {
    element = makeEl(AltComponent, altProps);
  }

  return element;
};