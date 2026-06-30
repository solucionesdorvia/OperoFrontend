import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      // Mostrar todas las páginas si son 7 o menos
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Mostrar páginas alrededor de la actual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Siempre mostrar última página
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.arrowBtn, currentPage === 1 && styles.arrowBtnDisabled]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="chevron-left"
          size={20}
          color={currentPage === 1 ? COLORS.outline : COLORS.onSurface}
        />
      </TouchableOpacity>

      <View style={styles.pagesContainer}>
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <View key={`ellipsis-${index}`} style={styles.ellipsis}>
                <Text style={styles.ellipsisText}>...</Text>
              </View>
            );
          }

          const isActive = page === currentPage;
          return (
            <TouchableOpacity
              key={page}
              style={[styles.pageBtn, isActive && styles.pageBtnActive]}
              onPress={() => onPageChange(page)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pageText, isActive && styles.pageTextActive]}>
                {page}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.arrowBtn, currentPage === totalPages && styles.arrowBtnDisabled]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name="chevron-right"
          size={20}
          color={currentPage === totalPages ? COLORS.outline : COLORS.onSurface}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnDisabled: {
    opacity: 0.4,
  },
  pagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pageBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pageText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.monoMedium,
    color: COLORS.onSurfaceVariant,
  },
  pageTextActive: {
    color: COLORS.onPrimary,
    fontFamily: FONTS.family.monoSemiBold,
  },
  ellipsis: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipsisText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.mono,
    color: COLORS.onSurfaceVariant,
  },
});
