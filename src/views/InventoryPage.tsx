'use client'

import { AlertCircle, Minus, PackageOpen, Plus, Star, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toDateKey, addDays } from '@/src/algorithms/carbonCycle'
import { categoryLabels, ingredientMap, ingredients } from '@/src/data/ingredients'
import { useAppStore } from '@/src/stores/useAppStore'
import type { IngredientCategory } from '@/src/types'
import { formatAmount } from '@/src/utils/format'

const units = ['g','kg','ml','L','个','根','颗','片','袋','盒','罐']

export function InventoryPage() {
  const inventory = useAppStore(state => state.inventory)
  const addInventory = useAppStore(state => state.addInventory)
  const updateInventory = useAppStore(state => state.updateInventory)
  const removeInventory = useAppStore(state => state.removeInventory)
  const [showForm,setShowForm] = useState(false)
  const [ingredientId,setIngredientId] = useState('egg')
  const [amount,setAmount] = useState('1')
  const [unit,setUnit] = useState('个')
  const [expiryDate,setExpiryDate] = useState(toDateKey(addDays(new Date(),7)))
  const [priority,setPriority] = useState(false)
  const [note,setNote] = useState('')
  const grouped = useMemo(() => inventory.reduce((acc,item) => { (acc[item.category] ??= []).push(item); return acc },{} as Partial<Record<IngredientCategory,typeof inventory>>),[inventory])

  function chooseIngredient(id:string) { const item = ingredientMap[id]; setIngredientId(id); setUnit(item.defaultUnit) }
  function submit(event:React.FormEvent) {
    event.preventDefault(); const master = ingredientMap[ingredientId]; if (!master || Number(amount) <= 0) return
    addInventory({ ingredientId,name:master.name,amount:Number(amount),unit,category:master.category,expiryDate,priority,note })
    setShowForm(false); setAmount('1'); setPriority(false); setNote('')
  }

  return <div className="page-wrap px-4 pb-28 pt-7">
    <header className="px-1"><p className="text-xs tracking-[.18em] text-[#849079]">HOME PANTRY</p><div className="mt-1 flex items-end justify-between"><div><h1 className="font-serif-cn text-[30px] text-[#31352f]">家中食材</h1><p className="mt-1 text-sm text-stone-500">临期与优先食材会影响下次菜单生成</p></div><div className="rounded-full bg-[#e8ece3] p-3 text-[#62705a]"><PackageOpen size={21}/></div></div></header>
    <button className="primary-button mt-5 w-full" onClick={() => setShowForm(true)}><Plus size={17}/>添加家中食材</button>
    <div className="mt-5 space-y-5">
      {Object.entries(grouped).map(([category,items]) => <section key={category}><h2 className="mb-2 px-1 text-xs font-semibold tracking-wider text-stone-400">{categoryLabels[category as IngredientCategory]}</h2><div className="space-y-2">{items.map(item => {
        const days = Math.ceil((new Date(`${item.expiryDate}T23:59:59`).getTime() - Date.now())/86400000)
        return <article key={item.id} className="rounded-[18px] border border-[#e8e2d7] bg-white p-4">
          <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h3 className="font-medium text-[#41443f]">{item.name}</h3>{item.priority && <span className="soft-tag bg-[#f4e6d8] text-[#a2653f]">优先消耗</span>}</div><p className={`mt-1 flex items-center gap-1 text-xs ${days <= 3 ? 'text-[#b46a4d]' : 'text-stone-400'}`}>{days <= 3 && <AlertCircle size={12}/>} {days < 0 ? '已过预计保质期' : `${days} 天后到期`} · {item.expiryDate}</p>{item.note && <p className="mt-1 text-xs text-stone-400">{item.note}</p>}</div><button className={`icon-button ${item.priority ? 'text-[#b46a4d]' : 'text-stone-300'}`} onClick={() => updateInventory(item.id,{priority:!item.priority})} aria-label="切换优先消耗"><Star size={18} fill={item.priority ? 'currentColor' : 'none'}/></button></div>
          <div className="mt-4 flex items-center justify-between"><div className="flex items-center rounded-xl bg-[#f3f1eb] p-1"><button className="h-8 w-8 rounded-lg text-stone-500" onClick={() => updateInventory(item.id,{amount:Math.max(0,item.amount-(['g','ml'].includes(item.unit) ? 50 : 1))})}><Minus className="mx-auto" size={15}/></button><span className="min-w-20 text-center text-sm font-semibold text-[#586151]">{formatAmount(item.amount)} {item.unit}</span><button className="h-8 w-8 rounded-lg text-stone-500" onClick={() => updateInventory(item.id,{amount:item.amount+(['g','ml'].includes(item.unit) ? 50 : 1)})}><Plus className="mx-auto" size={15}/></button></div><button className="icon-button text-stone-300 hover:text-red-400" onClick={() => removeInventory(item.id)} aria-label="删除食材"><Trash2 size={17}/></button></div>
        </article>
      })}</div></section>)}
    </div>

    {showForm && <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/25" onMouseDown={event => event.currentTarget === event.target && setShowForm(false)}><form onSubmit={submit} className="w-full max-w-[520px] rounded-t-[28px] bg-[#fbfaf6] px-5 pb-9 pt-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="font-serif-cn text-2xl text-[#383b35]">添加食材</h2><button type="button" className="icon-button" onClick={() => setShowForm(false)}><X size={20}/></button></div>
      <label className="form-label">食材名称<select className="form-input" value={ingredientId} onChange={event => chooseIngredient(event.target.value)}>{ingredients.map(item => <option key={item.id} value={item.id}>{item.name} · {categoryLabels[item.category]}</option>)}</select></label>
      <div className="grid grid-cols-2 gap-3"><label className="form-label">数量<input className="form-input" type="number" min="0.1" step="0.1" value={amount} onChange={event => setAmount(event.target.value)}/></label><label className="form-label">单位<select className="form-input" value={unit} onChange={event => setUnit(event.target.value)}>{units.map(item => <option key={item}>{item}</option>)}</select></label></div>
      <label className="form-label">预计保质期<input className="form-input" type="date" value={expiryDate} onChange={event => setExpiryDate(event.target.value)}/></label>
      <label className="form-label">备注<input className="form-input" placeholder="例如：已开封、冷冻" value={note} onChange={event => setNote(event.target.value)}/></label>
      <label className="mb-5 flex items-center gap-3 rounded-xl bg-[#f2efe7] p-3 text-sm text-stone-600"><input type="checkbox" checked={priority} onChange={event => setPriority(event.target.checked)} className="accent-[#6f7d65]"/>标记为优先消耗</label>
      <button className="primary-button w-full" type="submit">保存食材</button>
    </form></div>}
  </div>
}
