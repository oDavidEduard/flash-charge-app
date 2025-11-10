import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import api from "../constants/api.js";

export default function Index(){
    const [apiStatus, setApiStatus] = useState("Testando...");

    const testarAPI = async () => {
        try {

            const response = await api.get("/");
            setApiStatus("Api conectada");
            Alert.alert("Sucesso", response.data.message);

        } catch (error) {
            
            setApiStatus("Erro");
            Alert.alert("Erro na conexão");
            console.error("Erro:", error);

        }
    };

    useEffect(() => {
        testarAPI();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Flash Charge</Text>
            
            <View style={styles.statusBox}>
                <Text style={styles.status}>{apiStatus}</Text>
            </View>

            <Button title={"Testar api novamente"} onPress={testarAPI}/>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  statusBox: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
  },
});