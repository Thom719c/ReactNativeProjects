import React, { useState, useEffect, useRef } from 'react';
import { View, Image } from 'react-native';
import firebase from './firebaseDb';
import { getStorage, ref, getDownloadURL } from "firebase/storage";


const FirebaseStorageImage = ({ item }) => {
    const storage = getStorage(firebase);
    const [image, setImage] = useState('');

    useEffect(() => {
        getImage();
    });

    const getImage = async () => {
        if (item.images[0] !== undefined) {
            const reference = ref(storage, item.images[0].uri);
            const url = await getDownloadURL(reference);
            setImage(url);
        };
    };

    return (
        <View>
            {image !== undefined ? (
                <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />
            ) : null}
        </View>
    )
}

export default FirebaseStorageImage
