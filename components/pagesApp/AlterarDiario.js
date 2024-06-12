import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { app } from '../../firebaseConfig'; 
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";

const firestore = getFirestore(app); 

export default function Alterar({ navigation, route }) {

    const [titulo, setTitulo] = useState(route.params?.titulo || ''); 
    const [data, setData] = useState(route.params?.data || '');
    const [texto, setTexto] = useState(route.params?.texto || '');
    const [local, setLocal] = useState(route.params?.local || '');
    
    function altDiario() {
        const id = route.params?.id; 

        if (!id) {  
            Alert.alert("Erro", "ID do registro não encontrado. Por favor, tente novamente."); 
            return;
        }

        updateDoc(doc(collection(firestore, "diario"), id), {
            titulo: titulo,
            data: data,
            texto: texto,
            local: local,
        })
        .then(() => {
            Alert.alert("Cadastro", "Registro atualizado com sucesso");
            navigation.navigate("Home");
        })
        .catch((error) => {
            console.error("Erro ao atualizar registro:", error);
            Alert.alert("Erro", "Ocorreu um erro ao atualizar o registro. Por favor, tente novamente.");
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.titulo}>Altere seus registros</Text>
            </View>
            <View>
                <TextInput 
                    style={styles.input} 
                    placeholder="Digite o título" 
                    onChangeText={setTitulo} 
                    value={titulo} 
                    autoCapitalize="words"
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Digite a data" 
                    onChangeText={setData} 
                    value={data} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Digite a descrição" 
                    onChangeText={setTexto} 
                    value={texto} 
                    multiline={true} 
                    numberOfLines={4} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Digite o local" 
                    onChangeText={setLocal} 
                    value={local} 
                />
                <TouchableOpacity style={styles.botao} onPress={altDiario}>
                    <Text style={styles.txtBotao}>Alterar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#3E4E5E',
        textAlign: 'center',
    },
    input: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    botao: {
        backgroundColor: '#F15A29',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtBotao: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
