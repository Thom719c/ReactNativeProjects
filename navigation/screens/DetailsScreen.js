import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function DetailsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text onPress={() => navigation.navigation('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Details Screen</Text>
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
});