import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { storage } from './firebaseDb';
import { ref, getDownloadURL } from "firebase/storage";

const FirebaseStorageImages = ({ item, amount, deleteImage }) => {
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]);

    useEffect(() => {
        getImages();
    }, [item, amount]);

    const getImages = async () => {
        if (amount === 1 && item.images[0] !== undefined) {
            const reference = ref(storage, item.images[0].uri);
            const url = await getDownloadURL(reference);
            setImage(url);
        } else if (amount === "all") {
            setImages([]); // clear the images state before adding new images
            item.map(async (item) => {
                const reference = ref(storage, item.uri);
                const url = await getDownloadURL(reference);
                setImages(prevImages => [...prevImages, { uri: url, filename: item.uri }]);
            })
        }
    }

    const renderNote = ({ item }) => (
        <TouchableWithoutFeedback>
            <View style={styles.imageContainer}>
                {item !== null ? (
                    <Image source={{ uri: item.uri }} style={styles.imageBox} />
                ) : null}
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(item)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <View style={styles.container}>
            {image ? (
                <Image source={{ uri: image }} style={styles.smallImageBox} />
            ) : (
                <FlatList
                    contentContainerStyle={{ flexGrow: 1 }}
                    data={images}
                    renderItem={renderNote}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    imageBox: {
        width: 300,
        height: 300,
        borderWidth: 5,
        borderColor: "green",
    },
    smallImageBox: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 10
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 5,
        borderColor: "green",
        width: 300,
        height: 360,
    },
    deleteButton: {
        backgroundColor: '#f00',
        padding: 10,
        borderRadius: 10,
        margin: 5
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default FirebaseStorageImages