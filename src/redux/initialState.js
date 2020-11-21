import {defaultStyle, defaultTitle} from '@/constants';
import {clone} from '@core/utils';

const defaultState = {
  rowState: {},
  colState: {},
  dataState: {},
  stylesState: {},
  currentText: '',
  currentStyles: defaultStyle,
  title: defaultTitle,
  openedDate: new Date().toJSON(),
};

const normalize = (state) => ({
  ...state,
  currentStyles: defaultStyle,
  currentText: '',
});

export function normalizeInitialState(state) {
  return state ? normalize(state) : clone(defaultState);
}
