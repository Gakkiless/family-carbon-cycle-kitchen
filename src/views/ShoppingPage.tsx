'use client'

import { Check, ChevronDown, Clipboard, RotateCcw, ShoppingBasket } from 'lucide-react'
import { useMemo, useState } from 'react'
import { buildShoppingList } from '@/src/algorithms/shoppingList'
import { categoryLabels } from '@/src/data/ingredients'
import { useAppStore } from '@/src/stores/useAppStore'
import type { IngredientCategory, ShoppingItem } from '@/src/types'
import { formatAmount } from '@/src/utils/format'

export function ShoppingPage() {
  const menus = useAppStore(state => state.menus)
  const inventory = useAppStore(state => state.inventory)
  const checked = useAppStore(state => state.checkedPurchases)
  const togglePurchased = useAppStore(state => state.togglePurchased)
  const clearPurchased = useAppStore(state => state.clearPurchased)
  const [deduct,setDeduct] = useState(true)
  const [onlyNeeded,setOnlyNeeded] = useState(true)
  const [collapsed,setCollapsed] = useState<IngredientCategory[]>([])
  const [copied,setCopied] = useState(false)
  const list = useMemo(() => buildShoppingList(menus,inventory),[menus,inventory])
  const visible = list.filter(item => !onlyNeeded || (deduct ? item.toBuy : item.required) > 0)
  const grouped = visible.reduce((acc,item) => { (acc[item.category] ??= []).push(item); return acc },{} as Partial<Record<IngredientCategory,ShoppingItem[]>>)
  const neededCount = list.filter(item => item.toBuy > 0).length

  async function copyList() {
    const text = ['家庭两日晚餐采购清单',...list.filter(item => (deduct ? item.toBuy : item.required) > 0).map(item => {
      const amount = deduct ? item.suggestedPurchase : item.required
      return `□ ${item.name} ${formatAmount(amount)}${item.unit}（用于：${item.usedIn.join('、')}）`
    })].join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true); window.setTimeout(() => setCopied(false),1600)
  }

  return <div className="page-wrap px-4 pb-28 pt-7">
    <header className="px-1">
      <p className="text-xs tracking-[.18em] text-[#849079]">TWO-DAY LIST</p>
      <div className="mt-1 flex items-end justify-between"><div><h1 className="font-serif-cn text-[30px] text-[#31352f]">两日采购</h1><p className="mt-1 text-sm text-stone-500">已合并两日晚餐食材，并扣除家中库存</p></div><div className="rounded-full bg-[#f4e8da] p-3 text-[#a36b45]"><ShoppingBasket size={21}/></div></div>
    </header>

    <section className="mt-5 rounded-[22px] bg-[#6d7a64] p-5 text-white shadow-sm">
      <div className="flex items-end justify-between"><div><p className="text-xs text-white/65">还需购买</p><p className="mt-1 text-3xl font-semibold">{neededCount}<span className="ml-1 text-sm font-normal text-white/70">种食材</span></p></div><p className="text-xs text-white/65">3 人 · 2 晚</p></div>
      <div className="mt-4 flex gap-2"><button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/14 py-2.5 text-xs" onClick={copyList}>{copied ? <Check size={15}/> : <Clipboard size={15}/>} {copied ? '已复制' : '复制清单'}</button><button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/14 py-2.5 text-xs" onClick={clearPurchased}><RotateCcw size={15}/>全部取消勾选</button></div>
    </section>

    <div className="mt-4 grid grid-cols-2 gap-3">
      <Toggle label="扣除家中库存" checked={deduct} onChange={setDeduct}/>
      <Toggle label="只看需要购买" checked={onlyNeeded} onChange={setOnlyNeeded}/>
    </div>

    <div className="mt-5 space-y-3">
      {Object.entries(grouped).map(([category,items]) => {
        const key = category as IngredientCategory
        const isCollapsed = collapsed.includes(key)
        return <section key={category} className="overflow-hidden rounded-[20px] border border-[#e8e2d7] bg-white">
          <button className="flex w-full items-center justify-between px-4 py-4 text-left" onClick={() => setCollapsed(value => value.includes(key) ? value.filter(item => item !== key) : [...value,key])}><span className="text-sm font-semibold text-[#50544c]">{categoryLabels[key]} <span className="ml-1 font-normal text-stone-400">{items.length}</span></span><ChevronDown size={18} className={`text-stone-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}/></button>
          {!isCollapsed && <div className="divide-y divide-[#eee9df] border-t border-[#eee9df]">{items.map(item => {
            const done = checked.includes(item.ingredientId)
            const amount = deduct ? item.toBuy : item.required
            const suggested = deduct ? item.suggestedPurchase : item.required
            return <button key={item.ingredientId} className="flex w-full gap-3 px-4 py-4 text-left" onClick={() => togglePurchased(item.ingredientId)}>
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${done ? 'border-[#718069] bg-[#718069] text-white' : 'border-stone-300'}`}>{done && <Check size={14}/>}</span>
              <div className={`min-w-0 flex-1 ${done ? 'opacity-45' : ''}`}><div className="flex items-center justify-between gap-3"><strong className={`text-[15px] font-medium text-[#42453f] ${done ? 'line-through' : ''}`}>{item.name}</strong><span className="shrink-0 text-sm font-semibold text-[#a36b45]">{formatAmount(amount)} {item.unit}</span></div>
                <p className="mt-1 text-[11px] leading-5 text-stone-400">两日需 {formatAmount(item.required)}{item.unit} · 家中 {formatAmount(item.inStock)}{item.unit}</p>
                {amount > 0 && <p className="text-[11px] text-stone-500">建议实际购买约 {formatAmount(suggested)}{item.unit}</p>}
                <p className="mt-1 line-clamp-1 text-[11px] text-stone-400">用于：{item.usedIn.join('、')}</p>
              </div>
            </button>
          })}</div>}
        </section>
      })}
      {!visible.length && <div className="rounded-2xl bg-white px-5 py-12 text-center text-sm text-stone-400">家中库存已经满足这两日晚餐</div>}
    </div>
  </div>
}

function Toggle({label,checked,onChange}:{label:string;checked:boolean;onChange:(checked:boolean)=>void}) {
  return <label className="flex items-center justify-between rounded-2xl border border-[#e8e2d7] bg-white px-3 py-3 text-xs text-stone-600"><span>{label}</span><input className="sr-only" type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/><span className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-[#78866f]' : 'bg-stone-200'}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`}/></span></label>
}
