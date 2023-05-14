import React, { useState } from 'react';
import { Platform, View, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, SafeAreaView, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../components/firebaseDb';
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject, uploadString, getMetadata } from "firebase/storage";
import uuid from 'react-native-uuid';
import useGlobalStyles from "../../components/useGlobalStyles"
import FirebaseStorageImages from '../../components/FirebaseStorageImages';

const AddNoteScreen = ({ navigation, route }) => {
    const [title, setTitle] = useState(route.params?.note?.title || '');
    const [note, setNote] = useState(route.params?.note?.note || '');
    // const [marker, setMarker] = useState(route.params?.note?.marker || {});
    const [images, setImages] = useState(route.params?.note?.images || []);
    const [removeImage, setRemoveImage] = useState([]);

    const globalStyles = useGlobalStyles();

    const addNote = route.params?.addNote || null;
    const editNote = route.params?.editNote || null;
    const id = route.params?.note?.id;
    const counter = route.params?.counter;

    /* // To see the converted uries
    useEffect(() => {
        console.log('Updated uries:', uries);
    }, [uries]); */

    const getCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
        } else {
            takePhoto();
        }
    }

    const takePhoto = async () => {
        const { assets } = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!assets[0].uri) {
            return;
        }
        // Do something with the photo URI here
        const source = { uri: assets[0].uri };
        uploadImage(source);
    }

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
            let generatedNameWithUUID = uuid.v4();
            const response = await fetch(file);
            const blobFile = await response.blob();

            const reference = ref(storage, generatedNameWithUUID);
            await uploadBytes(reference, blobFile);
            setImages([...images, { uri: generatedNameWithUUID }]);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteImage = (e) => {
        setRemoveImage([...removeImage, { uri: e.uri, isRemove: true }]);
        setImages(images.filter(images => images.uri !== e.filename));
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
                addNote("Note " + (counter + 1), note, images, { latitude: route.params.latitude, longitude: route.params.longitude });
            } else {
                addNote(title, note, images, { latitude: route.params.latitude, longitude: route.params.longitude });
            }
        } else if (editNote) {
            isRemove();
            editNote(id, title, note, images, { latitude: route.params.latitude, longitude: route.params.longitude });
        }
        navigation.goBack();
    };

    const mapView = "Maps"
    const goToMap = () => {
        navigation.navigate(mapView, { note: route.params.marker, amount: 1 })
        // navigation.navigate(mapView, { note: route.params.marker, amount: 1, updateState: (newMarker) => setMarker(newMarker) })
    }

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

    return (
        <ScrollView>
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

                    <SafeAreaView style={styles.buttonRow}>
                        <Button
                            mode="contained"
                            buttonColor='#32CD32'
                            onPress={handleChoosePhoto}
                            titleStyle={styles.buttonText}
                            style={styles.buttonStyle}
                        >
                            <View>
                                <Text numberOfLines={2} style={{ textAlign: 'center', color: "white" }}>
                                    Pick an
                                    image
                                </Text>
                            </View>
                        </Button>
                        <Button
                            mode="contained"
                            buttonColor='#32CD32'
                            titleStyle={styles.buttonText}
                            style={styles.buttonStyle}
                            onPress={goToMap}
                        >Location</Button>
                        <Button
                            mode="contained"
                            buttonColor='#32CD32'
                            onPress={getCameraPermission}
                            titleStyle={styles.buttonText}
                            style={styles.buttonStyle}
                        >
                            <View>
                                <Text numberOfLines={2} style={{ textAlign: 'center', color: "white" }}>
                                    Take a
                                    photo
                                </Text>
                            </View>
                        </Button>
                    </SafeAreaView>

                    <FirebaseStorageImages item={images} amount={"all"} deleteImage={deleteImage} />
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonText: {
        borderRadius: 5,
        padding: 10,
        elevation: 5,
        fontSize: 20,
    },
    buttonStyle: {
        width: 110,
        height: 55,
        justifyContent: 'center'
    },
    headerRightBtn: {
        fontSize: 18,
        fontWeight: 'normal',
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