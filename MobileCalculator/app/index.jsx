import { Redirect } from 'expo-router';

export default function Index() {
  // Простой редирект без useEffect
  return <Redirect href="/tabs/" />;
}