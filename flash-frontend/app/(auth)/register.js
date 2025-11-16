import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard 
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/context/authContext.js';

export default function RegisterScreen({ navigation }){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { signUp } = useAuth();

    async function handleRegister(){
        if(!email || !password || !name || !confirmPassword){
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        if( password !== confirmPassword){
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        setLoading(true);

        const result = await signUp(name, email, password);

        setLoading(false);

        if(!result.success){
            Alert.alert('Erro', result.message);
        }
    }

    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>Realize já seu cadastro</Text>

            <TextInput
                style={styles.input}
                placeholder='Seu nome'
                placeholderTextColor='#999999'
                value={name}
                onChangeText={setName}
                autoCapitalize='none'
            />
        
            <TextInput
                style={styles.input}
                placeholder='E-mail'
                placeholderTextColor='#999999'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                keyboardType='email-address'
            />
        
            <TextInput
                style={styles.input}
                placeholder='Senha'
                placeholderTextColor='#999999'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder='Confirme sua senha'
                placeholderTextColor='#999999'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
        
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={'#fff'}/>
                ) : (
                    <Text style={styles.buttonText}>Cadastrar</Text>
                )}
            </TouchableOpacity>
            
            <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
                <Text style={styles.link}>Já tem conta? Faça login!</Text>
            </TouchableOpacity>
            </Link>
        </View>
      </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});