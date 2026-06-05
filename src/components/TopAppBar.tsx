import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';
import { styles } from './TopAppBar.styles';
import { useAuth } from '../context/AuthContext';

const logo = require('../../assets/operologo.png');

type RightIconName = 'notifications' | 'search' | 'share' | 'more_vert' | 'settings';

export type TopAppBarAction = {
  icon: RightIconName;
  onPress?: () => void;
};

type TopAppBarProps = {
  title?: string;
  onBack?: () => void;
  // Compatibilidad: ícono único a la derecha (caso simple).
  rightIcon?: RightIconName | null;
  onRightPress?: () => void;
  // Múltiples acciones a la derecha (notificaciones + perfil, etc.).
  rightActions?: TopAppBarAction[];
  showAvatar?: boolean;
  // Callback opcional cuando se tapea el avatar (típicamente: ir al perfil).
  onAvatarPress?: () => void;
  showLogo?: boolean;
};

const iconMap: Record<RightIconName, keyof typeof MaterialIcons.glyphMap> = {
  notifications: 'notifications-none',
  search: 'search',
  share: 'share',
  more_vert: 'more-horiz',
  settings: 'settings',
};

function getInitials(fullName: string | undefined): string {
  if (!fullName) return '??';
  const names = fullName.trim().split(' ');
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

function renderAvatar({
  showAvatar,
  onAvatarPress,
  userFullName,
}: {
  showAvatar?: boolean;
  onAvatarPress?: () => void;
  userFullName?: string;
}) {
  if (!showAvatar) return null;
  const initials = getInitials(userFullName);

  if (onAvatarPress) {
    return (
      <TouchableOpacity onPress={onAvatarPress} style={styles.avatar} activeOpacity={0.7}>
        <Text style={styles.avatarText}>{initials}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

export default function TopAppBar({
  title,
  onBack,
  rightIcon,
  onRightPress,
  rightActions,
  showAvatar,
  onAvatarPress,
  showLogo,
}: TopAppBarProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Si vino rightActions, usamos esa lista. Si vino el rightIcon legacy, lo convertimos.
  let actions: TopAppBarAction[] = [];
  if (rightActions) {
    actions = rightActions;
  } else if (rightIcon) {
    actions = [{ icon: rightIcon, onPress: onRightPress }];
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="arrow-back" size={22} color={COLORS.onSurface} />
          </TouchableOpacity>
        ) : null}
        {showLogo ? (
          <View style={styles.logoRow}>
            <Image source={logo} style={styles.logoImg} />
            <Text style={styles.logoText}>Opero</Text>
          </View>
        ) : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>
      <View style={styles.right}>
        {actions.map((action, i) => (
          <TouchableOpacity
            key={`${action.icon}-${i}`}
            onPress={action.onPress}
            style={styles.iconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name={iconMap[action.icon]} size={22} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        ))}
        {renderAvatar({ showAvatar, onAvatarPress, userFullName: user?.fullName })}
      </View>
    </View>
  );
}
