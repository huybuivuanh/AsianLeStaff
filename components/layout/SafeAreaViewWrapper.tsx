import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaViewWrapperProps extends ViewProps {
  children: ReactNode;
  backgroundColor?: string;
  className?: string;
}

export default function SafeAreaViewWrapper({
  children,
  style,
  backgroundColor = 'white',
  className,
  ...props
}: SafeAreaViewWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor,
        },
        style,
      ]}
      className={className}
      {...props}>
      {children}
    </View>
  );
}
