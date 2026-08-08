import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ProductListFilter = 'all' | 'low' | 'out';

export type TabParamList = {
  Products: { filter?: ProductListFilter } | undefined;
  Dashboard: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  ProductDetail: { productId: string };
  ProductForm: { productId: string } | undefined;
};

export type ProductsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Products'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type DashboardScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ProductDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;
export type ProductFormScreenProps = NativeStackScreenProps<RootStackParamList, 'ProductForm'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
