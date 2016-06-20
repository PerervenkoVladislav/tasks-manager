var React = require('react');
var ReactNative = require('react-native');
var Moment = require('moment');
var {
  AsyncStorage,
  Navigator,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity
} = ReactNative;

var NavButton = require('./navButton');
var Toolbar = require('./toolbar');

var ListTasks =  React.createClass ({

  getInitialState: function () {
    return {
      tasksArray: [],
      activeTasks: false,
      filter: 'all',
    }
  },

  componentWillMount: function () {
    this.setState({
      activeTasks: this.props.activeTasks,
      filter: this.props.filter
    })
    this.filter(this.props.filter);
  },

  activeTasks(active){
    this.props.changeState('activeTasks', active);
    this.setState({
      activeTasks: active,
    })
    this.filter(this.state.filter);
  },

  filter: function (priority) {
    this.props.changeState('filter', priority);
    this.setState({filter: priority});
    var tasksArray = [];
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
       stores.map((result, i, store) => {
         var uid = result[0];
        //  console.warn(uid);
         var dataTask = JSON.parse(result[1])
         var request = priority === 'all' || dataTask.priority == priority.toLowerCase();
        //  var active = this.state.activeTasks && !dataTask.closedDate;
         if (request) {
           if (this.state.activeTasks){
             request = request && (!dataTask.closedDate ? true : false)
           }
         }
         if (request) {
          //  console.warn(Moment(dataTask.dedline).add(23, 'hour').add(59, 'minutes'));
           var color = Moment(dataTask.dedline).add(23, 'hour').add(59, 'minutes') < Moment() ? '#e9967a' : ''
           tasksArray.push({
             id: uid,
             name: dataTask.name,
             closed: dataTask.closedDate ? true : false,
             color: color,
           });
         }
        });
        this.setState({tasksArray: tasksArray});
      });
    });
  },

  click: function (method) {
    return this.props.navigator.push({
      crud: method,
      sceneConfig: Navigator.SceneConfigs.FloatFromRight,
    });
  },

  render: function () {
    return (
      <ScrollView style={styles.scene}>
        <Toolbar
          method={'Create'}
          activeSwith={this.state.activeTasks}
          filterTasks={this.filter}
          click={this.click}
          activeTasks={this.activeTasks}
          filter={this.state.filter}
        />
        {this.state.tasksArray.length > 0 ? this.state.tasksArray.map((dataTask) => {
          return (
            <NavButton
              onPress={() => {
                this.props.navigator.push({
                  uid: dataTask.id,
                  sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                });
              }}
              color={dataTask.color}
              text={dataTask.name + (dataTask.closed ? ' (Closed)' : '')}
            />
          )
        })
        : <Text> Data is not found </Text>
      }
      </ScrollView>
    );
  },
});

var styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

module.exports = ListTasks;
