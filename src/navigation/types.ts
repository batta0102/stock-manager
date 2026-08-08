import { NavigatorScreenParams } from '@react-navigation/native';

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

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
