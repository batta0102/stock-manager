import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/theme';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import TabNavigator from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Détail produit' }} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Nouveau produit' }} />
    </Stack.Navigator>
  );
}
