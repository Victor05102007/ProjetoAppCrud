import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useState, useEffect } from 'react';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Delete() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("@token")

      if (!token) {
        alert("Erro, você não esta logado")
        setLoading(false)
        return;
      }

      const res = await axios.get("http://localhost:3001/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })

      setUsername(res.data.user.nome)
      setEmail(res.data.user.email)

    } catch (error) {
      console.log("ERRO:", error)
    } finally {
      setLoading(false)
    }
  }


  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("@token")

      if (!token) {
        alert("Erro, você não esta logado")
        setLoading(false)
        return;
      }

      const res = await axios.delete("http://localhost:3001/auth/delete", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(res.data)
    } catch (error) {

    } finally {
      setLoading(false)
    }

  }



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu perfil</Text>

      <TouchableOpacity style={styles.btn} onPress={handleDelete}>
        <Text>Deletar</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    justifyContent: 'center'
  },

  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff"
  },

  btn: {
    width: "100%",
    padding: 10,
    backgroundColor: "#00ff00",
    alignItems: "center"
  }
});
