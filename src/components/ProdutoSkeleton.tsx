import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { Colors, Radius, Spacing } from '../constants/theme';

export function ProdutoSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        <Skeleton width={48} height={48} borderRadius={Radius.md} style={styles.image} />
        <View style={styles.info}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="35%" height={11} style={{ marginTop: Spacing[2] }} />
        </View>
      </View>
      <Skeleton width={56} height={24} borderRadius={Radius.full} />
    </View>
  );
}

export function ProdutoSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProdutoSkeleton key={i} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    marginRight: Spacing[3],
  },
  info: {
    flex: 1,
    marginRight: Spacing[2],
  },
});
