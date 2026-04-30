export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: 'soups' | 'stews' | 'combos' | 'lunch' | 'rice-pasta';
  size?: string;
  moq?: number; // For the lunch packs
}