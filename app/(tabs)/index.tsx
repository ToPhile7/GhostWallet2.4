import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Platform, Image, ImageBackground, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSimulation } from '@/context/SimulationContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { setCustomAmount, setFoundAmount } = useSimulation();

  const screenWidth = Dimensions.get('window').width;
  const isDesktop = screenWidth > 768;
  const backgroundSource = isDesktop
    ? require('../../assets/images/background.png')
    : require('../../assets/images/background.png');


  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleAccess = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      router.push('/(tabs)/chains');
    });
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter') {
      handleAccess();
    }
  };
  const handleSkullClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 2000);
    
    setClickTimer(timer);
    
    if (clickCount + 1 === 3) {
      setClickCount(0);
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
      
      if (Platform.OS === 'web') {
        const value = window.prompt('Enter the amount you want to find:');
        if (value !== null) {
          setCustomAmount(value);
          setFoundAmount(value);
          window.alert(`Montant personnalisé défini à "${value}". Chaque portefeuille trouvé affichera exactement ce texte.`);
        }
      } else {
        Alert.prompt(
          'Custom Amount',
          'Enter the amount you want to find in each wallet:',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Set',
              onPress: (value) => {
                if (value !== undefined && value !== null) {
                  setCustomAmount(value);
                  Alert.alert('Success', `Montant personnalisé défini à "${value}". Chaque portefeuille trouvé affichera exactement ce texte.`);
                }
              },
            },
          ],
          'plain-text'
        );
      }
    }
  };

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        <SafeAreaView style={styles.container}>
        <View style={styles.neonBorder}>
          <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <TouchableOpacity style={styles.skullContainer} onPress={handleSkullClick}>
              <Image 
                source={require('../../assets/images/skull.png')}
                style={styles.skullImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleGhost}>GHOST</Text>
            <Text style={styles.titleWallet}>WALLET</Text>
            <Text style={styles.titleVersion}>2.4</Text>
          </View>

          {/* Form Section: Username Input and Access Button */}
          <View style={styles.formSection}>
            <Text style={styles.usernameLabel}>Enter your username</Text>
            <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              onKeyPress={handleKeyPress}
            />
          </View>
          <TouchableOpacity style={styles.accessButton} onPress={handleAccess}>
            <Text style={styles.accessButtonText}>Access</Text>
          </TouchableOpacity>
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.footer}>
            <Text style={styles.footerText}>
              You don't have a license? <Text style={styles.boldText}>Buy here.</Text>
            </Text>
            <Text style={styles.footerText}>Need help? Telegram</Text>
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
  neonBorder: {
    flex: 1,
    margin: 0,
    borderWidth: 2,
    borderColor: '#39FF66',
    borderRadius: 0,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  skullContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skullImage: {
    width: 150,
    height: 150,
    tintColor: '#39FF66',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: -50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleGhost: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#39FF66',
    letterSpacing: 8,
    textTransform: 'uppercase',
    marginRight: 8,
    textShadowColor: '#39FF66',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleWallet: {
    fontSize: 28,
    fontWeight: '300',
    color: '#39FF66',
    letterSpacing: 8,
    textTransform: 'uppercase',
    textShadowColor: '#39FF66',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleVersion: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#39FF66',
    letterSpacing: 1,
    marginLeft: 8,
    marginTop: -15,
  },
  // New styles for formSection and usernameLabel
  formSection: {
    // This will now be treated as a single block by 'space-between'
    // We can use gap to control spacing between its children
    gap: 10, // Adjust this value to control spacing between label, input, and button
    marginTop: 40, // Adjust overall spacing from the title
  },
  usernameLabel: {
    fontSize: 16,
    color: '#39FF66', // Neon green color
    textAlign: 'center',
    marginBottom: 5, // Small gap between label and input
  },
  inputContainer: {
    // marginBottom: 0, // This is already 0, no change needed
  },
  input: {
    height: 60,
    borderWidth: 2,
    borderColor: '#39FF66',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  accessButton: {
    height: 60, // This is already 0, no change needed
    backgroundColor: '#39FF66',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  accessButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});