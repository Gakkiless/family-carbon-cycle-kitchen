'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addDays, toDateKey } from '@/src/algorithms/carbonCycle'
import { generateMenuDay, replaceOne } from '@/src/algorithms/menuGenerator'
import { ingredientMap } from '@/src/data/ingredients'
import type { IngredientCategory, InventoryItem, MenuDay } from '@/src/types'

interface AppState {
  menus: MenuDay[]
  inventory: InventoryItem[]
  favorites: string[]
  recentRecipeIds: string[]
  checkedPurchases: string[]
  initialized: boolean
  initialize: () => void
  regenerateMenu: (index:number) => void
  replaceRecipe: (menuIndex:number, recipeId:string) => void
  toggleLock: (menuIndex:number, recipeId:string) => void
  toggleFavorite: (recipeId:string) => void
  togglePurchased: (ingredientId:string) => void
  clearPurchased: () => void
  addInventory: (item:Omit<InventoryItem,'id'>) => void
  updateInventory: (id:string, item:Partial<InventoryItem>) => void
  removeInventory: (id:string) => void
}

function expiry(days:number) {
  return toDateKey(addDays(new Date(),days))
}

const defaultInventory: InventoryItem[] = [
  ['egg',6,'个',7,false,''],['tomato',600,'g',4,true,'优先用掉较熟的番茄'],['potato',500,'g',14,false,''],['lettuce',300,'g',2,true,''],
  ['chicken-breast',400,'g',2,true,'冷藏'],['cod',300,'g',3,false,'冷冻'],['oats',500,'g',60,false,''],['seaweed',1,'袋',90,false,''],
  ['soy-sauce',500,'ml',180,false,'约 1 瓶'],['cooking-oil',1000,'ml',180,false,'约 1 瓶'],
].map(([ingredientId,amount,unit,days,priority,note],index) => {
  const master = ingredientMap[String(ingredientId)]
  return { id:`demo-${index}`,ingredientId:String(ingredientId),name:master.name,amount:Number(amount),unit:String(unit),category:master.category,expiryDate:expiry(Number(days)),priority:Boolean(priority),note:String(note) }
})

function initialMenus(inventory: InventoryItem[]) {
  const today = new Date()
  const first = generateMenuDay(today,inventory)
  const second = generateMenuDay(addDays(today,1),inventory,first.recipeIds,first.recipeIds)
  return [first,second]
}

export const useAppStore = create<AppState>()(persist((set,get) => ({
  menus:[],inventory:defaultInventory,favorites:[],recentRecipeIds:[],checkedPurchases:[],initialized:false,
  initialize:() => {
    const state = get()
    const today = new Date()
    const todayKey = toDateKey(today)
    const tomorrowKey = toDateKey(addDays(today,1))
    let menus = state.menus
    if (!menus.length) menus = initialMenus(state.inventory)
    else if (menus[0]?.date !== todayKey) {
      if (menus[1]?.date === todayKey) {
        const todayMenu = menus[1]
        const tomorrowMenu = generateMenuDay(addDays(today,1),state.inventory,state.recentRecipeIds,todayMenu.recipeIds)
        menus = [todayMenu,tomorrowMenu]
      } else menus = initialMenus(state.inventory)
    } else if (menus[1]?.date !== tomorrowKey) {
      menus = [menus[0],generateMenuDay(addDays(today,1),state.inventory,state.recentRecipeIds,menus[0].recipeIds)]
    }
    set({ menus,initialized:true,recentRecipeIds:[...state.recentRecipeIds,...menus.flatMap(menu => menu.recipeIds)].slice(-40) })
  },
  regenerateMenu:(index) => set(state => {
    const current = state.menus[index]
    if (!current) return state
    const paired = state.menus[index === 0 ? 1 : 0]?.recipeIds ?? []
    const next = generateMenuDay(new Date(`${current.date}T12:00:00`),state.inventory,state.recentRecipeIds,paired,current)
    const menus = [...state.menus]
    menus[index] = next
    return { menus,recentRecipeIds:[...state.recentRecipeIds,...next.recipeIds].slice(-40) }
  }),
  replaceRecipe:(menuIndex,recipeId) => set(state => {
    const menus = [...state.menus]
    const next = replaceOne(menus[menuIndex],recipeId,state.inventory,state.recentRecipeIds)
    menus[menuIndex] = next
    const replacement = next.recipeIds.find(id => !state.menus[menuIndex].recipeIds.includes(id))
    return { menus,recentRecipeIds:replacement ? [...state.recentRecipeIds,replacement].slice(-40) : state.recentRecipeIds }
  }),
  toggleLock:(menuIndex,recipeId) => set(state => {
    const menus = [...state.menus]
    const menu = menus[menuIndex]
    const lockedIds = menu.lockedIds.includes(recipeId) ? menu.lockedIds.filter(id => id !== recipeId) : [...menu.lockedIds,recipeId]
    menus[menuIndex] = { ...menu,lockedIds }
    return { menus }
  }),
  toggleFavorite:(recipeId) => set(state => ({ favorites:state.favorites.includes(recipeId) ? state.favorites.filter(id => id !== recipeId) : [...state.favorites,recipeId] })),
  togglePurchased:(ingredientId) => set(state => ({ checkedPurchases:state.checkedPurchases.includes(ingredientId) ? state.checkedPurchases.filter(id => id !== ingredientId) : [...state.checkedPurchases,ingredientId] })),
  clearPurchased:() => set({ checkedPurchases:[] }),
  addInventory:(item) => set(state => ({ inventory:[...state.inventory,{...item,id:`inv-${Date.now()}-${Math.random().toString(36).slice(2,6)}`}]})),
  updateInventory:(id,item) => set(state => ({ inventory:state.inventory.map(current => current.id === id ? {...current,...item} : current) })),
  removeInventory:(id) => set(state => ({ inventory:state.inventory.filter(item => item.id !== id) })),
}),{
  name:'family-carbon-kitchen-v1',
  partialize:state => ({ menus:state.menus,inventory:state.inventory,favorites:state.favorites,recentRecipeIds:state.recentRecipeIds,checkedPurchases:state.checkedPurchases }),
}))

export const inventoryCategories: IngredientCategory[] = ['meat','seafood','egg-tofu','staple','vegetable','mushroom','fruit','seasoning','other']
