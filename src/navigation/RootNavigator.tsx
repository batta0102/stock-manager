import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import { colors, typography } from '../theme/theme';
import TabNavigator from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontSize: typography.subtitle.fontSize, fontWeight: typography.subtitle.fontWeight },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Détail produit' }} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Nouveau produit' }} />
    </Stack.Navigator>
  );
}
