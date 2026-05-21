import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import HomeScreen from '../screens/student/HomeScreen';
import MyIncidentsScreen from '../screens/student/MyIncidentsScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import NotificationsScreen from '../screens/student/NotificationsScreen';
import IncidentDetailScreen from '../screens/student/IncidentDetailScreen';
import CreateIncidentScreen from '../screens/student/CreateIncidentScreen';
import ScanQRScreen from '../screens/student/ScanQRScreen';

import ManagerDashboardScreen from '../screens/manager/ManagerDashboardScreen';
import ManagerIncidentDetailScreen from '../screens/manager/ManagerIncidentDetailScreen';
import ManagerIncidentsListScreen from '../screens/manager/ManagerIncidentsListScreen';
import ManagerProfileScreen from '../screens/manager/ManagerProfileScreen';
import MyTeamScreen from '../screens/manager/MyTeamScreen';
import DepartmentSettingsScreen from '../screens/manager/DepartmentSettingsScreen';

import MaintenanceHomeScreen from '../screens/maintenance/MaintenanceHomeScreen';
import MaintenanceDetailScreen from '../screens/maintenance/MaintenanceDetailScreen';
import MaintenanceHistoryScreen from '../screens/maintenance/MaintenanceHistoryScreen';
import MaintenanceProfileScreen from '../screens/maintenance/MaintenanceProfileScreen';

import EditProfileScreen from '../screens/common/EditProfileScreen';

import type {
  RootStackParamList,
  StudentTabParamList,
  ManagerTabParamList,
  MaintenanceTabParamList,
} from '../types/navigation';
import { styles } from './AppNavigator.styles';

const Stack = createNativeStackNavigator<RootStackParamList>();
const StudentTab = createBottomTabNavigator<StudentTabParamList>();
const ManagerTab = createBottomTabNavigator<ManagerTabParamList>();
const MaintenanceTab = createBottomTabNavigator<MaintenanceTabParamList>();

type TabItem = { icon: keyof typeof MaterialIcons.glyphMap; label: string };

function CustomTabBar({ state, navigation, items }: any) {
  const insets = useSafeAreaInsets();
  const tabsMeta: TabItem[] = items;

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 6 }]}>
      {state.routes.map((route: any, i: number) => {
        const isFocused = state.index === i;
        const tab = tabsMeta[i];
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={tab.icon}
              size={22}
              color={isFocused ? COLORS.primary : COLORS.onSurfaceVariant}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const studentTabsMeta: TabItem[] = [
  { icon: 'home',       label: 'Inicio'      },
  { icon: 'assignment', label: 'Incidencias' },
];

function StudentTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  const renderTab = (routeIndex: number) => {
    const route = state.routes[routeIndex];
    const meta  = studentTabsMeta[routeIndex];
    const isFocused = state.index === routeIndex;
    return (
      <TouchableOpacity
        key={route.key}
        style={styles.tab}
        onPress={() => navigation.navigate(route.name)}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={meta.icon}
          size={22}
          color={isFocused ? COLORS.primary : COLORS.onSurfaceVariant}
        />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]} numberOfLines={1}>
          {meta.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.studentTabBar, { paddingBottom: insets.bottom + 6 }]}>
      {renderTab(0)}

      <View style={styles.scanSlot}>
        <TouchableOpacity
          style={styles.scanBtn}
          activeOpacity={0.85}
          onPress={() => navigation.getParent()?.navigate('ScanQR')}
        >
          <MaterialIcons name="qr-code-scanner" size={26} color={COLORS.onPrimary} />
        </TouchableOpacity>
        <Text style={styles.scanLabel}>Escanear</Text>
      </View>

      {renderTab(1)}
    </View>
  );
}

function StudentTabs() {
  return (
    <StudentTab.Navigator
      tabBar={(props) => <StudentTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <StudentTab.Screen name="StudentHome"      component={HomeScreen} />
      <StudentTab.Screen name="StudentIncidents" component={MyIncidentsScreen} />
    </StudentTab.Navigator>
  );
}

const managerTabs: TabItem[] = [
  { icon: 'dashboard',  label: 'Inicio'      },
  { icon: 'assignment', label: 'Incidencias' },
  { icon: 'groups',     label: 'Equipo'      },
  { icon: 'person',     label: 'Perfil'      },
];

function ManagerTabs() {
  return (
    <ManagerTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} items={managerTabs} />}
      screenOptions={{ headerShown: false }}
    >
      <ManagerTab.Screen name="ManagerHome"      component={ManagerDashboardScreen} />
      <ManagerTab.Screen name="ManagerIncidents" component={ManagerIncidentsListScreen} />
      <ManagerTab.Screen name="ManagerMyTeam"    component={MyTeamScreen} />
      <ManagerTab.Screen name="ManagerProfile"   component={ManagerProfileScreen} />
    </ManagerTab.Navigator>
  );
}

const maintenanceTabs: TabItem[] = [
  { icon: 'home',    label: 'Inicio'    },
  { icon: 'history', label: 'Historial' },
  { icon: 'person',  label: 'Perfil'    },
];

function MaintenanceTabs() {
  return (
    <MaintenanceTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} items={maintenanceTabs} />}
      screenOptions={{ headerShown: false }}
    >
      <MaintenanceTab.Screen name="MaintenanceHomeTab"   component={MaintenanceHomeScreen} />
      <MaintenanceTab.Screen name="MaintenanceHistory"   component={MaintenanceHistoryScreen} />
      <MaintenanceTab.Screen name="MaintenanceProfile"   component={MaintenanceProfileScreen} />
    </MaintenanceTab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login"      component={LoginScreen} />
        <Stack.Screen name="Register"   component={RegisterScreen} />

        <Stack.Screen name="StudentTabs"     component={StudentTabs} />
        <Stack.Screen name="ManagerTabs"     component={ManagerTabs} />
        <Stack.Screen name="MaintenanceTabs" component={MaintenanceTabs} />

        <Stack.Screen name="IncidentDetail"  component={IncidentDetailScreen} />
        <Stack.Screen name="CreateIncident"  component={CreateIncidentScreen} />
        <Stack.Screen
          name="ScanQR"
          component={ScanQRScreen}
          options={{ animation: 'slide_from_bottom' }}
        />

        {/* Notificaciones y Perfil del alumno — accedidas desde el TopAppBar */}
        <Stack.Screen name="StudentNotifications" component={NotificationsScreen} />
        <Stack.Screen name="StudentProfile"       component={ProfileScreen} />

        <Stack.Screen name="ManagerIncidentDetail" component={ManagerIncidentDetailScreen} />
        <Stack.Screen name="ManagerMyTeam"         component={MyTeamScreen} />
        <Stack.Screen name="DepartmentSettings"    component={DepartmentSettingsScreen} />

        <Stack.Screen name="MaintenanceDetail"  component={MaintenanceDetailScreen} />

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
