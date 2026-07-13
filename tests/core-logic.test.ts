import assert from 'node:assert/strict'
import test from 'node:test'
import { carbonTypeForDate } from '../src/algorithms/carbonCycle'
import { generateMenuDay } from '../src/algorithms/menuGenerator'
import { buildShoppingList } from '../src/algorithms/shoppingList'
import { recipeMap, recipes, recipeStats } from '../src/data/recipes'
import type { InventoryItem } from '../src/types'

test('maps every weekday to the fixed carbon cycle', () => {
  const actual = Array.from({length:7},(_,index) => carbonTypeForDate(new Date(2026,6,13+index)))
  assert.deepEqual(actual,['medium','high','low','medium','high','low','medium'])
})

test('contains at least 90 complete recipes in the requested cuisines', () => {
  assert.equal(recipes.length,110)
  assert.ok(recipeStats.chinese >= 35)
  assert.ok(recipeStats.japanese >= 25)
  assert.ok(recipeStats.mediterranean >= 20)
  assert.ok(recipeStats.soupsAndStaples >= 10)
  for (const recipe of recipes) {
    assert.ok(recipe.ingredients.length >= 2,recipe.name)
    assert.ok(recipe.preparation.length >= 2,recipe.name)
    assert.ok(recipe.steps.length >= 5,recipe.name)
  }
})

test('always gives high days a staple and limits low-day starch', () => {
  for (let index=0; index<7; index++) {
    const menu = generateMenuDay(new Date(2026,6,13+index),[])
    const types = menu.recipeIds.map(id => recipeMap[id].dishType)
    if (menu.carbonType === 'high') assert.ok(types.includes('staple'))
    if (menu.carbonType === 'low') assert.ok(types.filter(type => type === 'staple').length <= 1)
  }
})

test('merges ingredient ids and deducts matching inventory', () => {
  const inventory: InventoryItem[] = [{id:'one',ingredientId:'chicken-breast',name:'鸡胸肉',amount:400,unit:'g',category:'meat',expiryDate:'2026-12-01',priority:false,note:''}]
  const list = buildShoppingList([{date:'2026-07-13',carbonType:'medium',recipeIds:['cn-05','jp-47'],lockedIds:[]}],inventory)
  const chicken = list.find(item => item.ingredientId === 'chicken-breast')
  assert.equal(chicken?.required,910)
  assert.equal(chicken?.inStock,400)
  assert.equal(chicken?.toBuy,510)
  assert.deepEqual(chicken?.usedIn,['香煎鸡胸肉','日式照烧鸡胸'])
})
