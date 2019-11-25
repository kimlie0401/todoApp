import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TextInput,
  Platform,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Swipeout from "react-native-swipeout";
import PropTypes from "prop-types";

const { height, width } = Dimensions.get("window");

export default class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      todoValue: props.text
    };
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
  };

  swipeoutBtns = [
    {
      backgroundColor: "",
      color: "white",
      text: "Edit",
      onPress: () => {
        this.setState({
          isEditing: true
        });
      }
    },
    {
      backgroundColor: "red",
      color: "white",
      text: "Delete",
      onPress: () => alert("Delte")
    }
  ];
  render() {
    const { isCompleted, isEditing, todoValue } = this.state;
    const { text, id, deleteToDo } = this.props;
    return (
      <Swipeout
        right={this.swipeoutBtns}
        backgroundColor="white"
        disabled={isEditing ? true : false}
        autoClose={true}
      >
        <View style={styles.container}>
          <View style={styles.column}>
            <TouchableOpacity onPress={this._toggleComplete}>
              <View
                style={[
                  styles.circle,
                  isCompleted
                    ? styles.completedCircle
                    : styles.uncompletedCircle
                ]}
              />
            </TouchableOpacity>
            {isEditing ? (
              <TextInput
                style={[
                  styles.text,
                  styles.input,
                  isCompleted ? styles.completedText : styles.uncompletedText
                ]}
                value={todoValue}
                multiline={true}
                onChangeText={this._controlInput}
                returnKeyType={"done"}
                onBlur={this._finishEditing}
              />
            ) : (
              <Text
                style={[
                  styles.text,
                  isCompleted ? styles.completedText : styles.uncompletedText
                ]}
              >
                {text}
              </Text>
            )}
          </View>

          {isEditing ? (
            <View style={styles.action}>
              <TouchableOpacity onPressOut={this._finishEditing}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>✅</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.action}>
              <TouchableOpacity onPressOut={this._startEditing}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>✏️</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPressOut={() => deleteToDo(id)}>
                <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>❌</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Swipeout>
    );
  }
  _toggleComplete = () => {
    this.setState(prevState => {
      return {
        isCompleted: !prevState.isCompleted
      };
    });
  };
  _startEditing = () => {
    this.setState({
      isEditing: true
    });
  };
  _finishEditing = () => {
    this.setState({
      isEditing: false
    });
  };
  _controlInput = text => {
    this.setState({
      todoValue: text
    });
  };
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  uncompletedCircle: {
    borderColor: "#F23657"
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353839"
  },
  text: {
    marginVertical: 20,
    fontSize: 20,
    fontWeight: "600"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2
  },
  action: {
    flexDirection: "row"
  },
  actionContainer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    marginVertical: 15,
    width: width / 2,
    paddingBottom: 5
  }
});
