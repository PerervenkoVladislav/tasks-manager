var React = require('react');
var ReactNative = require('react-native');

var {
  TouchableHighlight,
  StyleSheet,
  Text,
} = ReactNative

class NavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={[styles.button, {backgroundColor: (this.props.color ? this.props.color: 'white')}]}
        underlayColor="#B5B5B5"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}


var styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
});

module.exports = NavButton;
