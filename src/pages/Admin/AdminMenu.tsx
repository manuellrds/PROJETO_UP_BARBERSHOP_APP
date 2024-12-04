import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types';

type AdminMenuNavigationProp = StackNavigationProp<RootStackParamList, 'AdminMenu'>;

const AdminMenu: React.FC = () => {
  const navigation = useNavigation<AdminMenuNavigationProp>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função para gerar gráficos
  const gerarGraficos = async () => {
    setIsLoading(true);
    try {
      // Chama a rota do Python para gerar os gráficos
      const response = await fetch('http://192.168.192.145:5000/gerar-graficos');
      const data = await response.text();
      console.log(data); // Exibe a resposta do servidor

      // Agora que os gráficos foram gerados, você pode acessar a URL da imagem
      const timestamp = new Date().getTime();
      setImageUri(`http://192.168.192.145:5000/assets/agendamentos_por_barbeiro.jpg?${timestamp}`);
    } catch (error) {
      console.error('Erro ao gerar gráficos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  // Função para abrir os links das imagens
  const abrirLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://img.lovepik.com/bg/20231219/Classic-Barbershop-Captivating-Black-and-White-Photography-Background_2651923_wh860.jpg!/fw/860',
        }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle} // Adicionando estilo para a imagem
      >
        <View style={styles.content}>
          <Text style={styles.title}>Administração BarberShop</Text>

          {/* Botões para navegação */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdmAgendas')}>
            <Text style={styles.buttonText}>Gerenciar Agendamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('admagendamento')}>
            <Text style={styles.buttonText}>Adicionar Novo Agendamento</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Adm', { userId: 1 })}>
            <Text style={styles.buttonText}>Gerenciar Barbeiros e Horários</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('feedback')}>
            <Text style={styles.buttonText}>Ver Feedbacks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PrecoCrudScreen')}>
            <Text style={styles.buttonText}>Cadastrar Preços</Text>
          </TouchableOpacity>

          {/* Novo botão para gerar gráficos */}
          <TouchableOpacity style={styles.button} onPress={gerarGraficos} disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Gerando gráficos...' : 'Gerar Gráficos'}
            </Text>
          </TouchableOpacity>

          {/* Links para visualizar as imagens geradas */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => abrirLink('http://192.168.192.145:5000/imagem/agendamentos_por_barbeiro.jpg')}
          >
            <Text style={styles.linkText}>Ver Agendamentos por Barbeiro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => abrirLink('http://192.168.192.145:5000/imagem/agendamentos_por_corte.jpg')}
          >
            <Text style={styles.linkText}>Ver Agendamentos por Corte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => abrirLink('http://192.168.192.145:5000/imagem/media_cortes_por_cliente.jpg')}
          >
            <Text style={styles.linkText}>Ver Média de Cortes por Cliente</Text>
          </TouchableOpacity>

          {/* Exibir a imagem gerada */}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 300, height: 200, marginTop: 20 }}
            />
          )}
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4D4D', // Vermelho rosado
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FF4D4D', // Vermelho rosado
    fontSize: 18,
  },
  linkButton: {
    marginBottom: 16,
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default AdminMenu;
