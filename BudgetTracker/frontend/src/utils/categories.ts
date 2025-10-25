export interface Category {
  name: string;
  icon: string;
  color: string;
}

export const expenseCategories: Category[] = [
  { name: 'Food & Dining', icon: '🍽️', color: '#EF4444' },
  { name: 'Shopping', icon: '🛍️', color: '#8B5CF6' },
  { name: 'Transportation', icon: '🚗', color: '#3B82F6' },
  { name: 'Entertainment', icon: '🎬', color: '#EC4899' },
  { name: 'Bills & Utilities', icon: '💡', color: '#10B981' },
  { name: 'Healthcare', icon: '🏥', color: '#06B6D4' },
  { name: 'Travel', icon: '✈️', color: '#F59E0B' },
  { name: 'Education', icon: '🎓', color: '#84CC16' },
  { name: 'Groceries', icon: '🛒', color: '#F97316' },
  { name: 'Personal Care', icon: '💇', color: '#6366F1' },
  { name: 'Gifts & Donations', icon: '🎁', color: '#EC4899' },
  { name: 'Home & Garden', icon: '🏠', color: '#14B8A6' },
  { name: 'Pets', icon: '🐾', color: '#84CC16' },
  { name: 'Other', icon: '📦', color: '#6B7280' },
];

export const incomeCategories: Category[] = [
  { name: 'Salary', icon: '💰', color: '#10B981' },
  { name: 'Freelance', icon: '💼', color: '#3B82F6' },
  { name: 'Investments', icon: '📈', color: '#8B5CF6' },
  { name: 'Bonus', icon: '🎯', color: '#F59E0B' },
  { name: 'Gifts', icon: '🎁', color: '#EC4899' },
  { name: 'Rental Income', icon: '🏠', color: '#84CC16' },
  { name: 'Refund', icon: '↩️', color: '#06B6D4' },
  { name: 'Other Income', icon: '💸', color: '#6B7280' },
];

export const allCategories = [...expenseCategories, ...incomeCategories];

export const getCategoryByType = (type: 'income' | 'expense') => {
  return type === 'income' ? incomeCategories : expenseCategories;
};

export const findCategory = (categoryName: string): Category | undefined => {
  return allCategories.find(cat => cat.name === categoryName);
};

export const getCategoryIcon = (categoryName: string): string => {
  return findCategory(categoryName)?.icon || '📦';
};

export const getCategoryColor = (categoryName: string): string => {
  return findCategory(categoryName)?.color || '#6B7280';
};