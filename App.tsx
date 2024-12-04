import React from 'react';
import { LogBox } from 'react-native'; // Importa o LogBox para ignorar logs

// Ignorar avisos antes de qualquer renderização
LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component', // Ignora o aviso de texto fora de <Text>
  'VirtualizedLists should never be nested inside plain ScrollViews', // Ignora o aviso de listas aninhadas
]);

import AppNavigator from './src/navigation/AppNavigation';

const App = () => {
  return <AppNavigator />;
};

export default App;
