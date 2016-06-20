var React = require('react');
var ReactNative = require('react-native');
var SwitchAndroid = require('SwitchAndroid');
var {
  ToolbarAndroid,
  Navigator,
  StyleSheet,
  Text,
  View
} = ReactNative;

var Toolbar = React.createClass({

  toolbarActions: [],

  getInitialState: function() {
     return {
        actionText: '',
        actionTitle: '',
        toolbarSwitch: false,
     };
  },

  componentWillMount: function() {
    this.setState({
      toolbarSwitch: this.props.activeSwith,
    })
    this.toolbarActions = [];
    // console.warn(this.props.method);
    if (this.props.method){
      this.toolbarActions.push({
        title: this.props.method, icon: require('../static/add.png'), show: 'always'}
      )
    };
    if (this.props.delete){
      this.toolbarActions.push({
        title: 'Delete', icon: require('../static/delete.png'), show: 'always'}
      )
    };
    if (this.props.filterTasks) {
      this.toolbarActions.push(
        {title: 'Normal', type: 'filter'},
        {title: 'Important', type: 'filter'},
        {title: 'Very important', type: 'filter'},
        {title: 'Cancel the filter', type: 'filter'}
      )
    };
    this.setState({actionTitle: (this.props.title ? this.props.title : 'Tasks')})
  },

  render: function () {
    return (
        <ToolbarAndroid
          actions={this.toolbarActions}
          onActionSelected={this._onActionSelected}
          onIconClicked={() => this.setState({actionText: 'Icon clicked'})}
          style={styles.toolbar}
          // subtitle={this.state.actionText}
          title={this.state.actionTitle}>
          {this.props.filterTasks ?
          <View style={{height: 56, flexDirection: 'row', alignItems: 'center'}}>
            <SwitchAndroid
              value={this.state.toolbarSwitch}
              onValueChange={(value) => {
                  this.setState({'toolbarSwitch': value});
                  this.props.activeTasks(value);
                }
              } />
            <Text>{'Show only active'}</Text>
          </View> : null }
        </ToolbarAndroid>
    )
  },

  _onActionSelected: function(position) {
      switch (this.toolbarActions[position].title) {
        case 'Normal':
          this.props.filterTasks('low');
          break;
        case 'Important':
          this.props.filterTasks('middle');
          break;
        case 'Very important':
          this.props.filterTasks('up');
          break;
        case 'Create':
          this.props.click('Create');
          break;
        case 'Delete':
          this.props.delete();
          break;
        default:
          this.props.filterTasks('all')
      }
  },
});

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#e9eaed',
    height: 56,
  },
});

module.exports = Toolbar;
