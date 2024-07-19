import 'react-native-gesture-handler';
import { StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, View } from 'react-native';
import React, { useRef } from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/navigation/CustomDrawerContent';
import theme from '@/hooks/theme';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';

type RootDrawerParamList = {
  dashboard: undefined;
  Challenges: undefined;
  calorieCalculator: undefined;
  UserProfile: undefined;
  CalorieOverview: undefined;
  evaluation: undefined;
  settings: undefined;
  Level: undefined;
  '+not-found': undefined;
};

const _layout = () => {
  const navigation = useNavigation<DrawerScreenProps<RootDrawerParamList>['navigation']>();
  const animation = useRef(new Animated.Value(0)).current;

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleClosePress = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('dashboard');
      animation.setValue(0);
    });
  };

  const screenStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -Dimensions.get('window').width],
        }),
      },
    ],
  };

  const dashboardStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [Dimensions.get('window').width, 0],
        }),
      },
    ],
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={[StyleSheet.absoluteFill, screenStyle]}>
        <Drawer
          drawerContent={CustomDrawerContent}
          screenOptions={{
            drawerHideStatusBarOnOpen: true,
            drawerActiveBackgroundColor: '#007B40',
            drawerActiveTintColor: '#fff',
            drawerLabelStyle: {
              marginLeft: -20,
              fontFamily: theme.fonts.regular,
              fontSize: 16,
            },
            drawerItemStyle: {
              borderRadius: 4,
            },
            drawerContentContainerStyle: {
              paddingTop: 20,
            },
            headerTitleStyle: {
              fontFamily: theme.fonts.semiBold,
              fontSize: 18,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
                <Ionicons name="menu" size={24} color={theme.colors.primaryGreen100} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleClosePress} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.primaryGreen100} />
              </TouchableOpacity>
            ),
          }}
        >
          <Drawer.Screen
            name="dashboard"
            options={{
              drawerLabel: 'Slimba',
              headerShown: false,
              drawerIcon: ({ size, color }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Challenges"
            options={{
              drawerLabel: 'Challenges',
              headerTitle: 'Challenges',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="rocket-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="calorieCalculator"
            options={{
              drawerLabel: 'Ernährungs-Assistent',
              headerTitle: 'Ernährungs-Assistent',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="chatbox-ellipses-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="InboxScreen"
            options={{
              drawerLabel: 'Inbox',
              headerTitle: 'Inbox',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="mail-outline" size={size} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="UserProfile"
            options={{
              drawerLabel: 'Mein Profil',
              headerTitle: 'Mein Profil',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="scale-outline" size={size} color={color} />
              ),
              drawerItemStyle: styles.spacedItem, // Add space before this item
            }}
          />
          <Drawer.Screen
            name="CalorieOverview"
            options={{
              drawerLabel: 'Kalorienübersicht',
              headerTitle: 'Kalorienübersicht',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="options-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="evaluation"
            options={{
              drawerLabel: '7-Tage Statistik',
              headerTitle: '7-Tage Statistik',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Level"
            options={{
              drawerLabel: 'Level',
              headerTitle: 'Level und Punktestand',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="star-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: 'Einstellungen',
              headerTitle: 'Einstellungen',
              drawerIcon: ({ size, color }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
              drawerItemStyle: styles.spacedItem, // Add space before this item
            }}
          />
          <Drawer.Screen name="+not-found" />
        </Drawer>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, dashboardStyle]}>
        <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
          {/* This is a placeholder for the dashboard content */}
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default _layout;

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    justifyContent: 'center',
    height: '100%', // Ensure full height to center the icon vertically
  },
  closeButton: {
    marginRight: 16,
    justifyContent: 'center',
    height: '100%', // Ensure full height to center the icon vertically
  },
  spacedItem: {
    marginTop: 48, // Add top margin to create space
  },
});
