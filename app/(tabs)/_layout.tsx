import { isAccessCodeVerified } from '@/services/storageService';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function TabLayout() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!(await isAccessCodeVerified())) {
        router.replace('/access-code');
        return;
      }
      setIsAuthorized(true);
    };
    check();
  }, [router]);

  if (isAuthorized !== true) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
