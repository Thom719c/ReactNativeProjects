/* OLD was for showing one image on the notelist → new component is FirebaseStorageImages.js */
import React, { useState, useEffect, useRef } from 'react';
import { View, Image } from 'react-native';
import { storage } from './firebaseDb';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const FirebaseStorageImage = ({ item }) => {
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