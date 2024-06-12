import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";

export default function Home({ navigation }) {
  
  const auth = getAuth();
  const [diario, setDiario] = useState([]);
  const firestore = getFirestore();

  function deleteDiario(id) {
    deleteDoc(doc(collection(firestore, 'diario'), id))
      .catch((error) => {
        console.error('Erro ao excluir diário:', error.message);
      });
  }

  useEffect(() => {
    const unsubscribeDiario = onSnapshot(collection(firestore, 'diario'), (querySnapshot) => {
      const lista = [];
      querySnapshot.forEach((doc) => { 
        lista.push({ ...doc.data(), id: doc.id }); 
      });
      setDiario(lista);
    }); 

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { navigation.navigate('Login'); }
    });

    return () => { unsubscribeDiario(); unsubscribeAuth(); };
  }, [auth, navigation]);

  const fazerLogout = async () => {
    try { await signOut(auth); } 
    catch (error) { console.error('Erro ao sair da conta:', error.message); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={fazerLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="red" />
      </TouchableOpacity>
      <FlatList 
        data={diario} 
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Alterar Diario', {
            id: item.id,
            data: item.data instanceof Date ? item.data.toDate() : null, 
            texto: item.texto,
            local: item.local,
            imageUrl: item.imageUrl 
          })}>
            <SafeAreaView>
              <View style={styles.content}>
                <Text style={styles.title}> Título: <Text style={styles.itemText}>{item.titulo}</Text> </Text>
                <Text style={styles.itemText}> Data: {item.data} </Text>
                <Text style={styles.itemText}> Texto: <Text style={styles.itemText}>{item.texto}</Text> </Text>
                <Text style={styles.itemText}> Local: <Text style={styles.itemText}>{item.local}</Text> </Text>
                {item.imageUrl && (
                  <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.image} 
                    resizeMode="cover" 
                  />
                )}
                <TouchableOpacity onPress={() => deleteDiario(item.id)}>
                  <Text style={styles.deleteButton}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </TouchableOpacity>
        )} 
      />
      <View style={styles.addButton}>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastrar Diario")}>
          <MaterialCommunityIcons name="plus-circle-outline" size={70} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 80,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3E4E5E',
  },
  itemText: {
    color: '#000',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    padding: 10,
    zIndex: 1,
  },
  deleteButton: {
    color: 'red',
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  }
});
