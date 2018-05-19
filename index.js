import { AppRegistry } from 'react-native';
import App from './src/app';

//GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest
AppRegistry.registerComponent('rnRedux', () => App);
