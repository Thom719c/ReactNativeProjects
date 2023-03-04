import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, Subheading, Switch as RNSwitch, Button } from 'react-native-paper';

const MenuScreen = ({ navigation, route }) => {
    const logout = route.params?.logout;

    return (
        <View>
            <Text>Menu</Text>
            <Divider />
            <TouchableOpacity style={styles.pageButton} onPress={() => navigation.navigate('Settings', { logout })}>
                <Text style={styles.title}>Settings</Text>

            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        padding: 20,
    },
    pageButton: {
        paddingHorizontal: 10,
        marginTop: 10,
        borderWidth: 2,
        borderColor: "thistle",
        borderRadius: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        maxWidth: '50%',
        minWidth: '25%',
        height: 60,
    },
    noteContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        borderRadius: 5,
    },
    note: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        justifyContent: 'space-between',
        borderRadius: 15,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    noteText: {
        color: '#333',
        fontSize: 16,
        marginTop: 10,
        maxWidth: 180
    },
    headerRightBtn: {
        fontSize: 25
    }
});

export default MenuScreen