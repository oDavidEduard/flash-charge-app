import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import api from '../../constants/api.js';

export default function MapScreen(){

    const [location, setLocation] = useState(null);
    const [chargers, setChargers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCharger, setSelectedCharger] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    //regiao padrao
    const [region, setRegion] = useState({
      latitude: -5.8367,
      longitude: -35.2045,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    useEffect(() => {
      loadLocationAndChargers();
    }, []);

    async function loadLocationAndChargers(){
      try {
        
        //solicita permissao de loc
        const { status } = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){
          Alert.alert(
            'Permissão negada',
            'Precisamos da sua localização para continuar.',
            [{ text: 'OK' }]
          );
          setLoading(false);
          return;
        }

        //pega a localizacao atual
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation(currentLocation);

        //atualiza a loc pra onde o usuario esta
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        //busca carregadores proximos
        await fetchChargers(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );

      } catch (error) {
        console.error('Erro ao carregar:', error);
        Alert.alert('Erro', 'Não foi possível carregar sua localização');
        setLoading(false);
      }
    }

    //busca carregador na regiao
    async function fetchChargers(lat, lng){
      try {
        const response = await api.get('/chargers', {
          params:{
            lat,
            lng,
            radius: 10,
          },
        });

        setChargers(response.data);
        setLoading(false);
        
      } catch (error) {
        console.error('Erro ao buscar carregadores:', error);
        Alert.alert('Erro', 'Não foi possível carregar os carregadores');
        setLoading(false);
      }
    }

    //quando clica no pin
    function handleMarkerPress(charger){
      setSelectedCharger(charger);
      setModalVisible(true);
    }

    //atualiza carregadores qnd o usuario move a tela
    function handleRegionChangeComplete(newRegion) {
      fetchChargers(newRegion.latitude, newRegion.longitude);
    }

    if(loading){
      return(
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color="#007AFF"/>
          <Text style={styles.loadingText}>Carregando mapa...</Text>
        </View>
      );
    }

    return(
        <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              showsUserLocation
              showsMyLocationButton
              onRegionChangeComplete={handleRegionChangeComplete}
            >
              {chargers.map((charger) => (
                <Marker
                  key={charger.id}
                  coordinate={{
                    latitude: parseFloat(charger.latitude.toString()),
                    longitude: parseFloat(charger.longitude.toString()),
                  }}
                  title={charger.name}
                  description={charger.address}
                  onPress={() => handleMarkerPress(charger)}
                >
                  <View style={styles.markerContainer}>
                    <Ionicons
                      name="flash"
                      size={30}
                      color={charger.available ? "#34C759" : "#FF3B30"}
                    />
                  </View>
                </Marker>
              ))}
            </MapView>

            <View style={styles.header}>
              <Text style={styles.headerText}>
                ⚡ {chargers.length} carregadores encontrados
              </Text>
            </View>

            <Modal
              animationType='slide'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  {selectedCharger && (
                    <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>{selectedCharger.name}</Text>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Ionicons name='close' size={28} color='#000'/>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name='location' size={20} color='#666'/>
                      <Text style={styles.detailText}>{selectedCharger.address}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name='flash' size={20} color='#666'/>
                      <Text style={styles.detailText}>
                        {selectedCharger.chargerType} - {selectedCharger.powerKw}kW
                      </Text>
                    </View>

                    {selectedCharger.pricePerKwh && (
                      <View style={styles.detailRow}>
                        <Ionicons name='cash' size={20} color='#666'/>
                        <Text style={styles.detailText}>
                          R$ {parseFloat(selectedCharger.pricePerKwh).toFixed(2)}/kWh
                        </Text>
                      </View>
                    )}

                    {selectedCharger.distance && (
                      <View style={styles.detailRow}>
                        <Ionicons name='walk' size={20} color='#666'/>
                        <Text style={styles.detailText}>
                          {parseFloat(selectedCharger.distance).toFixed(1)} km de distância
                        </Text>
                      </View>
                    )}

                    <View style={styles.statusBadge}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: selectedCharger.available ? '#34C759' : '#FF3B30' }
                      ]}/>
                      <Text style={styles.statusText}>
                        {selectedCharger.available ? 'Disponível' : 'Indisponível'}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.directionsButton}
                      onPress={() => {
                        Alert.alert('Em breve', 'Navegação será implementada em breve');
                      }}
                    >
                      <Ionicons name='navigate' size={20} color='#fff'/>
                      <Text style={styles.directionsButtonText}>Como chegar</Text>
                    </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginVertical: 15,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  directionsButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});