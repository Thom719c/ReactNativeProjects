import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import MainContainer from './navigation/MainContainer';

const App = () => {
  return (
    /*<View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button icon="share" 
        mode="contained"
        buttonColor='green'
        onPress={() => console.log('Pressed')}>
        Press me
      </Button>
      <StatusBar style="auto" />
    </View>*/
    <MainContainer />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App
