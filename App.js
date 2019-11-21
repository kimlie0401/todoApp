import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TextInput,
  Platform
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>DK's Todo App</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="New to do"></TextInput>
      </View>
    </View>
  );
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
  input: {}
});
