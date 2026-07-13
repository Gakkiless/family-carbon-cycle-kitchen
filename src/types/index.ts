export type CarbonDayType = 'high' | 'medium' | 'low'
export type CuisineType = 'chinese' | 'japanese' | 'mediterranean'
export type DishType = 'main' | 'vegetable' | 'staple' | 'soup'
export type IngredientCategory = 'meat' | 'seafood' | 'egg-tofu' | 'staple' | 'vegetable' | 'mushroom' | 'fruit' | 'seasoning' | 'other'

export interface RecipeIngredient {
  ingredientId: string
  name: string
  amountForThree: number
  unit: string
  category: IngredientCategory
  optional?: boolean
  note?: string
}

export interface Recipe {
  id: string
  name: string
  cuisine: CuisineType
  dishType: DishType
  suitableCarbonDays: CarbonDayType[]
  ingredients: RecipeIngredient[]
  preparation: string[]
  steps: string[]
  prepMinutes: number
  cookMinutes: number
  difficulty: 'easy' | 'medium'
  cookware: string[]
  tags: string[]
  substitutions: string[]
  elderlyTips: string[]
  storageTips: string[]
  suitableForLunchBox: boolean
  needsOven?: boolean
  goodForMealPrep?: boolean
}

export interface Ingredient {
  id: string
  name: string
  aliases: string[]
  category: IngredientCategory
  defaultUnit: string
  commonPurchaseUnit: string
  purchaseRounding?: number
}

export interface InventoryItem {
  id: string
  ingredientId: string
  name: string
  amount: number
  unit: string
  category: IngredientCategory
  expiryDate: string
  priority: boolean
  note: string
}

export interface MenuDay {
  date: string
  carbonType: CarbonDayType
  recipeIds: string[]
  lockedIds: string[]
}

export interface ShoppingItem {
  ingredientId: string
  name: string
  category: IngredientCategory
  unit: string
  required: number
  inStock: number
  toBuy: number
  suggestedPurchase: number
  usedIn: string[]
}
