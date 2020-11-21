import ExcelComponent from '@core/ExcelComponent';
import {$} from '@core/dom';

export default class Formula extends ExcelComponent {
  static className = 'excel__formula';
  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      subscribe: ['currentText'],
      ...options,
    });
  }
  init() {
    super.init();
    this.$formula = this.$root.find('#formula');
    this.$on('table:select', $cell=>{
      this.$formula.addText($cell.data.value);
    });
  }
  storeChanges({currentText}) {
    this.$formula.addText(currentText);
  }

  toHtml() {
    return `
        <div class="info">fx</div>
        <div 
            id="formula"
            class="input"
            contenteditable
            spellcheck="false"
            >
        </div>
    `;
  }
  onInput(event) {
    this.$emit('formula:input', $(event.target).addText());
  }
  onKeydown(event) {
    const keys = ['Enter', 'Tab'];
    if (keys.includes(event.key)) {
      event.preventDefault();
      this.$emit('formula:done');
    }
  }
}
