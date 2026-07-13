'use client'

import { BookOpen, ChevronRight, Clock3, Heart, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { carbonLabels } from '@/src/algorithms/carbonCycle'
import { recipes, recipeStats } from '@/src/data/recipes'
import { useAppStore } from '@/src/stores/useAppStore'
import type { CuisineType, Recipe } from '@/src/types'

type Filter = 'all' | CuisineType | 'favorites'
const filters: Array<[Filter,string]> = [['all','全部'],['chinese','中式'],['japanese','日式'],['mediterranean','地中海'],['favorites','收藏']]
const cuisineLabels = { chinese:'中式家常', japanese:'日式家庭', mediterranean:'地中海风格' }

export function LibraryPage({onOpenRecipe}:{onOpenRecipe:(recipe:Recipe)=>void}) {
  const favorites = useAppStore(state => state.favorites)
  const toggleFavorite = useAppStore(state => state.toggleFavorite)
  const [filter,setFilter] = useState<Filter>('all')
  const [query,setQuery] = useState('')
  const results = useMemo(() => recipes.filter(recipe => {
    if (filter === 'favorites' && !favorites.includes(recipe.id)) return false
    if (!['all','favorites'].includes(filter) && recipe.cuisine !== filter) return false
    const haystack = [recipe.name,...recipe.tags,...recipe.ingredients.map(item => item.name)].join('')
    return haystack.includes(query.trim())
  }),[filter,query,favorites])

  return <div className="page-wrap px-4 pb-28 pt-7">
    <header className="px-1"><p className="text-xs tracking-[.18em] text-[#849079]">RECIPE LIBRARY</p><div className="mt-1 flex items-end justify-between"><div><h1 className="font-serif-cn text-[30px] text-[#31352f]">家庭菜谱库</h1><p className="mt-1 text-sm text-stone-500">{recipeStats.total} 道完整三人份菜谱</p></div><div className="rounded-full bg-[#f4e8da] p-3 text-[#a36b45]"><BookOpen size={21}/></div></div></header>
    <div className="relative mt-5"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18}/><input value={query} onChange={event => setQuery(event.target.value)} className="w-full rounded-2xl border border-[#e5dfd4] bg-white py-3.5 pl-11 pr-4 text-sm outline-none placeholder:text-stone-300 focus:border-[#9aa58f]" placeholder="搜索菜名或食材"/></div>
    <div className="hide-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2">{filters.map(([value,label]) => <button key={value} onClick={() => setFilter(value)} className={`shrink-0 rounded-full px-4 py-2 text-xs ${filter === value ? 'bg-[#68765f] text-white' : 'border border-[#e4dfd5] bg-white text-stone-500'}`}>{label}</button>)}</div>
    <div className="mt-3 space-y-3">{results.map(recipe => {
      const favorite = favorites.includes(recipe.id)
      return <article key={recipe.id} className="rounded-[20px] border border-[#e8e2d7] bg-white p-4"><button className="w-full text-left" onClick={() => onOpenRecipe(recipe)}><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[11px] text-stone-400">{cuisineLabels[recipe.cuisine]} · {recipe.dishType === 'main' ? '主菜' : recipe.dishType === 'vegetable' ? '蔬菜' : recipe.dishType === 'staple' ? '主食' : '汤品'}</p><h2 className="mt-1 text-[17px] font-semibold text-[#3d403a]">{recipe.name}</h2></div><ChevronRight className="mt-3 shrink-0 text-stone-300" size={18}/></div><p className="mt-2 line-clamp-1 text-xs text-stone-500">{recipe.ingredients.filter(item => !['seasoning','other'].includes(item.category)).slice(0,4).map(item => item.name).join(' · ')}</p><div className="mt-3 flex items-center gap-3 text-[11px] text-stone-400"><span className="inline-flex items-center gap-1"><Clock3 size={13}/>{recipe.prepMinutes+recipe.cookMinutes} 分钟</span>{recipe.suitableCarbonDays.map(type => <span key={type} className={`soft-tag carbon-${type}`}>{carbonLabels[type]}</span>)}</div></button><button className={`absolute hidden ${favorite ? 'text-[#b16d42]' : ''}`} aria-label="收藏"/><button onClick={() => toggleFavorite(recipe.id)} className={`mt-3 flex items-center gap-1.5 text-xs ${favorite ? 'text-[#b16d42]' : 'text-stone-400'}`}><Heart size={14} fill={favorite ? 'currentColor':'none'}/>{favorite ? '已收藏':'加入收藏'}</button></article>
    })}</div>
    {!results.length && <div className="py-16 text-center text-sm text-stone-400">没有找到符合条件的菜谱</div>}
  </div>
}
