import { recipes, recipeMap } from '@/src/data/recipes'
import type { CarbonDayType, DishType, InventoryItem, MenuDay, Recipe } from '@/src/types'
import { carbonTypeForDate, toDateKey } from './carbonCycle'
import { scoreRecipe } from './menuScoring'

function hash(text: string): number {
  return [...text].reduce((total,char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 17)
}

function structure(type: CarbonDayType, dateKey: string): DishType[] {
  if (type === 'high') return hash(dateKey) % 2 ? ['main','vegetable','staple','soup'] : ['main','vegetable','staple']
  if (type === 'medium') return hash(dateKey) % 3 === 0 ? ['main','vegetable','vegetable','staple','soup'] : ['main','vegetable','staple']
  return hash(dateKey) % 3 === 0 ? ['main','vegetable','vegetable','staple'] : hash(dateKey) % 2 ? ['main','vegetable','vegetable','soup'] : ['main','vegetable','vegetable']
}

function pick(type: CarbonDayType, dishType: DishType, inventory: InventoryItem[], selected: Recipe[], paired: Recipe[], recent: string[], seed: string): Recipe {
  const selectedIds = new Set(selected.map(item => item.id))
  const candidates = recipes.filter(recipe => recipe.dishType === dishType && recipe.suitableCarbonDays.includes(type) && !selectedIds.has(recipe.id))
  const ranked = candidates.map(recipe => ({ recipe, score:scoreRecipe(recipe, inventory, [...paired,...selected], recent) + (hash(seed + recipe.id) % 9) }))
    .sort((a,b) => b.score - a.score)
  return ranked[0]?.recipe ?? candidates[0]
}

export function generateMenuDay(date: Date, inventory: InventoryItem[], recent: string[] = [], pairedRecipeIds: string[] = [], preserved?: MenuDay): MenuDay {
  const dateKey = toDateKey(date)
  const carbonType = carbonTypeForDate(date)
  const paired = pairedRecipeIds.map(id => recipeMap[id]).filter(Boolean)
  const locked = preserved?.lockedIds ?? []
  const selected = preserved?.recipeIds.filter(id => locked.includes(id)).map(id => recipeMap[id]).filter(Boolean) ?? []
  const requested = new Map<DishType,number>()
  for (const dishType of structure(carbonType,dateKey)) {
    const targetCount = (requested.get(dishType) ?? 0) + 1
    requested.set(dishType,targetCount)
    if (selected.filter(recipe => recipe.dishType === dishType).length >= targetCount) continue
    selected.push(pick(carbonType,dishType,inventory,selected,paired,recent,dateKey))
  }
  return { date:dateKey, carbonType, recipeIds:selected.map(item => item.id), lockedIds:locked.filter(id => selected.some(recipe => recipe.id === id)) }
}

export function replaceOne(menu: MenuDay, recipeId: string, inventory: InventoryItem[], recent: string[]): MenuDay {
  if (menu.lockedIds.includes(recipeId)) return menu
  const current = recipeMap[recipeId]
  if (!current) return menu
  const other = menu.recipeIds.filter(id => id !== recipeId).map(id => recipeMap[id]).filter(Boolean)
  const candidates = recipes.filter(recipe => recipe.dishType === current.dishType && recipe.suitableCarbonDays.includes(menu.carbonType) && !menu.recipeIds.includes(recipe.id) && !recent.slice(-12).includes(recipe.id))
  const currentIngredients = new Set(current.ingredients.map(i => i.ingredientId))
  const replacement = candidates.map(recipe => ({
    recipe,
    score:scoreRecipe(recipe,inventory,other,recent) + recipe.ingredients.filter(i => currentIngredients.has(i.ingredientId)).length * 8,
  })).sort((a,b) => b.score - a.score)[0]?.recipe
  if (!replacement) return menu
  return { ...menu, recipeIds:menu.recipeIds.map(id => id === recipeId ? replacement.id : id) }
}
