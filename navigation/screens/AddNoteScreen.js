import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-paper';
import useGlobalStyles from "../../components/useGlobalStyles"
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddNoteScreen = ({ navigation, route }) => {
    /* const [title, setTitle] = useState('');
    const [note, setNote] = useState(''); */
    const [title, setTitle] = useState(route.params?.note?.title || '');
    const [note, setNote] = useState(route.params?.note?.note || '');
    const globalStyles = useGlobalStyles();

    const addNote = route.params?.addNote || null;
    const editNote = route.params?.editNote || null;
    const id = route.params?.note?.id;
    const counter = route.params?.counter;

    const handleSave = () => {
        if (addNote) {
            if (title === "") {
                addNote("Note " + (counter + 1), note);
            } else {
                addNote(title, note);
            }
        } else if (editNote) {
            editNote(id, title, note);
        }
        navigation.goBack();
    };
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    mode="contained"
                    textColor='rgb(32, 138, 255)'
                    buttonColor='transparent'
                    onPress={handleSave}
                    labelStyle={styles.headerRightBtn}
                >{addNote ? "Add" : "Save"}</Button>

            ),
        });
    });
    // }, [navigation]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, globalStyles.container]}>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Title"
                    placeholderTextColor="#999"
                    style={styles.titleInput}
                    onBlur={Keyboard.dismiss}
                />
                <View style={{ backgroundColor: '#ddd', height: 1, marginBottom: 10 }} />
                <TextInput
                    value={note}
                    onChangeText={setNote}
                    placeholder="Note"
                    placeholderTextColor="#999"
                    multiline={true}
                    style={styles.noteInput}
                    onBlur={Keyboard.dismiss}
                />
                {/* <Button
                    mode="contained"
                    buttonColor='#32CD32'
                    onPress={handleSave}
                    contentStyle={{ fontSize: 20 }}
                    style={styles.buttonText}
                >{addNote ? "Add" : "Edit"} Note</Button> */}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        padding: 20,
    },
    titleInput: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#333',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    noteInput: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#333',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
        paddingTop: 5,
    },
    buttonText: {
        borderRadius: 5,
        padding: 10,
        elevation: 5,
        fontSize: 20,
    },
    headerRightBtn: {
        fontSize: 18,
        fontWeight: '330',
    }
});

export default AddNoteScreen;