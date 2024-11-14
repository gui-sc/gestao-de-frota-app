import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteList } from '../utils/stackParamRouteList';
import { navigate } from '../app/rootNavigation';

interface TabItem {
  label: string;
  icon: JSX.Element;
  route: string;
}

interface BottomTabsProps {
  routes: TabItem[];
}

const BottomTabs: React.FC<BottomTabsProps> = ({ routes }) => {

  return (
    <View style={styles.container}>
      {routes.map((route, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tabItem}
          onPress={() => navigate(route.route as never)}
        >
          {route.icon}
          <Text style={styles.label}>{route.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#000',  // Fundo da barra de navegação
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  tabItem: {
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomTabs;
