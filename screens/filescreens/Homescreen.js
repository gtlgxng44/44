import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import PairSelector from '../components/PairSelector';
import IntervalSelector from '../components/IntervalSelector';
import Countdown from '../components/Countdown';

const ALL_PAIRS = [
  'OTC EURUSD','OTC GBPUSD','OTC USDJPY','OTC EURJPY','OTC GBPJPY',
  'OTC EURGBP','OTC EURCHF','OTC AUDUSD','OTC USDCAD','OTC NZDUSD',
  'OTC USDCHF','OTC AUDJPY'
];

const SESSIONS = [
  { name: '00:00-04:00', start: 0, end: 4 },
  { name: '04:00-07:00', start: 4, end: 7 },
  { name: '07:00-11:00', start: 7, end: 11 },
  { name: '11:00-15:00', start: 11, end: 15 },
  { name: '15:00-18:00', start: 15, end: 18 },
  { name: '18:00-23:59', start: 18, end: 24 }
];

export default function HomeScreen() {
  const [signals, setSignals] = useState([]);
  const [selectedPair, setSelectedPair] = useState('ALL');
  const [intervalMs, setIntervalMs] = useState(5000);
  const [running, setRunning] = useState(false);
  const [timer, setTimer] = useState(Math.floor(5000/1000));
  const [highOnly, setHighOnly] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimer(Math.max(1, Math.floor(intervalMs / 1000)));
  }, [intervalMs]);

  function nowHour() {
    return new Date().getHours();
  }

  function inSession() {
    const h = nowHour();
    return SESSIONS.some(s => (s.start <= h && h < s.end) || (s.start > s.end && (h >= s.start || h <= s.end)));
  }

  function generateSignal() {
    if (!inSession()) return null;
    const pairs = selectedPair === 'ALL' ? ALL_PAIRS : [selectedPair];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const direction = Math.random() > 0.5 ? 'CALL' : 'PUT';
    const confidence = highOnly ? Math.floor(Math.random() * 16) + 85 : Math.floor(Math.random() * 36) + 60;
    const sig = {
      id: 'sig_' + Date.now(),
      pair,
      direction,
      confidence,
      time: new Date().toLocaleTimeString(),
      expiry: 60
    };
    return sig;
  }

  useEffect(() => {
    if (!running) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          const s = generateSignal();
          if (s) setSignals(prevList => [s, ...prevList].slice(0, 100));
          return Math.max(1, Math.floor(intervalMs / 1000));
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; };
  }, [running, intervalMs, selectedPair, highOnly]);

  function manualGenerate() {
    const s = generateSignal();
    if (s) setSignals(prev => [s, ...prev].slice(0, 100));
    else alert('Out of trading session');
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#071428', padding:16 }}>
      <Text style={{ color:'#fff', fontSize:24, fontWeight:'700', marginBottom:12 }}>OTC Signals — Advanced</Text>

      <View style={{ backgroundColor:'#0b1220', padding:12, borderRadius:10, marginBottom:12 }}>
        <Text style={{ color:'#9aa4b2', marginBottom:8 }}>Session Status</Text>
        <Text style={{ color: inSession() ? '#34d399' : '#fb7185', fontSize:20, fontWeight:'800' }}>
          {inSession() ? 'SESSION ACTIVE' : 'OUT OF TRADING HOURS'}
        </Text>
        <Countdown seconds={timer} />
      </View>

      <View style={{ backgroundColor:'#071a2a', padding:12, borderRadius:10, marginBottom:12 }}>
        <Text style={{ color:'#fff', marginBottom:6 }}>Select Pair</Text>
        <PairSelector pair={selectedPair} setPair={setSelectedPair} pairs={ALL_PAIRS} />
        <Text style={{ color:'#fff', marginTop:8 }}>Interval</Text>
        <IntervalSelector interval={intervalMs} setInterval={setIntervalMs} />
        <View style={{ flexDirection:'row', marginTop:8 }}>
          <TouchableOpacity onPress={() => setHighOnly(v=>!v)} style={{ padding:10, backgroundColor: highOnly ? '#34d399' : '#fff', borderRadius:8, marginRight:8 }}>
            <Text>{highOnly ? 'High only' : 'All'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRunning(v=>!v)} style={{ padding:10, backgroundColor:'#111827', borderRadius:8, marginRight:8 }}>
            <Text style={{ color:'#fff' }}>{running ? 'Stop' : 'Start Auto'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={manualGenerate} style={{ padding:10, backgroundColor:'#2563eb', borderRadius:8 }}>
            <Text style={{ color:'#fff' }}>Manual</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={{ color:'#fff', fontSize:18, marginBottom:8 }}>Recent Signals</Text>
        {signals.length === 0 && <Text style={{ color:'#9aa4b2' }}>No signals yet</Text>}
        {signals.map(s => (
          <View key={s.id} style={{ backgroundColor:'#0b1220', padding:12, borderRadius:8, marginBottom:8 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
              <View>
                <Text style={{ color:'#fff', fontWeight:'700' }}>{s.pair}</Text>
                <Text style={{ color:'#94a3b8' }}>{s.time}</Text>
              </View>
              <View style={{ alignItems:'flex-end' }}>
                <Text style={{ color: s.direction === 'CALL' ? '#34d399' : '#fb7185', fontWeight:'800' }}>{s.direction}</Text>
                <Text style={{ color:'#9aa4b2' }}>{s.confidence}%</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
