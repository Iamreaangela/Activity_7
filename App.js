import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Button, Dimensions, StyleSheet, TextInput, View } from 'react-native';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { v4 as uuidv4 } from 'uuid';
import StudentList from './StudentList';

const sHeight = Dimensions.get('window').height;

function HomeScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [course, setCourse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const addStudent = async () => {
    const newStudent = {
      ID: uuidv4(),
      firstName,
      lastName,
      course,
      username,
      password,
    };

    try {
      if (firstName !== '' && lastName !== '' && course !== '' && username !== '' && password !== '')
        {
        const existingStudents = JSON.parse(await AsyncStorage.getItem('students')) || [];
        const updatedStudents = [...existingStudents, newStudent];
        await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));
  
        toast.show("Student Added Successfully", {
          type: "success",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
        setFirstName('');
        setLastName('');
        setCourse('');
        setUsername('');
        setPassword('');
      }
      else{
        toast.show("Every field needs a value.", {
          type: "warning",
          placement: "bottom",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <Picker
        selectedValue={course}
        style={styles.input}
        mode={'dropdown'}
        onValueChange={(itemValue) => setCourse(itemValue)}>
        <Picker.Item label="Select Course" />
        <Picker.Item label="BSIT" value="BSIT" />
        <Picker.Item label="BSCS" value="BSCS" />
        <Picker.Item label="BSHM" value="BSHM" />
        <Picker.Item label="BSCRIM" value="BSCRIM" />
        </Picker>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={{marginBottom:30}}>
        <Button title="Add Student" onPress={addStudent} />
      </View>
      <View style={{marginBottom:30}}>
        <Button title="View" onPress={() => navigation.navigate('Student List')} />
      </View>
    </View>
  );
}
function StudentLists({ navigation }) {
  return (
    <View styles={{backgroundColor:'white'}}>
      <StudentList />
      <Button title="Add Student" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function AddStudentPage() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Student List" component={StudentLists} />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <View style={{ flex: 1, padding: 20, }}>
      <ToastProvider>
        <NavigationContainer>
          <AddStudentPage />
        </NavigationContainer>
      </ToastProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: sHeight,
    backgroundColor:'white',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default App;