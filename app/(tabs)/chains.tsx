import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ImageBackground, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSimulation } from '@/context/SimulationContext';
import CryptoIcon from '@/components/CryptoIcon';

interface Chain {
  id: string;
  name: string;
  icon: string;
  txSpeed: string;
  status: string;
}

const chains: Chain[] = [
  { id: 'bitcoin', name: 'Bitcoin', icon: '₿', txSpeed: '7/10', status: 'Standard' },
  { id: 'ethereum', name: 'Ethereum', icon: '◈', txSpeed: '7/10', status: 'Standard' },
  { id: 'bsc', name: 'BSC', icon: '◉', txSpeed: '7/10', status: 'Standard' },
  { id: 'solana', name: 'Solana', icon: '◎', txSpeed: '7/10', status: 'Standard' },
  { id: 'avalanche', name: 'Avalanche', icon: '▲', txSpeed: '7/10', status: 'Standard' },
];

export default function ChainsScreen() {
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const { setSelectedChains: setContextChains } = useSimulation();

  const screenWidth = Dimensions.get('window').width;
  const isDesktop = screenWidth > 768;
  const backgroundSource = isDesktop
    ? require('../../assets/images/newbackground.png')
    : require('../../assets/images/newbackground.png');


  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

  }, [fadeAnim, slideAnim]);

  const handleStart = React.useCallback(() => {
    const chainsToUse = selectedChains.length > 0 ? selectedChains : chains.map(c => c.id);
    setContextChains(chainsToUse);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/(tabs)/console');
    });
  }, [selectedChains, setContextChains, fadeAnim, slideAnim, router]);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // Sélectionner la blockchain actuelle
        const chainId = chains[currentIndex].id;
        setSelectedChains(prev => [...prev, chainId]);
        
        // Passer à la suivante
        if (currentIndex < chains.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Dernière blockchain atteinte, aller à la page suivante
          handleStart();
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [currentIndex, handleStart]);

  const toggleChain = (chainId: string) => {
    setSelectedChains(prev => 
      prev.includes(chainId) 
        ? prev.filter(id => id !== chainId)
        : [...prev, chainId]
    );
  };

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Animated.View style={[styles.animatedContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Select Blockchains{'\n'} </Text>
          </View>
          
          <ScrollView style={styles.chainsContainer} showsVerticalScrollIndicator={false}>
            {chains.map((chain, index) => (
              <TouchableOpacity
                key={chain.id}
                style={[
                  styles.chainCard,
                  index === currentIndex && styles.chainCardHighlighted,
                  selectedChains.includes(chain.id) && styles.chainCardSelected
                ]}
                onPress={() => toggleChain(chain.id)}
              >
                <View style={styles.chainContent}>
                  <CryptoIcon chainId={chain.id} size={40} />
                  <View style={styles.chainInfo}>
                    <Text style={styles.chainName}>{chain.name}</Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedChains.includes(chain.id) && styles.checkboxSelected
                  ]}>
                    {selectedChains.includes(chain.id) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.startButtonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start search</Text>
            </TouchableOpacity>
          </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  animatedContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#39FF66',
    textAlign: 'center',
    letterSpacing: 2,
  },
  chainsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  chainCard: {
    borderWidth: 2,
    borderColor: '#39FF66',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#000',
  },
  chainCardHighlighted: {
    borderColor: '#39FF66',
    borderWidth: 3,
  },
  chainCardSelected: {
    backgroundColor: '#000',
    borderColor: '#39FF66',
    borderWidth: 3,
  },
  chainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  chainInfo: {
    flex: 1,
    marginLeft: 15,
  },
  chainName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#39FF66',
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#39FF66',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#39FF66',
  },
  checkmark: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButtonContainer: {
    marginTop: 20,
  },
  startButton: {
    height: 60,
    backgroundColor: '#39FF66',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});