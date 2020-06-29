import React, { useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

const Home = () => {
    const navigation = useNavigation();

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    function handleNavigationToPoint() {
        navigation.navigate('PointPage',{uf,city});
    }

    return (
        <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground
                style={styles.container}
                source={require('../../assets/home-background.png')}
                imageStyle={styles.containerImage}>
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>
                            Seu marketplace de coleta de resíduos
                        </Text>
                        <Text style={styles.description}>
                            Ajudamos pessoas a encontrarem pontos de coleta de forma
                            eficiente.
                        </Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TextInput
                        style={styles.input}
                        placeholder='Digite Uf'
                        value={uf}
                        maxLength={2}
                        autoCapitalize='characters'
                        autoCorrect={false}
                        onChangeText={setUf} />
                    <TextInput
                        style={styles.input}
                        placeholder='Digite Cidade'
                        value={city}
                        autoCorrect={false}
                        onChangeText={setCity} />
                    <RectButton style={styles.button} onPress={handleNavigationToPoint}>
                        <View style={styles.buttonIcon}>
                            <Icon name='arrow-right' color='#FFF' size={24}></Icon>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                    </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

export default Home;