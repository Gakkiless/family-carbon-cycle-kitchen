import { ingredientMap } from '@/src/data/ingredients'
import { recipeMap } from '@/src/data/recipes'
import type { InventoryItem, MenuDay, ShoppingItem } from '@/src/types'

function convert(amount: number, unit: string, target: string): number {
  if (unit === target) return amount
  if (unit === 'kg' && target === 'g') return amount * 1000
  if (unit === 'g' && target === 'kg') return amount / 1000
  if (unit === 'L' && target === 'ml') return amount * 1000
  if (unit === 'ml' && target === 'L') return amount / 1000
  return 0
}

export function buildShoppingList(menus: MenuDay[], inventory: InventoryItem[]): ShoppingItem[] {
  const totals = new Map<string, { required:number; unit:string; usedIn:Set<string> }>()
  menus.flatMap(menu => menu.recipeIds).forEach(recipeId => {
    const recipe = recipeMap[recipeId]
    if (!recipe) return
    recipe.ingredients.filter(item => item.ingredientId !== 'water').forEach(item => {
      const current = totals.get(item.ingredientId) ?? { required:0, unit:item.unit, usedIn:new Set<string>() }
      current.required += convert(item.amountForThree,item.unit,current.unit) || item.amountForThree
      current.usedIn.add(recipe.name)
      totals.set(item.ingredientId,current)
    })
  })
  return [...totals.entries()].map(([ingredientId,total]) => {
    const master = ingredientMap[ingredientId]
    const inStock = inventory.filter(item => item.ingredientId === ingredientId).reduce((sum,item) => sum + convert(item.amount,item.unit,total.unit),0)
    const toBuy = Math.max(0,total.required - inStock)
    const rounding = master?.purchaseRounding ?? 1
    return { ingredientId,name:master?.name ?? ingredientId,category:master?.category ?? 'other',unit:total.unit,required:total.required,inStock,toBuy,suggestedPurchase:toBuy ? Math.ceil(toBuy / rounding) * rounding : 0,usedIn:[...total.usedIn] }
  }).sort((a,b) => a.category.localeCompare(b.category) || b.toBuy - a.toBuy)
}
