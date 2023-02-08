import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button } from 'react-native-paper';

import useGlobalStyles from "../../components/useGlobalStyles"

export default function HomeScreen({ navigation }) {
    
    const globalStyles = useGlobalStyles();
    
    return (
        <View style={[globalStyles.container, styles.container]}>
            <Image source={require('../../media/image/minilogo.png')}
                style={styles.cardImage} />
            <Text style={[globalStyles.textStyle, styles.textStyle]}>Welcome to my App!</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 20,
    }
});