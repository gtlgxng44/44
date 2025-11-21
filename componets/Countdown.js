import React from 'react';
import { View, Text } from 'react-native';
export default function Countdown({ seconds }) {
  const s = Math.max(0, Math.floor(seconds));
  return (
    <View style={{ marginTop:8 }}>
      <Text style={{ color:'#ffd166', fontSize:28, fontWeight:'800' }}>{s}s</Text>
    </View>
  );
}
