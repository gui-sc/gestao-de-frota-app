import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UnreadBadgeProps {
  count: number;
}

const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  // Se não houver mensagens não lidas, não mostra o círculo
  if (count <= 0) {
    return null;
  }

  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: '#44EAC3',
    width: 20,
    height: 20,
    borderRadius: 10, // Metade do width/height para deixar circular
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    marginTop: 5, // Espaçamento entre o horário e o número
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default UnreadBadge;
