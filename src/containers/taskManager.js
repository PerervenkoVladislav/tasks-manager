var React = require('react');
var ReactNative = require('react-native');
var {
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  AsyncStorage,
} = ReactNative;
var NavButton = require('../components/navButton');
var ListTasks = require('../components/listTasks');
var Detail = require('../components/crud/detail');
var Create = require('../components/crud/create');

var TaskManager = React.createClass({

  getInitialState() {
    return {
      activeTasks: false,
      filter: 'all',
    }
  },

  changeState(field, value) {
    var newState = {}
    newState[field] = value;
    this.setState(newState);
  },

  renderScene: function(route, nav) {
    if (route.crud) {
      switch (route.crud) {
        case 'Create':
          return <Create
            // changeState={this.changeState}
            name={route.crud}
            navigator={nav}
            />
          break;
        case 'Edit':
          return <Create
            // changeState={this.changeState}
            name={route.crud}
            dataTask={route.task}
            navigator={nav}
            />
          break;
        default:
          console.warn('<(O_o)');
      }
    };
    if (route.uid) {
      return <Detail
          // changeState={this.changeState}
          uid={route.uid}
          navigator={nav}
        />;
    } else {
      return (
        <ListTasks
          activeTasks={this.state.activeTasks}
          filter={this.state.filter}
          changeState={this.changeState}
          message={route.message}
          navigator={nav}
          // onExampleExit={this.props.onExampleExit}
        />
      );
    }
  },

  render: function() {

    return (
      <Navigator
        style={styles.container}
        initialRoute={{ message: 'First Scene', }}
        renderScene={this.renderScene}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromBottom;
        }}
      />
    );
  },
});

var styles = StyleSheet.create({
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  container: {
    flex: 1,
  },
  scene: {
    flex: 1,
  }
});

module.exports = TaskManager;
