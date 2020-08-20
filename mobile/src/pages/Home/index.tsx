import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons'
import { View, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Dropdown from "../../components/Dropdown";

import styles from './styles';
import SelectItem from '../../models/SelectItem';
import homeController from '../../controllers/HomeController';

const Home = () => {
    const navigation = useNavigation();

    const [enableButton, setEnableButton] = useState<boolean>(false);
    const [states, setStates] = useState<SelectItem[]>([]);
    const [cities, setCities] = useState<SelectItem[]>([]);
    const [selectedState, setSelectedState] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>('0');

    // Load UFs
    useEffect(() => {
        homeController.loadUfs().then(states => {
            const SelectItemStates: SelectItem[] = states.map((state) => {
                return {
                    label: state.nome,
                    value: state.sigla,
                };
            });
            setStates(SelectItemStates);
        });
    }, []);

    // Load Cities
    useEffect(() => {
        homeController.loadCities(selectedState).then(cites => {
            const SelectItemCites : SelectItem[] = cites.map((city) => {
                return {
                    label: city.nome,
                    value: city.nome,
                };
            });
            setStates(SelectItemCites);
        });
    }, [selectedState]);

    function handleSelectState(state: string) {
        setSelectedState(state);
    }

    function handleSelectCity(city: string) {
        setSelectedCity(city);
        setEnableButton(true);
    }

    function handleNavigationToPoint() {
        navigation.navigate('PointPage', { selectedState, selectedCity });
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
                    <Dropdown
                        label='Selecione Estado'
                        values={states}
                        handleSelect={handleSelectState}
                    />
                    <Dropdown
                        label='Selecione Cidade'
                        values={cities}
                        handleSelect={handleSelectCity}
                    />
                    <RectButton style={styles.button} enabled={enableButton} onPress={handleNavigationToPoint}>
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