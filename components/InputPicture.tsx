import { useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import { View, Button, Text, Image, StyleSheet } from "react-native";
const InputPicture = ({ label, onChange }: {
    label: string,
    onChange: (uri: string) => void
}) => {
    const [foto, setFoto] = useState<string | null>(null);

    const handleImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
            onChange(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.documentUploader}>
            <Text style={styles.label}>{label}</Text>
            {foto && <Image source={{ uri: foto }} style={styles.image} />}
            <Button title="Escolher Foto" onPress={handleImagePicker} color={'#44EAC3'} />
        </View>
    );
};

const styles = StyleSheet.create({
    documentUploader: {
        marginBottom: 20,
    },
    label: {
        color: '#44EAC3',
        marginBottom: 5,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 15,
    },
});

export default InputPicture