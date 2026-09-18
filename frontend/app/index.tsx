import React from 'react';
import { Redirect } from 'expo-router';
import { useApp } from '@/context/AppContext';

export default function RootIndex() {
  const { currentUser, isLoading } = useApp();

  // Wait for bootstrap auth check to complete
  if (isLoading) {
    return null;
  }

  // If user is already signed in, enter Dashboard
  if (currentUser) {
    return <Redirect href="/(tabs)" />;
  }

  // If logged out, enter Landing / Splash directly
  return <Redirect href="/splash" />;
}
