import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddCharger(){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Adicione um carregador!</Text>
            <Text style={styles.subtitle}>Formulario</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 10,
    color: '#666',
  },
});