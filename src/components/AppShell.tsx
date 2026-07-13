'use client'

import { BookOpen, CalendarDays, House, ShoppingBasket } from 'lucide-react'
import { useEffect, useState } from 'react'
import { InventoryPage } from '@/src/views/InventoryPage'
import { LibraryPage } from '@/src/views/LibraryPage'
import { MenuPage } from '@/src/views/MenuPage'
import { ShoppingPage } from '@/src/views/ShoppingPage'
import { useAppStore } from '@/src/stores/useAppStore'
import type { Recipe } from '@/src/types'
import { RecipeDetail } from './RecipeDetail'

type Tab = 'menu' | 'shopping' | 'inventory' | 'library'
const tabs: Array<[Tab,string,typeof CalendarDays]> = [['menu','菜单',CalendarDays],['shopping','采购',ShoppingBasket],['inventory','库存',House],['library','菜谱',BookOpen]]

export function AppShell() {
  const [tab,setTab] = useState<Tab>('menu')
  const [selectedRecipe,setSelectedRecipe] = useState<Recipe | null>(null)
  const initialize = useAppStore(state => state.initialize)
  const initialized = useAppStore(state => state.initialized)
  const favorites = useAppStore(state => state.favorites)
  const toggleFavorite = useAppStore(state => state.toggleFavorite)
  useEffect(() => initialize(),[initialize])
  if (!initialized) return <main className="mx-auto flex min-h-dvh max-w-[520px] items-center justify-center bg-[#f7f5ef]"><div className="text-center"><div className="mx-auto h-8 w-8 animate-pulse rounded-full bg-[#ced7c7]"/><p className="mt-3 text-sm text-stone-400">正在准备两日晚餐…</p></div></main>
  return <main className="mx-auto min-h-dvh max-w-[520px] bg-[#f7f5ef] shadow-[0_0_60px_rgba(54,50,42,.08)]">
    {tab === 'menu' && <MenuPage onOpenRecipe={setSelectedRecipe}/>} {tab === 'shopping' && <ShoppingPage/>} {tab === 'inventory' && <InventoryPage/>} {tab === 'library' && <LibraryPage onOpenRecipe={setSelectedRecipe}/>} 
    <nav className="bottom-nav" aria-label="主要导航">{tabs.map(([value,label,Icon]) => <button key={value} onClick={() => setTab(value)} className={`nav-item ${tab === value ? 'active' : ''}`} aria-current={tab === value ? 'page' : undefined}><Icon size={20} strokeWidth={tab === value ? 2.2 : 1.8}/><span>{label}</span></button>)}</nav>
    {selectedRecipe && <RecipeDetail recipe={selectedRecipe} favorite={favorites.includes(selectedRecipe.id)} onFavorite={() => toggleFavorite(selectedRecipe.id)} onClose={() => setSelectedRecipe(null)}/>} 
  </main>
}
