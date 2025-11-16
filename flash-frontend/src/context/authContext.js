import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../constants/api.js";

const AuthContext = createContext({});

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredData();
    }, []);

    async function loadStoredData(){
        try {
            const storedToken = await AsyncStorage.getItem("@token");
            const storedUser = await AsyncStorage.getItem("@user");

            if (storedToken && storedUser){
                api.defaults.headers.Authorization = `Bearer ${storedToken}`;
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        } finally{
            setLoading(false);
        }
    }


async function signIn (email, password){
    try {
        const response = await api.post("/auth/login", { email, password });

        const { token, user: userData } = response.data;

        await AsyncStorage.setItem("@token", token);
        await AsyncStorage.setItem("@user", JSON.stringify(userData));

        api.defaults.headers.Authorization = `Bearer ${token}`;

        setUser(userData);

        return { success: true };
    } catch (error) {
        console.error('Erro no login:', error);
        return{
            success: false, 
            message: error.response?.data?.error || 'Erro ao fazer login'
        };
    }
}

async function signUp (name, email, password){
    try {
        const response = await api.post("/auth/register", { name, email, password });

        const { token, user: userData } = response.data;

        await AsyncStorage.setItem("@token", token);
        await AsyncStorage.setItem("@user", JSON.stringify(userData));

        api.defaults.headers.Authorization = `Bearer ${token}`;

        setUser(userData);

        return { success: true };
    } catch (error) {
        console.error('Erro no cadastro:', error);
        return{
            success: false, 
            message: error.response?.data?.error || 'Erro ao realizar cadastro'
        };
    }
}

async function signOut(){
    try {
        await AsyncStorage.removeItem("@token");
        await AsyncStorage.removeItem("@user");

        delete api.defaults.headers.Authorization;
        setUser(null);
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

return(
    <AuthContext.Provider
        value={{
            signed: !!user,
            user,
            loading,
            signIn,
            signUp,
            signOut
        }}
    >
        {children}
    </AuthContext.Provider>
);

}

export function useAuth(){
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
}