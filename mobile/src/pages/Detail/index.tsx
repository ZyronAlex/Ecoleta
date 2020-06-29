import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, Image, Linking } from "react-native";
import { Feather as Icon } from '@expo/vector-icons';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from "react-native-gesture-handler";
import * as MailComposer from 'expo-mail-composer';

import styles from './styles';
import DetailParams from '../../models/DetailParams';
import api from '../../services/api';
import Point from '../../models/Point';

const Detail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const params = route.params as DetailParams;

    const [point, setPoint] = useState<Point>({} as Point);

    useEffect(() => {
        api.get(`/points/${params.point_id}`).then(response => {
            setPoint(response.data);
        });
    }, []);

    function handleNavigateBack() {
        navigation.goBack();
    }

    function handleComposeMail(){
        MailComposer.composeAsync({
            subject: 'Interese na coleta de resíduos',
            recipients: [point.email]
        });
    }

    function handleWhatApp(){
        Linking.openURL(`whatsapp://send?phone=${point?.whatsApp}&text=Tenho interesse sobre coleta de resíduos`);
    }

    if(!point || !point.items){
        return null;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: point.image }} />

                <Text style={styles.pointName}>{point?.name}</Text>
                <Text style={styles.pointItems}>
                    {point?.items.map(item => item.title).join(', ')}
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>
                        {point.city}, {point.uf}
                </Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatApp}>
                    <FontAwesome name='whatsapp' size={20} color='#FFF' />
                    <Text style={styles.buttonText}>WhatsApp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name='mail' size={20} color='#FFF' />
                    <Text style={styles.buttonText}>Email</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    );
}

export default Detail;