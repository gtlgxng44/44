import React from 'react';
import { View, Picker } from 'react-native';
export default function PairSelector({ pair, setPair, pairs = [] }) {
  return (
    <View style={{ backgroundColor:'#fff', borderRadius:6 }}>
      <Picker selectedValue={pair} onValueChange={v => setPair(v)}>
        <Picker.Item label="ALL" value="ALL" />
        {pairs.map(p => <Picker.Item key={p} label={p} value={p} />)}
      </Picker>
    </View>
  );
}
