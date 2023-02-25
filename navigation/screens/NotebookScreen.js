import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-paper';
import useGlobalStyles from "../../components/useGlobalStyles"
import firebase from '../../components/firebaseDb';
import { getFirestore, collection, getDocs, getDoc, addDoc, setDoc, deleteDoc, doc } from 'firebase/firestore/lite';
import FirebaseStorageImage from '../../components/FirebaseStorageImage'

const NotebookScreen = ({ navigation }) => {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    mode="contained"
                    buttonColor='transparent'
                    icon="plus-circle"
                    onPress={() => navigation.navigate('AddNote', { counter: counter, addNote: addNote })}
                    labelStyle={styles.headerRightBtn}
                ></Button>
            ),
        });
    });

    const [counter, setCounter] = useState(0);
    const [notes, setNotes] = useState([]);

    const globalStyles = useGlobalStyles();

    const db = getFirestore(firebase);

    // This is for initialize data and only triggered once for every re-render
    useEffect(() => {
        initializeData();
    }, []);

    /**
     * Read all notes from firestore
     * and insert it into the notes (setNotes useSate)
     */
    async function initializeData() {
        const notesCol = collection(db, 'notes');
        const noteSnapshot = await getDocs(notesCol);
        const noteList = noteSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setNotes([...noteList]);
    }

    const addNote = async (title, note, images) => {
        try {
            const docRef = await addDoc(collection(db, "notes"), {
                title: title,
                note: note,
                images: images
            });
            setNotes([...notes, { id: docRef.id, title, note, images }]);
            setCounter(counter + 1);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const deleteNote = async (id) => {
        setNotes(notes.filter(note => note.id !== id));
        await deleteDoc(doc(db, "notes", id)); // Deletes note (document) on firestore
    };

    const editNote = async (id, title, note, images) => {
        try {
            // Add a new document in collection "notes"
            await setDoc(doc(db, "notes", id), {
                title: title,
                note: note,
                images: images
            });
            // Updating Note array
            const newNotes = notes.map((notes) => {
                if (id === notes.id) {
                    return { ...notes, title: title, note: note, images: images };
                } else {
                    return notes;
                }
            });
            setNotes(newNotes);
        } catch (error) {
            console.error(error);
        }
    };

    const renderNote = ({ item }) => (
        <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => navigation.navigate('AddNote', { note: item, editNote: editNote })}>
            <View style={styles.note}>
                <View style={styles.noteContainer}>
                    <Text style={styles.noteTitle}>{item.title}</Text>
                    <Text style={styles.noteText} numberOfLines={3} ellipsizeMode="tail">{item.note}</Text>
                    <FirebaseStorageImage item={item} />
                </View>
                <TouchableOpacity style={styles.noteContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNote(item.id)}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: '#ddd', height: 1, marginBottom: 10 }} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, globalStyles.container]}>
            <FlatList
                data={notes}
                renderItem={renderNote}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        padding: 20,
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
    noteTitle: {
        color: '#333',
        fontSize: 20,
        fontWeight: 'bold',
    },
    noteText: {
        color: '#333',
        fontSize: 16,
        marginTop: 10,
        maxWidth: 180
    },
    deleteButton: {
        backgroundColor: '#f00',
        padding: 10,
        borderRadius: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    headerRightBtn: {
        fontSize: 25
    }
});

export default NotebookScreen;
