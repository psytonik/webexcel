import {toInlineStyles} from '@core/utils';
import {defaultStyle} from '@/constants';
import {parse} from '@core/parse';

const codes = {A: 65, Z: 90};

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 24;

function getWidth(state, index) {
  return (state[index] || DEFAULT_WIDTH) + 'px';
}
function getHeight(state, index) {
  return (state[index] || DEFAULT_HEIGHT) + 'px';
}

function toCell(state, row) {
  return function(_, col) {
    const id = `${row}:${col}`;
    const width = getWidth(state.colState, col);
    const data = state.dataState[id];
    const styles = toInlineStyles({
      ...defaultStyle,
      ...state.stylesState[id],
    });
    return `
        <div class="cell"
             contenteditable
             data-type="cell"
             data-id="${id}"
             data-col="${col}"
             data-value="${data || ''}"
             style="${styles} ; width: ${width}"
             >${parse(data) || ''}
        </div>
    `;
  };
}

function toColumn({col, index, width}) {
  return `
    <div
        class="column" 
        data-type="resizable" 
        data-col="${index}" 
        style="width: ${width}">
        ${col}
        <div class="col-resize" data-resize="col"></div>
    </div>`;
}

function createRow(index, content, state) {
  const resize = index
      ? `<div class="row-resize" data-resize="row"></div>`
      :'';
  const height = getHeight(state, index);
  return `
        <div 
            class="row" 
            data-type="resizable" 
            data-row="${index}" 
            style="height: ${height}"
            >
            <div class="row-info">
                ${index ? index :''}
                ${resize}
            </div>
            <div class="row-data">${content}</div>
        </div>
    `;
}

function toChartCode(_, index) {
  return String.fromCharCode(codes.A + index);
}
function withWidthFrom(state) {
  return function(col, index) {
    return {
      col, index, width: getWidth(state.colState, index),
    };
  };
}
export function createTable(rowsCount = 15, state = {}) {
  const colsCount = codes.Z - codes.A +1;
  const rows = [];
  const cols = new Array(colsCount)
      .fill('')
      .map(toChartCode)
      .map(withWidthFrom(state))
      .map(toColumn)
      .join('');

  rows.push(createRow(null, cols, {}));

  for (let iRow = 0; iRow < rowsCount; iRow++ ) {
    const cells = new Array(colsCount)
        .fill('')
        .map(toCell(state, iRow))
        .join('');

    rows.push(createRow(iRow+1, cells, state.rowState));
  }
  return rows.join('');
}
