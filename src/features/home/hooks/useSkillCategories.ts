import { useCallback, useState } from 'react';
import { ABOUT_CATEGORIES } from '../data/about';

export function useSkillCategories() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const handleSelectCategory = useCallback(
    (index: number) => {
      if (index === activeCategoryIndex) return;

      setIsPanelVisible(false);
      window.setTimeout(() => {
        setActiveCategoryIndex(index);
        setIsPanelVisible(true);
      }, 150);
    },
    [activeCategoryIndex],
  );

  const handleNextCategory = useCallback(() => {
    handleSelectCategory((activeCategoryIndex + 1) % ABOUT_CATEGORIES.length);
  }, [activeCategoryIndex, handleSelectCategory]);

  const handlePrevCategory = useCallback(() => {
    handleSelectCategory(
      (activeCategoryIndex - 1 + ABOUT_CATEGORIES.length) % ABOUT_CATEGORIES.length,
    );
  }, [activeCategoryIndex, handleSelectCategory]);

  const activeCategory = ABOUT_CATEGORIES[activeCategoryIndex];

  return {
    activeCategoryIndex,
    activeCategory,
    isPanelVisible,
    handleSelectCategory,
    handleNextCategory,
    handlePrevCategory,
  };
}
