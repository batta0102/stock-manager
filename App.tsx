import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { notifyOutOfStockProducts } from './src/services/notificationService';
import { useProductStore } from './src/store/productStore';
import { getStockStatus } from './src/types/product';

export default function App() {
  const hasHydrated = useProductStore((state) => state.hasHydrated);
  const products = useProductStore((state) => state.products);

  useEffect(() => {
    if (!hasHydrated) return;
    const outOfStockCount = products.filter((product) => getStockStatus(product) === 'out').length;
    notifyOutOfStockProducts(outOfStockCount);
  }, [hasHydrated]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
