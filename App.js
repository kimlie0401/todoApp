import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TextInput,
  Platform,
  ScrollView,
  AsyncStorage
} from "react-native";
import Todo from "./Todo";
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadToDos: false,
    toDos: {}
  };

  componentDidMount = () => {
    this._loadToDos();
  };

  render() {
    const { newToDo, loadToDos, toDos } = this.state;
    if (!loadToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>DK's Todo App</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="New to do"
            value={newToDo}
            onChangeText={this._controlNewTodo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={true}
            onSubmitEditing={this._addToDo}
          ></TextInput>
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              .reverse()
              .map(toDo => (
                <Todo
                  key={toDo.id}
                  {...toDo}
                  deleteToDo={this._deleteToDo}
                  completeToDo={this._completeToDo}
                  uncompleteToDo={this._uncompleteToDo}
                  updateToDo={this._updateToDo}
                />
              ))}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewTodo = text => {
    this.setState({
      newToDo: text
    });
  };

  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      if (toDos !== null) {
        const parsedToDos = JSON.parse(toDos);
        this.setState({
          loadToDos: true,
          toDos: parsedToDos
        });
      } else {
        this.setState({
          loadToDos: true,
          toDos: {}
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  _addToDo = () => {
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAT: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };
  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _saveToDos = newTodos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newTodos));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontSize: 36,
    marginTop: 60,
    marginBottom: 20,
    fontWeight: "800"
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 8,
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowOffset: {
          height: 4,
          width: 0
        }
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  }
});
