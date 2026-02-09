import { StateController } from './state-controller';

describe('StateController', () => {
  let controller;

  beforeEach(() => {
    controller = new StateController();
  });

  describe('register', () => {
    it('registers dispatch functions additively by default', () => {
      const dispatch1 = jest.fn();
      const dispatch2 = jest.fn();

      controller.register({ func1: dispatch1 });
      controller.register({ func2: dispatch2 });

      expect(controller.dispatches).toEqual({
        func1: dispatch1,
        func2: dispatch2,
      });
    });

    it('replaces all dispatch functions when replace is true', () => {
      const dispatch1 = jest.fn();
      const dispatch2 = jest.fn();
      const dispatch3 = jest.fn();

      controller.register({ func1: dispatch1, func2: dispatch2 });
      controller.register({ func3: dispatch3 }, true);

      expect(controller.dispatches).toEqual({
        func3: dispatch3,
      });
      expect(controller.dispatches.func1).toBeUndefined();
      expect(controller.dispatches.func2).toBeUndefined();
    });

    it('merges dispatch functions when replace is false', () => {
      const dispatch1 = jest.fn();
      const dispatch2 = jest.fn();
      const dispatch3 = jest.fn();

      controller.register({ func1: dispatch1 });
      controller.register({ func2: dispatch2, func3: dispatch3 }, false);

      expect(controller.dispatches).toEqual({
        func1: dispatch1,
        func2: dispatch2,
        func3: dispatch3,
      });
    });
  });

  describe('setState', () => {
    it('calls the registered dispatch function and sets the state', () => {
      const dispatch = jest.fn();
      controller.register({ setTestState: dispatch });

      controller.setState('setTestState', 'testValue', 'new value');

      expect(dispatch).toHaveBeenCalledWith('new value');
      expect(controller.testValue).toBe('new value');
    });

    it('does nothing if the function name is not registered', () => {
      const dispatch = jest.fn();
      controller.register({ setTestState: dispatch });

      controller.setState('nonExistentFunc', 'testValue', 'new value');

      expect(dispatch).not.toHaveBeenCalled();
      expect(controller.testValue).toBeUndefined();
    });

    it('updates state with different types of values', () => {
      const dispatch = jest.fn();
      controller.register({ setData: dispatch });

      // Test with string
      controller.setState('setData', 'data', 'string value');
      expect(controller.data).toBe('string value');

      // Test with number
      controller.setState('setData', 'data', 42);
      expect(controller.data).toBe(42);

      // Test with object
      const obj = { key: 'value' };
      controller.setState('setData', 'data', obj);
      expect(controller.data).toEqual(obj);

      // Test with array
      const arr = [1, 2, 3];
      controller.setState('setData', 'data', arr);
      expect(controller.data).toEqual(arr);

      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});
