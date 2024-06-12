import { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from '../../firebaseConfig';
const app = initializeApp(firebaseConfig);

export default function Login({navigation}){

    const [email,setEmail] = useState('');
    const [senha,setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const realizarLogin = async () => {
        try {
          const auth = getAuth(app);
          await signInWithEmailAndPassword(auth, email, senha);
          navigation.navigate('Home');
        } catch (error) {
          if (error.code === 'auth/invalid-credential') {
            setErrorMessage('Email ou Senha incorretos.');
          } else if (error.code === 'auth/invalid-email'){
            setErrorMessage('Por favor, insira um email válido.');
          } else if (error.code === 'auth/user-not-found'){
            setErrorMessage('Email não cadastrado.');
          } else if (error.code === 'auth/missing-password'){
            setErrorMessage('Por favor, insira a senha.');
          } else {
            setErrorMessage(error.message);
          }
          console.error('Erro ao fazer login:', error);
        }
      };

      const navegarParaCadastro = () => {
        navigation.navigate('Cadastro');
      };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>GaleryOn</Text>
                <Text style={styles.label}>Email</Text>

                <TextInput  
                    style={styles.input} 
                    placeholder="Digite o email"
                    onChangeText={(email)=>setEmail(email)}
                    value={email}
                />

                <Text style={styles.label}>Senha</Text>
                
                <TextInput 
                    style={styles.input}
                    placeholder="Digite a Senha"
                    onChangeText={(senha)=>setSenha(senha)}
                    value={senha}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={realizarLogin}>
                    <Text style={styles.buttonText}>Log-in</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={navegarParaCadastro}>
                <Text style={styles.cadastrar}>Realize aqui seu cadastro</Text>
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
        fontSize:24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#3E4E5E',
    },
    label:{
        fontSize:16,
        color: '#3E4E5E',
        alignSelf: 'flex-start',
        marginBottom: 5,
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
    },
    cadastrar:{
      margin: 5,
      color: '#3E4E5E',
      textDecorationLine: 'underline'
    }
});
