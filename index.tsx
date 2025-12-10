import { AppRegistry } from 'react-native';
import App from './App';

const rootTag = document.getElementById('root');

if (rootTag) {
  AppRegistry.registerComponent('App', () => App);
  AppRegistry.runApplication('App', {
    rootTag,
  });
}
