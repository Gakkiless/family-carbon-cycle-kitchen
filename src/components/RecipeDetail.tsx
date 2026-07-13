'use client'

import { ChefHat, Clock, CookingPot, Heart, Luggage, X } from 'lucide-react'
import { carbonLabels } from '@/src/algorithms/carbonCycle'
import type { Recipe } from '@/src/types'
import { formatAmount } from '@/src/utils/format'

const cuisine = { chinese:'中式家常', japanese:'日式家庭', mediterranean:'地中海风格' }

export function RecipeDetail({ recipe, favorite, onFavorite, onClose }:{ recipe:Recipe; favorite:boolean; onFavorite:()=>void; onClose:()=>void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/25 backdrop-blur-[2px]" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="detail-sheet hide-scrollbar max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[30px] bg-[#fbfaf6] shadow-2xl" role="dialog" aria-modal="true" aria-label={`${recipe.name}完整做法`}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e9e4d9] bg-[#fbfaf6]/95 px-5 py-4 backdrop-blur">
        <button onClick={onClose} className="icon-button" aria-label="关闭做法"><X size={20}/></button>
        <span className="text-sm text-stone-500">3 人份 · 全熟做法</span>
        <button onClick={onFavorite} className={`icon-button ${favorite ? 'text-[#ba6d3d]' : ''}`} aria-label="收藏菜谱"><Heart size={20} fill={favorite ? 'currentColor' : 'none'}/></button>
      </div>
      <div className="px-5 pb-10 pt-6">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="soft-tag bg-[#e9eee5] text-[#57664e]">{cuisine[recipe.cuisine]}</span>
          {recipe.suitableCarbonDays.map(type => <span key={type} className={`soft-tag carbon-${type}`}>{carbonLabels[type]}</span>)}
        </div>
        <h2 className="font-serif-cn text-[28px] leading-tight text-[#30332e]">{recipe.name}</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Info icon={<Clock/>} label="总时间" value={`${recipe.prepMinutes + recipe.cookMinutes} 分钟`}/>
          <Info icon={<ChefHat/>} label="难度" value={recipe.difficulty === 'easy' ? '简单' : '中等'}/>
          <Info icon={<Luggage/>} label="次日带饭" value={recipe.suitableForLunchBox ? '适合' : '不建议'}/>
        </div>

        <Section title="三人份食材">
          <div className="divide-y divide-[#ece7dc] rounded-2xl bg-white px-4">
            {recipe.ingredients.map(item => <div key={`${item.ingredientId}-${item.name}`} className="flex items-start justify-between gap-4 py-3 text-sm">
              <div><span className="text-[#3b3d38]">{item.name}</span>{item.optional && <span className="ml-2 text-xs text-stone-400">可选</span>}{item.note && <p className="mt-0.5 text-xs text-stone-400">{item.note}</p>}</div>
              <strong className="shrink-0 font-medium text-[#65735c]">{formatAmount(item.amountForThree)} {item.unit}</strong>
            </div>)}
          </div>
        </Section>

        <Section title="食材预处理">
          <ol className="space-y-3">{recipe.preparation.map((step,index) => <Step key={step} index={index+1} text={step}/>)}</ol>
        </Section>
        <Section title="详细步骤与火候">
          <ol className="space-y-4">{recipe.steps.map((step,index) => <Step key={step} index={index+1} text={step}/>)}</ol>
        </Section>

        <div className="mt-7 rounded-2xl border border-[#e5dfd2] bg-[#f3f0e8] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#596451]"><CookingPot size={17}/>锅具与电器</div>
          <p className="text-sm leading-6 text-stone-600">{recipe.cookware.join('、')}。备菜约 {recipe.prepMinutes} 分钟，烹饪约 {recipe.cookMinutes} 分钟。</p>
        </div>

        <Tips title="可替换食材" items={recipe.substitutions}/>
        <Tips title="减盐与少油建议" items={['配方已按家庭清淡口味设计；生抽可再减少三分之一，用香菇、番茄或柠檬补充鲜味。','优先使用不粘锅和焖煮方式；如锅体状态良好，可将标注油量再减少 2ml。']}/>
        <Tips title="老人食用提示" items={recipe.elderlyTips}/>
        <Tips title="保存与带饭" items={recipe.storageTips}/>
      </div>
    </section>
  </div>
}

function Info({ icon,label,value }:{icon:React.ReactNode;label:string;value:string}) {
  return <div className="rounded-2xl bg-[#f1eee6] px-3 py-3 text-center"><div className="mx-auto mb-1 flex w-fit text-[#7b8871] [&_svg]:h-4 [&_svg]:w-4">{icon}</div><div className="text-[10px] tracking-wide text-stone-400">{label}</div><div className="mt-0.5 text-xs font-medium text-stone-700">{value}</div></div>
}
function Section({ title,children }:{title:string;children:React.ReactNode}) { return <section className="mt-8"><h3 className="mb-3 text-[15px] font-semibold tracking-wide text-[#4a5045]">{title}</h3>{children}</section> }
function Step({ index,text }:{index:number;text:string}) { return <li className="flex gap-3 text-[14px] leading-6 text-stone-600"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dfe6d8] text-xs font-semibold text-[#596451]">{index}</span><span>{text}</span></li> }
function Tips({ title,items }:{title:string;items:string[]}) { return <div className="mt-6"><h3 className="mb-2 text-sm font-semibold text-[#4a5045]">{title}</h3><ul className="space-y-2 text-sm leading-6 text-stone-600">{items.map(item => <li key={item} className="flex gap-2"><span className="text-[#a67654]">•</span>{item}</li>)}</ul></div> }
