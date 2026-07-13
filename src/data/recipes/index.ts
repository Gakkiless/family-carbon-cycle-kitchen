import { chineseRecipes } from './chinese'
import { japaneseRecipes } from './japanese'
import { mediterraneanRecipes } from './mediterranean'
import { stapleRecipes } from '../staples'

export const recipes = [...chineseRecipes, ...japaneseRecipes, ...mediterraneanRecipes, ...stapleRecipes]
export const recipeMap = Object.fromEntries(recipes.map(recipe => [recipe.id, recipe]))

export const recipeStats = {
  total: recipes.length,
  chinese: chineseRecipes.length,
  japanese: japaneseRecipes.length,
  mediterranean: mediterraneanRecipes.length,
  soupsAndStaples: recipes.filter(recipe => recipe.dishType === 'soup' || recipe.dishType === 'staple').length,
}
