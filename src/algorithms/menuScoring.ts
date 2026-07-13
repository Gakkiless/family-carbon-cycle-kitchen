import type { InventoryItem, Recipe } from '@/src/types'

function normalizedInventory(inventory: InventoryItem[]) {
  return new Map(inventory.map(item => [item.ingredientId, item]))
}

export function scoreRecipe(recipe: Recipe, inventory: InventoryItem[], pairedRecipes: Recipe[] = [], recentIds: string[] = []): number {
  const stock = normalizedInventory(inventory)
  const carbonMatch = 35
  const useful = recipe.ingredients.filter(i => stock.has(i.ingredientId))
  const inventoryUse = Math.min(25, useful.reduce((sum, item) => {
    const owned = stock.get(item.ingredientId)!
    const expiryDays = Math.ceil((new Date(owned.expiryDate).getTime() - Date.now()) / 86400000)
    return sum + 4 + (owned.priority ? 4 : 0) + (expiryDays <= 3 ? 3 : 0)
  }, 0))
  const pairedIds = new Set(pairedRecipes.flatMap(item => item.ingredients.map(i => i.ingredientId)))
  const reuseCount = recipe.ingredients.filter(i => pairedIds.has(i.ingredientId) && i.category !== 'seasoning' && i.category !== 'other').length
  const reuse = Math.min(20, reuseCount * 5)
  const variety = pairedRecipes.every(item => item.cuisine !== recipe.cuisine) ? 10 : 5
  const convenience = recipe.difficulty === 'easy' ? 10 : 7
  const recentPenalty = recentIds.includes(recipe.id) ? 25 : 0
  return carbonMatch + inventoryUse + reuse + variety + convenience - recentPenalty
}
