import * as React from 'react';
import { StyleSheet, Text, View, Image, Linking } from 'react-native';
import { Button } from 'react-native-paper';

const BusinessCardScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../../media/image/razerLogo.png')}
                style={styles.cardImage} />
            <Text style={styles.textStyle}>FOR GAMERS. BY GAMERS!</Text>
            <Button
                icon="share"
                mode="contained"
                buttonColor='#32CD32'
                onPress={() => Linking.openURL('https://www.razer.com/').catch(err => console.error('An error ocurred', err))}
            >Click to open our website!</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleStyle: {
        fontSize: 26, fontWeight: 'bold'
    },
    cardImage: {
        //marginTop: 80,
        width: 250,
        height: 250,
        borderWidth: 2,
        borderRadius: 125,
        borderColor: 'rgb(0, 255, 0)',
        resizeMode: 'center',
    },
    textStyle: {
        fontSize: 25,
        color: 'rgb(0, 255, 0)',
        margin: 20
    },
});

export default BusinessCardScreen