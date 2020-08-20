import React from "react";
import { View,Text } from "react-native";
import RNPickerSelect from 'react-native-picker-select';

import styles from "./styles";
import SelectItem from "../../models/SelectItem";

interface Props {
    label: string;
    values: Array<SelectItem>;
    handleSelect: (value: string) => void;
}

export const Dropdown: React.FC<Props> = ({ label, values, handleSelect }) => {
    return (
        <View style={styles.container}>
            <RNPickerSelect
                placeholder={{
                    label: label,
                    value: null,
                  }}
                items={values}
                onValueChange={(value) => handleSelect(value)}
            />
        </View>
    );
};

export default Dropdown;