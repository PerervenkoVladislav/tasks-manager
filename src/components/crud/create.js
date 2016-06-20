var React = require('react');
var ReactNative = require('react-native');
var Moment = require('moment');
var {
  TouchableWithoutFeedback,
  TouchableHighlight,
  DatePickerAndroid,
  TouchableOpacity,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  TextInput,
  Navigator,
  Picker,
  Switch,
  Text,
} = ReactNative;
const Item = Picker.Item;

var NavButton = require('../navButton');
var Toolbar = require('../toolbar');

var Create = React.createClass({

  getInitialState: function () {
    var date = Moment();
    return {
      nameTask: '',
      descriptionTask: '',
      simpleText: Moment().format("MM/DD/YY"),
      buttonSave: true,
      presetDate: new Date(date.year(), date.month(), date.date()),
      priority: 'low',
      falseSwitchIsOn: false,
      err: {
        name: '',
        description: '',
        date: '',
        priority: '',
      }
    }
  },

  componentWillMount() {
    if (this.props.name === 'Edit') {
      var task = this.props.dataTask;
      var date = task.dataTask.dedline ? Moment(task.dataTask.dedline) : Moment()
      this.setState({
        nameTask: task.dataTask.name,
        descriptionTask: task.dataTask.description,
        falseSwitchIsOn: task.dataTask.dedline ? true : false,
        simpleText: task.dataTask.dedline ? Moment(task.dataTask.dedline).format('MM/DD/YY') : this.state.simpleText,
        presetDate: new Date(date.year(), date.month(), date.date()),
        priority: task.dataTask.priority,
      })
    }
  },

  async showPicker(stateKey, options) {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        // newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey + 'Date'] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  },

  createTask() {
    if (this.checkForm()){
      var data = {
        name: this.state.nameTask,
        description: this.state.descriptionTask,
        dedline: this.state.falseSwitchIsOn ? this.state.simpleText : false,
        priority: this.state.priority,
        closedDate: false,
      };
      if (this.props.name === 'Create'){
        AsyncStorage.setItem(this.generateUID(), JSON.stringify(data));
        return this.props.navigator.push({
          sceneConfig: Navigator.SceneConfigs.FloatFromRight,
        });
      } else if (this.props.name === 'Edit') {
        AsyncStorage.setItem(this.props.dataTask.uid, JSON.stringify(data));
        return this.props.navigator.push({
          uid: this.props.dataTask.uid,
          sceneConfig: Navigator.SceneConfigs.FloatFromRight,
        });
      }
    }
  },

  fieldError(field, message) {
    var newState = this.state.err;
    newState[field] = message;
    this.setState({
      err: newState,
    })
  },

  checkForm() {
    var validate = true;
    if (!this.state.nameTask){
      this.fieldError('name', 'Field name not be empty');
      validate = false;
    } else {
      this.fieldError('name', '');
    }
    if (!this.state.descriptionTask){
      this.fieldError('description', 'Field description not be empty');
      validate = false;
    } else {
      this.fieldError('description', '');
    }
    if (this.state.falseSwitchIsOn){
      if (!this.state.simpleText){
        this.fieldError('date', 'Invalid date');
        validate = false;
      } else {
        try {
          if (Moment() > Moment(this.state.simpleText).add(23, 'hour').add(59, 'minutes')) {
            this.fieldError('date', 'Invalid date');
            validate = false;
          }
        } catch (err) {
          this.fieldError('date', 'Invalid date');
          validate = false;
        }

      }
    } else {
      this.fieldError('date', '');
    }
    if (!this.state.priority){
      this.fieldError('priority', 'Invalid priority');
      validate = false
    }
    if (validate){
      return true;
    }
    return false;
  },

  generateUID() {
    var token;

    token = Math.random().toString(36).substr(2);

    return 'UID' + token;
  },

  render: function() {

    return (
      <ScrollView style={styles.scene}>
        <Toolbar
          title={this.props.name + ' task'}
        />
        <Text>Name:</Text>
        <TextInput
          ref="name"
          placeholder="Name"
          value={this.state.nameTask}
          onChange={(event) => {
            this.setState({nameTask: event.nativeEvent.text})
          }}
        />
        <Text style={styles.textError}>{this.state.err.name}</Text>
        <Text>Descripton:</Text>
        <TextInput
          ref="description"
          placeholder="Description"
          value={this.state.descriptionTask}
          onChange={(event) => {
            this.setState({descriptionTask: event.nativeEvent.text})
          }}
        />
        <Text style={styles.textError}>{this.state.err.description}</Text>
        <Text>Priority:</Text>
        <Picker
          style={styles.picker}
          selectedValue={this.state.priority}
          onValueChange={this.onValueChange.bind(this, 'priority')}
          mode="dialog">
          <Item label="Normal" value="low" />
          <Item label="Important" value="middle" />
          <Item label="Very important" value="up" />
        </Picker>
        <Text style={styles.textError}>{this.state.err.priority}</Text>
        <Text>Dedline:</Text>
        <Switch
          onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
          style={{marginBottom: 10}}
          value={this.state.falseSwitchIsOn} />
        { this.state.falseSwitchIsOn ?
        <TouchableWithoutFeedback
          style={[styles.datePicker]}
          underlayColor="#B5B5B5"
          onPress={this.showPicker.bind(this, 'simple', {date: this.state.presetDate})}>
          <Text style={styles.text}>{this.state.simpleText}</Text>
        </TouchableWithoutFeedback>
        : null
        }
        <Text style={styles.textError}>{this.state.err.date}</Text>
        { this.state.buttonSave ?
            <NavButton
              onPress={() => { this.createTask() }}
              text="Save"
            />
          : null
        }
        <NavButton
          onPress={() => { this.props.navigator.pop(); }}
          text="Cancel"
        />
      </ScrollView>
    );
  },

  onValueChange: function(key: string, value: string) {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  },
});

var styles = StyleSheet.create({
  datePicker: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  textError: {
    color: 'red',
  },
  text: {
    color: 'black',
  },
  picker: {
    width: 100,
  },
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

module.exports = Create;
