import React, { useState, useEffect } from 'react';
import { Platform, View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, Image, FlatList, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import firebase from '../../components/firebaseDb';
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject, uploadString, getMetadata } from "firebase/storage";
import useGlobalStyles from "../../components/useGlobalStyles"

const AddNoteScreen = ({ navigation, route }) => {
    const [title, setTitle] = useState(route.params?.note?.title || '');
    const [note, setNote] = useState(route.params?.note?.note || '');
    const [images, setImages] = useState(route.params?.note?.images || []);
    const [uries, setUries] = useState([]);
    const [removeImage, setRemoveImage] = useState([]);

    const globalStyles = useGlobalStyles();
    const storage = getStorage(firebase);

    const addNote = route.params?.addNote || null;
    const editNote = route.params?.editNote || null;
    const id = route.params?.note?.id;
    const counter = route.params?.counter;

    useEffect(() => {
        initializeData();
    }, [])

    /* // To see the converted uries
    useEffect(() => {
        console.log('Updated uries:', uries);
    }, [uries]); */

    async function initializeData() {
        const imagesUri = [];
        await images.map((images) => (convertRefName(images.uri, imagesUri)))
    }

    const convertRefName = async (image, imagesUri) => {
        const reference = ref(storage, image);

        await getDownloadURL(reference).then((x) => {
            imagesUri.push({ uri: x, filename: image });
            setUries([...imagesUri]);
        });
    };


    const handleChoosePhoto = async () => {
        let response = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!response.canceled) {
            console.log(response);
            const source = { uri: response.assets[0].uri };
            uploadImage(source);
        } else {
            alert('You did not select any image.');
        }
    };

    const uploadImage = async (e) => {
        try {
            const file = e.uri;
            let generatedNameFromFileUri = file.slice(-20);
            const response = await fetch(file)
            const blobFile = await response.blob()

            if (generatedNameFromFileUri.includes("/")) {
                generatedNameFromFileUri = generatedNameFromFileUri.replaceAll("/", "");
            };

            const reference = ref(storage, generatedNameFromFileUri)
            const result = await uploadBytes(reference, blobFile)
            setImages([...images, { uri: generatedNameFromFileUri }]);
            // Downloades the recent upload again so show in note
            const url = await getDownloadURL(result.ref)
            setUries([...uries, { uri: url }]);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteImage = (e) => {
        setRemoveImage([...removeImage, { uri: e.uri, isRemove: true }]);
        setImages(images.filter(images => images.uri !== e.filename));
        setUries((prevUries) => {
            const updatedUries = prevUries.filter((uri) => uri.filename !== e.filename);
            return updatedUries;
        });
    }

    const isRemove = () => {
        if (removeImage.isRemove) {
            const desertRef = ref(storage, removeImage.uri);

            // Delete the file
            deleteObject(desertRef).then(() => {
                console.log('File deleted successfully');
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const handleSave = () => {
        if (addNote) {
            if (title === "") {
                addNote("Note " + (counter + 1), note, images);
            } else {
                addNote(title, note, images);
            }
        } else if (editNote) {
            isRemove();
            editNote(id, title, note, images);
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

    const renderNote = ({ item }) => (
        <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={() => navigation.navigate('AddNote', { note: item, editNote: editNote })}>
            <View style={styles.imageContainer}>
                {item !== null ? (
                    <Image source={{ uri: item.uri }} style={styles.imageBox} />
                ) : null}
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(item)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <TouchableWithoutFeedback>
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

                <View style={{ backgroundColor: '#ddd', height: 1, marginBottom: 10 }} />

                <SafeAreaView>
                    <Button
                        mode="contained"
                        buttonColor='#32CD32'
                        onPress={handleChoosePhoto}
                        titleStyle={styles.buttonText}
                    >Pick an image</Button>
                </SafeAreaView>

                <FlatList
                    contentContainerStyle={{ flexGrow: 1 }}
                    data={uries}
                    renderItem={renderNote}
                    keyExtractor={(item, index) => index.toString()}
                />
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
        minHeight: 150
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
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    imageButton: {
        backgroundColor: '#32CD32',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    imageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageBox: {
        width: 300,
        height: 300
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center'
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
});

export default AddNoteScreen;