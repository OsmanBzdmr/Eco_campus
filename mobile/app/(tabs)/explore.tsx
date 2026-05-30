import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">EcoCampus</ThemedText>
      <ThemedText>Sürdürülebilir Kampüs Pazaryeri 🌿</ThemedText>
      <ThemedText style={styles.sub}>
        Öğrencilerin eşya paylaştığı, israfı azaltan bir platform.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 },
  sub: { textAlign: 'center', opacity: 0.7 },
});