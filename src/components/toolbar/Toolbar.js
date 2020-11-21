import {ExcelStateComponent} from '@core/ExcelStateComponent';
import {createToolbar} from './toolbar.template';
import {$} from '@core/dom';
import {defaultStyle} from '@/constants';

export default class Toolbar extends ExcelStateComponent {
  static className = 'excel__toolbar';
  constructor($root, options) {
    super($root, {
      name: 'Toolbar',
      listeners: ['click'],
      subscribe: ['currentStyles'],
      ...options,
    });
  }
  prepare() {
    this.initState(defaultStyle);
  }
  get template() {
    return createToolbar(this.state);
  }

  toHtml() {
    return this.template;
  }
  storeChanges(changes) {
    this.setState(changes.currentStyles);
  }
  onClick(event) {
    const $target = $(event.target);
    if ($target.data.type === 'button') {
      const value = JSON.parse($target.data.value);
      this.$emit('toolbar:applyStyle', value);
    }
  }
}
