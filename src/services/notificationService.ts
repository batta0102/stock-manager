import * as Notifications from 'expo-notifications';

export async function notifyOutOfStockProducts(count: number): Promise<void> {
  if (count <= 0) return;

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Alerte stock',
        body:
          count === 1 ? '1 produit est en rupture de stock.' : `${count} produits sont en rupture de stock.`,
      },
      trigger: null,
    });
  } catch {
    // Expo Go a un support limité des notifications sur Android, on échoue silencieusement.
  }
}
