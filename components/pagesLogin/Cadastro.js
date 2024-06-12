import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from '../../firebaseConfig';

const app = initializeApp(firebaseConfig);

export default function Cadastro({navigation}){

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const auth = getAuth(app);
  
    const realizarCadastro = async () => {
      try {
        if (senha === "" || confirmSenha === "") {
            setErrorMessage('Preencha todos os campos');
            return;
        }
        if (senha !== confirmSenha) {
          setErrorMessage('As senhas não coincidem');
          return;
        }
        await createUserWithEmailAndPassword(auth, email, senha);
        Alert.alert('Cadastro realizado com sucesso', 'Usuário criado com sucesso');
        navigation.navigate('Login');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('Este email já está cadastrado');
        }
        else if (error.code === 'auth/weak-password') {
          setErrorMessage('A senha deve conter pelo menos 6 caracteres');
        }
        else if (error.code === 'auth/invalid-email'){
          setErrorMessage('Por favor, insira um email válido');
        }
        else if (error.code === 'auth/missing-email'){
          setErrorMessage('Por favor, insira um email.');
        } 
        else {
          setErrorMessage(error.message);
        }
        console.error('Erro ao fazer cadastro:', error.message);
      }
    };
  

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Faça seu cadastro</Text>
                <Text style={styles.label}>Email</Text>
                <TextInput  
                    style={styles.input} 
                    placeholder="Digite o email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.label}>Senha</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Digite a Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Confirmar Senha'
                    value={confirmSenha}
                    onChangeText={setConfirmSenha}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={realizarCadastro}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
                {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c8dfe2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content:{
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        alignItems: 'center',
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#3E4E5E',
    },
    label:{
        fontSize: 16,
        color: '#3E4E5E',
        alignSelf: 'flex-start',
        marginBottom: 5,
        width: '100%',
    },
    input:{
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#3E4E5E',
    },
    button:{
        backgroundColor:'#F15A29',
        borderRadius: 8,
        width: '100%',
        paddingVertical: 12,
        alignItems:'center',
    },
    buttonText:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    errorMessage: {
        color: '#FF4242',
        marginTop: 10,
    }
});
