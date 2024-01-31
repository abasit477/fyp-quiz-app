import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  primary: '#5362FB',
  secondary: '#000020',

  success: '#5362FB',
  error: '#5362FB',

  black: '#171717',
  white: '#FFFFFF',
  background: '#ffffff',
  border: '#F5F5F7',
};

export const SIZES = {
  base: 10,
  width,
  height,
};