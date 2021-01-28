export default {
    namespace: 'global',
    state: {

    },
    reducers: {
      delete(state, { payload: id }) {
        return state.filter(item => item.id !== id);
      },
    },
    subscriptions: {
      setup({ dispatch, history }) {
        
      }
    }
  };