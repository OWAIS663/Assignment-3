import React, { useState, useEffect } from "react";
import {
  StyleSheet,Text,View,TextInput,TouchableOpacity,Alert,ScrollView,} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Iconn from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Entypo } from '@expo/vector-icons';
import { DataTable } from "react-native-paper";

const HomeScreen = ({ navigation, route }) => {
  const [orgPr, setOrgPr] = useState(""); //original price
  const [disPercent, setDisPercent] = useState("");
  const [saveBtnDisable, setSaveBtnDisable] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(route.params !== undefined ? Object.values(route.params) : []);
  }, [route.params]);

  useEffect(() => {
    console.log("useffect");
    if (orgPr !== "") {
      setSaveBtnDisable(false);
    } else {
      setSaveBtnDisable(true);
    }
  }, [orgPr]);

  const orgPrHandler = (price) => {
    if (price >= 0) {
      setOrgPr(price);
      setSaveBtnDisable(false);
    }
  };

  const disPercentHandler = (percent) => {
    if (percent <= 100) {
      setDisPercent(percent);
    }
  };

  const yourSave = () => {
    let disAmount = orgPr * (disPercent / 100);
    return disAmount.toFixed(2);
  };
  const finalPrice = () => {
    let finalAmount = orgPr - yourSave();
    return finalAmount.toFixed(2);
  };

  const clearInputData = () => {
    setOrgPr("");
    setDisPercent("");
    setSaveBtnDisable(true);
  };

  const saveDataHandler = () => {
    if (saveBtnDisable === false) {
      const newData = {
        id: Math.random(),
        Original_Price: orgPr,
        DiscountPercentage: disPercent == "" ? 0 : disPercent,
        FinalPriceAfterDiscount: finalPrice(),
      };
      setData([...data, newData]);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.historyBtn}
          
          onPress={() => navigation.navigate("HISTORY", data)}
        >
          
          {" "} History
          
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.menu}>Original Price:</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={orgPrHandler}
          value={orgPr}
        />
        <Text style={styles.menu}>Discount Percentage %:</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={disPercentHandler}
          value={disPercent}
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.result}>
          {orgPr !== 0 && disPercent !== 0
            ? "Your Save  :Rs " + yourSave()
            : ""}
        </Text>
        <Text style={styles.result}>
          {orgPr !== 0 && disPercent !== 0
            ? "Final Price   :Rs " + finalPrice()
            : ""}
        </Text>
      </View>

      <View style={styles.calcBtn}>
        <TouchableOpacity onPress={saveDataHandler}>
          <Text
            style={
              saveBtnDisable === false ? styles.saveBtn : styles.saveBtnDisable
            }
          >
            
            {"  "} SAVE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearInputData}>
          <Text style={styles.clearBtn}>
            
            {"  "} CLEAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HistoryScreen = ({ navigation, route }) => {
  const [list, setList] = useState(route.params);

  const deleteItem = (id) => {
    let tempList = list.filter((el) => el.id != id);
    console.log(tempList);
    setList([...tempList]);
  };

  const clearList = () => {
    if (list.length > 0) {
      Alert.alert(
        [
          {
            text: "",
            style: "",
          },
          {
            text: "OK",
            onPress: () => setList([]),
          },
        ],
        { cancelable: true }
      );
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.historyBtn} onPress={clearList}>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate("DISCOUNT-CALCULATOR", list)}
        >
        <Entypo name="back" size={24} color="black" />
        
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title numeric>OrgPr</DataTable.Title>
          <DataTable.Title numeric>DisPrice</DataTable.Title>
          <DataTable.Title numeric>FinalPr </DataTable.Title>
          <DataTable.Title numeric>Remove</DataTable.Title>
        </DataTable.Header>
          <ScrollView>
            {list.map((el) => (
              <DataTable.Row key={el.id}>
                <DataTable.Cell numeric>
                  {"Rs" + el.Original_Price}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {el.DiscountPercentage + " %"}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {"Rs" + el.FinalPriceAfterDiscount}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteItem(el.id)}
                  >
                    {"  "} remove
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
         </DataTable>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DISCOUNT-CALCULATOR">
        <Stack.Screen
          name="DISCOUNT-CALCULATOR"
          component={HomeScreen}
          options={{
            headerTitleAlign: "left",
            headerStyle: { backgroundColor: "#A9A9A9" },
            headerTitleStyle: { color: "white" },
          }}
        />
        <Stack.Screen
          name="HISTORY"
          component={HistoryScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#A9A9A9" },
            headerTitleStyle: { color: "white" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#grey",
    alignItems: "center",
    margin: 8,
  },
  inputContainer: {
    marginTop: 15,
  },
  historyBtn: {
    backgroundColor: "#B0C4DE",
    fontSize:20,
    margin: 5,
    padding:1,
    borderRadius: 6,
    color:"black"
    
  },
  textInput: {
    borderRadius: 1,
    width: 100,
    height: 30,
    fontSize: 20,
    paddingLeft: 15,
    marginBottom: 5,
    backgroundColor: "white",
  },
  resultContainer: {
    marginTop: 40,
  },
  menu: {
    fontSize: 16,
    marginBottom: 8,
    color: "black",
  },
  result: {
    fontSize: 20,
    color: "black",
    margin: 2,
    textAlign: "right",
  },
  calcBtn: {
    marginTop: 20,
    flexDirection: "row",
  },
  saveBtn: {
    fontSize: 18,
    color: "white",
    backgroundColor: "#708090",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  saveBtnDisable: {
    fontSize: 18,
    color: "Black",
    backgroundColor: "#F5FFFA",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  clearBtn: {
    fontSize: 18,
    color: "white",
    backgroundColor: "#708090",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  deleteBtn: {
    margin: 10,
    padding: 10,
    borderRadius: 40,
    color: "#blue",
  },
});

export default App;