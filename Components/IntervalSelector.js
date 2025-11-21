import React from 'react';
import { View, Picker } from 'react-native';
export default function IntervalSelector({ interval, setInterval }) {
  return (
    <View style={{ backgroundColor:'#fff', borderRadius:6 }}>
      <Picker selectedValue={interval} onValueChange={v => setInterval(v)}>
        <Picker.Item label="5s" value={5000} />
        <Picker.Item label="10s" value={10000} />
        <Picker.Item label="30s" value={30000} />
        <Picker.Item label="1 min" value={60000} />
      </Picker>
    </View>
  );
}
