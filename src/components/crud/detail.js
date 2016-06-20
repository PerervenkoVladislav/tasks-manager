var React = require('react');
var ReactNative = require('react-native');
var Moment = require('moment');
var {
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Navigator,
  Switch,
  Alert,
  Text,
  View,
} = ReactNative;

var NavButton = require('../navButton');
var Toolbar = require('../toolbar');

var Detail = React.createClass({

  getInitialState: function () {
    return {
      closeTaskButton: true,
      editTaskButton: 'Edit',
      dataTask: false,
      deleteModalShow: false,
    }
  },

  componentWillMount: function() {
    AsyncStorage.getItem(this.props.uid, (err, result) => {
      result = JSON.parse(result);
      if (result.closedDate){
        this.setState({
          closeTaskButton: false,
          editTaskButton: null,
        })
      }
      this.setState({dataTask: result});
    });
  },

  deletedTask() {
    Alert.alert(
      'Deleted task',
      'Task ' + this.state.dataTask.name + ' will be removed',
      [
        {text: 'Cancel', onPress: () =>{}},
        {text: 'Delete', onPress: () => {
          AsyncStorage.removeItem(this.props.uid);
            return this.props.navigator.push({
              sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            });
          },
        }
      ]
    );
  },

  componentDidUpdate() {
  },

  closeTask() {
    AsyncStorage.getItem(this.props.uid, (err, result) => {
      if (!err){
        result = JSON.parse(result);
        result['closedDate'] = Moment().format('MM/DD/YY')
        AsyncStorage.setItem(this.props.uid, JSON.stringify(result));
      } else {
        console.warn(err.message);
      }
    });
  },

  _renderScene: function(route, navigator) {
    return (
      <ScrollView style={styles.scene}>
        <Toolbar
          delete={this.deletedTask}
        />
        {this.state.editTaskButton ?
          <NavButton
            onPress={() => {
              return this.props.navigator.push({
                task: {
                  uid: this.props.uid,
                  dataTask: this.state.dataTask
                },
                crud: 'Edit',
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
              });
            }}
            text="Edit"
          /> : null
        }
        <Text>Name task: {this.state.dataTask.name}</Text>
        <Text>Description task: {this.state.dataTask.description}</Text>
        <Text>Priority: {this.state.dataTask.priority}</Text>
        <Text>Dedline: {
          this.state.dataTask.dedline ?
            Moment(this.state.dataTask.dedline).format('YYYY-MM-DD')
            : 'No date'
          } {this.state.dataTask.closedDate ?
            ' (Data closed: ' + Moment(this.state.dataTask.closedDate).format('YYYY-MM-DD') + ')'
            : null
          }</Text>
        { this.state.closeTaskButton ?
          <NavButton
            onPress={() => {
              this.closeTask();
              this.setState({
                closeTaskButton: false,
                editTaskButton: null,
              });
            }}
            text='Closed task'
          /> : null
        }
        <NavButton
          onPress={() => {
            return this.props.navigator.push({
              sceneConfig: Navigator.SceneConfigs.FloatFromLeft,
            });
          }}
          text="Back to list tasks"
        />
      </ScrollView>
    );
  },

  render: function() {
    return (
      <Navigator
        style={styles.container}
        renderScene={this._renderScene}
      />
    );
  },

});

var styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  container: {
    overflow: 'hidden',
    backgroundColor: '#dddddd',
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 32,
  },
  crumbIconPlaceholder: {
    flex: 1,
    backgroundColor: '#666666',
  },
  crumbSeparatorPlaceholder: {
    flex: 1,
    backgroundColor: '#aaaaaa',
  },
});

module.exports = Detail;
