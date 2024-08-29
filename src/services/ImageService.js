import storage from '@react-native-firebase/storage';

export const uploadImage = async (imageUri) => {
    try {
        const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        const reference = storage().ref(fileName);

        // Upload the image
        await reference.putFile(imageUri);
        console.log('Image uploaded successfully!');

        //  download URL
        const url = await reference.getDownloadURL();
        console.log('Image URL:', url);
        return url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
