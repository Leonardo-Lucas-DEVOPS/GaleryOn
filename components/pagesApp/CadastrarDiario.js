import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { collection, addDoc } from 'firebase/firestore'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from "expo-image-picker";
import { firestore, storage } from '../../firebaseConfig';

export default function CadDiario({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [image, setImage] = useState('');

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);
    }
  }

  async function uploadImage(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${new Date().toISOString()}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });

      Alert.alert("oooooo carai ")
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    }
  }

  async function addDiario() {
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const docRef = await addDoc(collection(firestore, 'diario'), {
        titulo: titulo,
        texto: texto,
        data: data,
        local: local,
        imageUrl: imageUrl,
      });
      setTitulo('');
      setTexto('');
      setData('');
      setLocal('');
      setImage('');
      Alert.alert("Cadastro", "Diário adicionado com sucesso");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao adicionar diário:", error.message);
      Alert.alert("Erro", "Ocorreu um erro ao adicionar o diário. Por favor, tente novamente.");
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Registre o tempo</Text>
      </View>
      <TextInput
        autoCapitalize="sentences"
        style={styles.input}
        placeholder="Título"
        onChangeText={setTitulo}
        value={titulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Texto"
        onChangeText={setTexto}
        value={texto}
        multiline={true}
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Data"
        onChangeText={setData}
        value={data}
      />
     
      <TouchableOpacity
        style={styles.btnPickImage}
        onPress={pickImage}>
        <Text style={styles.btnText}>Selecionar Imagem</Text>
      </TouchableOpacity>
      {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}
      <TouchableOpacity
        style={styles.btnEnviar}
        onPress={() => addDiario()}>
        <Text style={styles.btnTextEnviar}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3E4E5E',
  },
  input: {
    width: '80%',
    height: 40,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  btnPickImage: {
    backgroundColor: '#FFD700',
    width: '80%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  btnEnviar: {
    backgroundColor: '#F15A29',
    width: '80%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextEnviar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
