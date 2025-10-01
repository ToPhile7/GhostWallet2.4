import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface CryptoIconProps {
  chainId: string;
  size?: number;
}

const CryptoIcon: React.FC<CryptoIconProps> = ({ chainId, size = 40 }) => {
  const getIconSource = () => {
    switch (chainId) {
      case 'bitcoin':
        return require('../assets/images/bitcoin.png'); // 👈 ajoute un vrai logo Bitcoin en PNG
      case 'ethereum':
        return require('../assets/images/DfXSzOi.png');
      case 'bsc':
        return require('../assets/images/bnb.png');
      case 'solana':
        return require('../assets/images/solana.png');
      case 'avalanche':
        return require('../assets/images/avalanche.png');
      default:
        return null;
    }
  };

  const source = getIconSource();
  if (!source) return null;

  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      <Image 
        source={source}
        style={styles.cryptoImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(57, 255, 102, 0.1)',
    borderWidth: 1,
    borderColor: '#39FF66',
    overflow: 'hidden',
  },
  cryptoImage: {
    width: '80%',   // 👈 taille relative, évite les décalages
    height: '80%',
    tintColor: '#39FF66',
    shadowColor: '#39FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
});

export default CryptoIcon;
