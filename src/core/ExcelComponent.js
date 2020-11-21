import DomListener from '@core/DomListener';

export default class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || '';
    this.emitter = options.emitter;
    this.subscribe = options.subscribe || [];
    this.store = options.store;
    this.unsubscribers = [];
    this.prepare();
  }

  // configure our component before initialization
  prepare() {}

  // return component template
  toHtml() {
    return '';
  }

  // notified listeners about event
  $emit(event, ...args) {
    this.emitter.emit(event, ...args);
  }

  // subscribe to event
  $on(event, fn) {
    const unsubscribe = this.emitter.subscribe(event, fn);
    this.unsubscribers.push(unsubscribe);
  }
  // send requests to reducer
  $dispatch(action) {
    this.store.dispatch(action);
  }
  // to store change coming changes only where we subscribed
  storeChanges() {

  }

  isWatching(key) {
    return this.subscribe.includes(key);
  }
  // initializing component
  // adding DOM listeners
  init() {
    this.initDomListeners();
  }

  // remove Component
  // clean listeners
  destroy() {
    this.removeDomListeners();
    this.unsubscribers.forEach(unsub =>unsub());
  }
}
