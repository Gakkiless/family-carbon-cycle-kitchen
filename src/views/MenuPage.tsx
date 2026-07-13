'use client'

import { CalendarDays, Check, ChevronRight, Clock3, Heart, Lock, RefreshCw, Sparkles, Unlock } from 'lucide-react'
import { carbonDescriptions, carbonLabels, formatChineseDate, fromDateKey, weekdayLabel } from '@/src/algorithms/carbonCycle'
import { recipeMap } from '@/src/data/recipes'
import type { Recipe } from '@/src/types'
import { totalMinutes } from '@/src/utils/format'
import { useAppStore } from '@/src/stores/useAppStore'

const cuisineLabels = { chinese:'中式', japanese:'日式', mediterranean:'地中海' }
const dishLabels = { main:'主菜', vegetable:'蔬菜', staple:'主食', soup:'汤品' }

export function MenuPage({ onOpenRecipe }:{onOpenRecipe:(recipe:Recipe)=>void}) {
  const menus = useAppStore(state => state.menus)
  const favorites = useAppStore(state => state.favorites)
  const regenerateMenu = useAppStore(state => state.regenerateMenu)
  const replaceRecipe = useAppStore(state => state.replaceRecipe)
  const toggleLock = useAppStore(state => state.toggleLock)
  const toggleFavorite = useAppStore(state => state.toggleFavorite)
  if (!menus.length) return null
  return <div className="page-wrap pb-28">
    <header className="px-5 pb-5 pt-7">
      <div className="mb-4 flex items-start justify-between">
        <div><p className="text-xs tracking-[.18em] text-[#849079]">FAMILY KITCHEN</p><h1 className="font-serif-cn mt-1 text-[30px] text-[#31352f]">今晚吃什么</h1></div>
        <div className="rounded-full bg-[#e8ece3] p-3 text-[#62705a]"><CalendarDays size={21}/></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {menus.map((menu,index) => {
          const date = fromDateKey(menu.date)
          return <div key={menu.date} className={`date-summary carbon-card-${menu.carbonType}`}>
            <p className="text-[11px] text-stone-500">{index === 0 ? '今天' : '明天'} · {weekdayLabel(date)}</p>
            <p className="mt-1 text-base font-semibold text-stone-700">{formatChineseDate(date)}</p>
            <span className={`mt-3 inline-flex soft-tag carbon-${menu.carbonType}`}>{carbonLabels[menu.carbonType]}</span>
          </div>
        })}
      </div>
    </header>

    <div className="space-y-5 px-4">
      {menus.map((menu,menuIndex) => {
        const date = fromDateKey(menu.date)
        const menuRecipes = menu.recipeIds.map(id => recipeMap[id]).filter(Boolean)
        return <section key={menu.date} className="menu-card">
          <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5">
            <div><div className="flex items-center gap-2"><span className={`soft-tag carbon-${menu.carbonType}`}>{carbonLabels[menu.carbonType]}</span><span className="text-xs text-stone-400">{formatChineseDate(date)}</span></div><h2 className="font-serif-cn mt-2 text-[23px] text-[#353832]">{menuIndex === 0 ? '今天晚餐' : '明天晚餐'}</h2><p className="mt-1 text-xs text-stone-500">{carbonDescriptions[menu.carbonType]}</p></div>
            <button className="secondary-button shrink-0" onClick={() => regenerateMenu(menuIndex)}><RefreshCw size={15}/>换整套</button>
          </div>
          <div className="border-t border-[#ebe6dc]">
            {menuRecipes.map(recipe => {
              const locked = menu.lockedIds.includes(recipe.id)
              const favorite = favorites.includes(recipe.id)
              return <article key={recipe.id} className="border-b border-[#eeeae1] px-5 py-4 last:border-0">
                <button className="w-full text-left" onClick={() => onOpenRecipe(recipe)}>
                  <div className="mb-2 flex items-center gap-2"><span className="rounded-md bg-[#f0eee7] px-2 py-1 text-[10px] font-semibold text-[#77776f]">{dishLabels[recipe.dishType]}</span><span className="text-[11px] text-stone-400">{cuisineLabels[recipe.cuisine]}</span>{recipe.needsOven && <span className="text-[11px] text-stone-400">· 需烤箱</span>}</div>
                  <div className="flex items-center justify-between gap-3"><h3 className="text-[17px] font-semibold text-[#3f423c]">{recipe.name}</h3><ChevronRight className="shrink-0 text-stone-300" size={18}/></div>
                  <p className="mt-2 line-clamp-1 text-xs text-stone-500">{recipe.ingredients.filter(i => !['seasoning','other'].includes(i.category)).slice(0,4).map(i => i.name).join(' · ')}</p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-400"><span className="inline-flex items-center gap-1"><Clock3 size={13}/>{totalMinutes(recipe.prepMinutes,recipe.cookMinutes)} 分钟</span><span>{recipe.difficulty === 'easy' ? '简单' : '中等'}</span>{recipe.goodForMealPrep && <span className="inline-flex items-center gap-1"><Check size={12}/>可提前备菜</span>}</div>
                </button>
                <div className="mt-3 flex items-center gap-2">
                  <button className={`mini-action ${locked ? 'active' : ''}`} onClick={() => toggleLock(menuIndex,recipe.id)}>{locked ? <Lock size={14}/> : <Unlock size={14}/>} {locked ? '已保留' : '保留'}</button>
                  <button className="mini-action" onClick={() => replaceRecipe(menuIndex,recipe.id)} disabled={locked}><RefreshCw size={14}/>替换</button>
                  <button className={`mini-action ${favorite ? 'favorite' : ''}`} onClick={() => toggleFavorite(recipe.id)}><Heart size={14} fill={favorite ? 'currentColor' : 'none'}/>{favorite ? '已收藏' : '收藏'}</button>
                </div>
              </article>
            })}
          </div>
          <button className="mx-5 mb-5 mt-1 flex w-[calc(100%-40px)] items-center justify-center gap-2 rounded-xl bg-[#6f7d65] py-3 text-sm font-medium text-white" onClick={() => onOpenRecipe(menuRecipes[0])}><Sparkles size={16}/>查看主菜完整做法</button>
        </section>
      })}
    </div>
  </div>
}
