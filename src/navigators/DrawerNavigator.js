import React from 'react';
import { Dimensions, Platform, ScrollView } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import createNavigator from './createNavigator';
import createNavigationContainer from '../createNavigationContainer';
import TabRouter from '../routers/TabRouter';
import DrawerScreen from '../views/Drawer/DrawerScreen';
import DrawerView from '../views/Drawer/DrawerView';
import DrawerItems from '../views/Drawer/DrawerNavigatorItems';

// A stack navigators props are the intersection between
// the base navigator props (navgiation, screenProps, etc)
// and the view's props

const defaultContentComponent = props => (
  <ScrollView alwaysBounceVertical={false}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const DefaultDrawerConfig = {
  drawerWidth: () => {
    /*
     * Default drawer width is screen width - header height
     * with a max width of 280 on mobile and 320 on tablet
     * https://material.io/guidelines/patterns/navigation-drawer.html
     */
    const { height, width } = Dimensions.get('window');
    const smallerAxisSize = Math.min(height, width);
    const isLandscape = width > height;
    const isTablet = smallerAxisSize >= 600;
    const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
    const maxWidth = isTablet ? 320 : 280;

    return Math.min(smallerAxisSize - appBarHeight, maxWidth);
  },
  contentComponent: defaultContentComponent,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
  drawerPosition: 'left',
  drawerBackgroundColor: 'white',
  useNativeAnimations: true,
};

const DrawerNavigator = (routeConfigs, config = {}) => {
  const mergedConfig = { ...DefaultDrawerConfig, ...config };
  const {
    order,
    paths,
    initialRouteName,
    backBehavior,
    ...drawerConfig
  } = mergedConfig;
  const tabsConfig = {
    order,
    paths,
    initialRouteName,
    backBehavior,
  };
  const contentRouter = TabRouter(routeConfigs, tabsConfig);
  const drawerRouter = TabRouter(
    {
      [drawerConfig.drawerCloseRoute]: {
        screen: createNavigator(DrawerScreen, contentRouter, config),
      },
      [drawerConfig.drawerOpenRoute]: {
        screen: () => null,
      },
      [drawerConfig.drawerToggleRoute]: {
        screen: () => null,
      },
    },
    {
      initialRouteName: drawerConfig.drawerCloseRoute,
    }
  );

  const navigator = createNavigator(DrawerView, drawerRouter, drawerConfig);

  return createNavigationContainer(navigator);
};

export default DrawerNavigator;
