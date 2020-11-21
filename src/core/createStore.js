export function createStore(rootReducer, initialState ={}) {
  // private methods
  let state = rootReducer({...initialState}, {type: '__INIT__'});
  let listeners = [];

  return {
    // public methods
    subscribe(fn) {
      listeners.push(fn);
      // unsubscribe
      return {
        unsubscribe() {
          listeners = listeners.filter(l=>l !== fn);
        },
      };
    },
    dispatch(action) {
      state = rootReducer(state, action);
      listeners.forEach(listener=>listener(state));
    },
    getState() {
      // this is not give mutation to state
      return JSON.parse(JSON.stringify(state));
    },
  };
}
// extra task rewrite to class component;
