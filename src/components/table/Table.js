import ExcelComponent from '@core/ExcelComponent';
import {parse} from '@core/parse';
import {$} from '@core/dom';
import {createTable} from '@/components/table/table.template';
import {resizeHandler} from '@/components/table/table.resize';
import {
  isCell,
  shouldResize,
  matrix,
  nextSelector,
} from '@/components/table/table.functions';
import TableSelection from '@/components/table/TableSelection';
import * as actions from '@/redux/actions';
import {defaultStyle} from '@/constants';

export default class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    });
  }

  toHtml() {
    return createTable(20, this.store.getState());
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell);
    this.$on('formula:input', text=>{
      this.selection.current
          .attr('data-value', text)
          .addText(parse(text));
      this.updateTextInStore(text);
    });

    this.$on('formula:done', ()=>{
      this.selection.current.focus();
    });
    this.$on('toolbar:applyStyle', value=>{
      this.selection.applyStyle(value);
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectIds,
      }));
    });
  }
  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyle));
    this.$dispatch(actions.changeStyles(styles));
  }
  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize(data));
    } catch (e) {
      console.warn('resize error:', e.message);
    }
  }
  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event).then(() => console.log());
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        // group
        const $cells = matrix($target, this.selection.current)
            .map(id=>this.$root.find(`[data-id="${id}"]`));
        this.selection.selectGroup($cells);
      } else {
        this.selectCell($target);
      }
    }
  }
  onKeydown(event) {
    const keys = ['Tab', 'Enter',
      'ArrowLeft', 'ArrowRight',
      'ArrowUp', 'ArrowDown'];
    const {key} = event;
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current.id(true);

      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next);
    }
  }
  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value,
    }));
  }
  onInput(event) {
    this.updateTextInStore($(event.target).addText());
  }
}

