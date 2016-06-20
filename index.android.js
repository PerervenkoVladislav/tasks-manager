'use strict';

var ReactNative = require('react-native');
var {
  AppRegistry
} = ReactNative;
var TaskManager = require('./src/containers/taskManager');


var React = require('react');
TaskManager.external = true;
AppRegistry.registerComponent('taskManager', () => TaskManager)
