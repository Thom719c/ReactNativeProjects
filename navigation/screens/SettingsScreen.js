/*import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text onPress={() => navigation.navigation('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Settings Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});*/
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Divider, Subheading, Switch as RNSwitch } from 'react-native-paper';

const SettingsScreen = ({ navigation }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <View style={isDarkMode ? darkStyles.container : lightStyles.container}>
            <Subheading style={isDarkMode ? darkStyles.subhead : lightStyles.subhead}>Notifications</Subheading>
            <Divider />
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>Enable notifications</Text>
                <RNSwitch
                    value={notificationsEnabled}
                    style={styles.switch}
                    onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
            </View>
            <Subheading style={isDarkMode ? darkStyles.subhead : lightStyles.subhead}>Appearance </Subheading>
            <Divider />
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>Dark Mode</Text>
                <RNSwitch
                    value={isDarkMode}
                    style={styles.switch}
                    onValueChange={() => setIsDarkMode(!isDarkMode)}
                />
            </View>
        </View>
    );
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        color: '#000'
    },
    text: {
        color: '#000'
    },
    subhead: {
        marginTop: 20,
        color: '#000'
    }
});

const darkStyles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#000',
    },
    text: {
        color: '#fff'
    },
    subhead: {
        marginTop: 20,
        color: '#fff'
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    switch: {
        marginLeft: 'auto'
    }
});

export default SettingsScreen;
