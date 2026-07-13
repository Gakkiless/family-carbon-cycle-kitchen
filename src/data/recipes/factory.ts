import type { CarbonDayType, CuisineType, DishType, Recipe, RecipeIngredient } from '@/src/types'

export type CookingMethod = 'stir' | 'stew' | 'steam' | 'pan' | 'bake' | 'soup' | 'boil' | 'salad' | 'rice'

interface RecipeSeed {
  id: string
  name: string
  cuisine: CuisineType
  dishType: DishType
  carbon: CarbonDayType[]
  ingredients: RecipeIngredient[]
  method: CookingMethod
  prep?: number
  cook?: number
  tags?: string[]
  substitutions?: string[]
  oven?: boolean
}

const proteinIds = new Set(['beef','beef-brisket','chicken-breast','chicken-thigh','pork-loin','minced-pork','mackerel','cod','salmon','bass','fish-fillet','shrimp','egg'])

function preparation(seed: RecipeSeed): string[] {
  const main = seed.ingredients[0]
  const proteins = seed.ingredients.filter(item => proteinIds.has(item.ingredientId)).map(item => item.name)
  const veg = seed.ingredients.filter(i => i.category === 'vegetable' || i.category === 'mushroom').map(i => i.name)
  const list = [`称量好全部食材；${main.name}按标注用量准备，调味料分别量取，避免烹饪中临时加重口味。`]
  if (proteins.length) list.push(`${proteins.join('、')}去除明显油脂或杂质，用厨房纸吸干表面；生熟砧板与刀具分开使用。`)
  if (veg.length) list.push(`${veg.join('、')}洗净沥水，根茎切约 2 厘米块，叶菜切约 5 厘米段，保证受热均匀且便于老人咀嚼。`)
  if (list.length === 1) list.push(`${main.name}检查并去除破损部分，按做法切成大小均匀、便于三人分食的小份。`)
  return list
}

function steps(seed: RecipeSeed): string[] {
  const a = seed.ingredients[0]?.name ?? '食材'
  const b = seed.ingredients.find((_, index) => index > 0 && !['seasoning','other'].includes(seed.ingredients[index].category))?.name ?? '配菜'
  const safe = seed.ingredients.some(item => proteinIds.has(item.ingredientId))
    ? `切开最厚处确认内部完全熟透、无血水；鱼虾肉质变白不透明，鸡蛋完全凝固后再出锅。`
    : `尝一小块确认中心已软熟，再进行最后调味。`
  if (seed.id.startsWith('staple-')) {
    if (seed.method === 'rice') return [
      `${a}放入盆中，加清水轻轻淘洗 2 遍，沥水后静置 10 分钟；不要用力搓洗。`,
      `将${a}和配方清水放入电饭煲，铺平米面，选择标准煮饭程序并启动。`,
      `程序结束后不要立刻开盖，继续焖 10 分钟，让中心充分吸水且质地更柔软。`,
      `开盖后用饭勺从底部翻松，若仍偏硬可沿锅边补 20ml 热水，再焖 5 分钟。`,
      `按三人份均匀分装，放至温热再食用；老人份可额外拌入少量热水。`,
    ]
    if (seed.method === 'boil') return [
      `汤锅加入至少 1.5L 清水，大火烧至持续沸腾，再放入${a}并立即用筷子拨散。`,
      `保持中火，按包装建议时间煮制；期间每 2 分钟轻轻搅动一次，防止粘连。`,
      `到建议时间后夹取一根尝看，确认中心没有硬芯；若偏硬，继续煮 1 至 2 分钟。`,
      `捞出沥水，可加入 10ml 温热生抽汤汁拌匀，不用冷水冲洗，避免生冷。`,
      `立即分成三份食用；若暂不食用，拌 2ml 食用油并加盖保温，防止结团。`,
    ]
    return [
      `${a}刷洗干净；大块食材切成约 4 厘米块，玉米切成便于三人分食的小段。`,
      `蒸锅加入足量清水，大火烧至持续冒蒸汽，再把${a}单层摆入蒸屉。`,
      `盖紧锅盖，保持中大火蒸 ${Math.max(15, seed.cook ?? 22)} 分钟，中途不要频繁开盖。`,
      `用筷子插入最厚处，能轻松穿透且中心没有硬芯即为熟透；否则续蒸 3 分钟。`,
      `关火后焖 2 分钟，分成三份；老人份可压成小块，避免过硬或噎食。`,
    ]
  }
  const map: Record<CookingMethod, string[]> = {
    stir: [
      `将${a}切成大小均匀的片或块；炒锅中火预热 1 分钟，加入 5ml 食用油并转动锅身铺开。`,
      `放入${a}摊平，中火翻炒 2 至 3 分钟，使表面均匀变色；盛出暂放，避免久炒变硬。`,
      `原锅加入${b}，沿锅边加入 20ml 清水，中火翻炒 3 至 4 分钟至颜色鲜亮、质地变软。`,
      `将${a}回锅，加入配方中的生抽或盐，小火翻匀 1 至 2 分钟，让味道均匀附着。`,
      `${safe}关火静置 1 分钟后装盘，汤汁不额外收得过干。`,
    ],
    stew: [
      `厚底锅中火预热，加入 5ml 食用油，放入${a}分散铺开，翻动 4 至 5 分钟至各面变色。`,
      `加入${b}翻炒 2 分钟，再加入配方中的生抽与足量清水，液面约到食材的三分之二。`,
      `大火煮至明显沸腾后立刻转小火，撇去表面浮沫，盖盖留一条小缝。`,
      `小火炖 ${Math.max(15, (seed.cook ?? 30) - 8)} 分钟，中途翻动 1 次；若汤汁过少，只补热水。`,
      `${safe}开盖小火再煮 3 至 5 分钟，使汤汁略浓但仍保留拌饭的湿润度。`,
    ],
    steam: [
      `将${a}平铺在耐热盘中，厚薄尽量一致；${b}放在四周，不堆叠在主料上。`,
      `蒸锅加入足量清水，大火烧至持续冒蒸汽，再将盘子放入，盖紧锅盖。`,
      `保持中大火蒸 ${Math.max(8, seed.cook ?? 12)} 分钟；期间不要频繁开盖，以免温度下降。`,
      `关火后焖 2 分钟再开盖，开盖时让蒸汽远离面部；倒掉过多蒸水后加少量生抽。`,
      `${safe}若最厚处仍未熟透，重新加盖蒸 3 分钟后再次检查。`,
    ],
    pan: [
      `${a}切成约 2 厘米厚的均匀块，用厨房纸吸干；加入少量生抽和黑胡椒，腌制 10 分钟。`,
      `不粘锅中小火预热 1 分钟，加入 5ml 食用油，放入${a}后先不要移动。`,
      `第一面煎 4 分钟，边缘变色后翻面，再煎 3 分钟；火力保持中小火，避免外焦内生。`,
      `加入${b}和 30ml 清水，盖盖小火焖 4 至 6 分钟，使配菜软熟并带走锅底香味。`,
      `${safe}离火后静置 2 分钟再切或装盘，减少汁水流失。`,
    ],
    bake: [
      `烤箱提前以 200℃ 预热 10 分钟；${a}与${b}切成大小接近的块，便于同时成熟。`,
      `将食材放入烤盘，加入 8ml 橄榄油、少量盐与黑胡椒，充分拌匀后铺成单层。`,
      `烤盘放中层，以 200℃ 烤 ${Math.max(15, seed.cook ?? 25)} 分钟；中途取出翻面一次。`,
      `最后 5 分钟观察上色，边缘微黄即可，不追求焦脆，以免老人咀嚼困难。`,
      `${safe}取出后静置 3 分钟再装盘；烤盘余汁可少量淋回食材。`,
    ],
    soup: [
      `汤锅加入配方中的清水，大火煮沸；${a}切成便于入口的小块，${b}处理至大小均匀。`,
      `先放入需要久煮的${a}，再次沸腾后撇去浮沫，转中小火煮 ${Math.max(8, (seed.cook ?? 18) - 5)} 分钟。`,
      `加入${b}，保持汤面轻微翻动继续煮 5 分钟，不用大火持续翻滚，以免汤色浑浊。`,
      `加入配方中的盐或生抽，从少量开始，搅匀后品尝再决定是否补充。`,
      `${safe}关火后盖盖焖 2 分钟，盛出时将食材剪切成适合老人入口的大小。`,
    ],
    boil: [
      `大锅加入至少 1.5L 清水，大火烧开；同时将${a}与${b}切成均匀的小块。`,
      `水沸后放入${a}，用筷子轻轻拨散，按包装或食材厚度中火煮 ${Math.max(5, seed.cook ?? 10)} 分钟。`,
      `在最后 3 分钟加入${b}同煮；捞出前尝一小块，确认没有硬芯。`,
      `捞出沥水，趁热加入配方调味料和 20ml 煮食材的热水，拌至味道均匀。`,
      `${safe}分入三只碗中，稍放温后食用，避免面条或块状食材粘连。`,
    ],
    salad: [
      `将${a}按其类别彻底煮熟或烤熟，放至温热；${b}洗净后切成易咀嚼的小块。`,
      `调味碗中加入 8ml 橄榄油、少量米醋与黑胡椒，搅拌至略微乳化。`,
      `先放入质地较硬的食材拌匀，静置 3 分钟，让其吸收味道并稍微软化。`,
      `再加入其余食材轻轻翻拌 20 秒，不挤压食材，保持完整。`,
      `${safe}这是一道温食搭配，不使用生蛋或半熟肉类；做好后 30 分钟内食用。`,
    ],
    rice: [
      `将${a}按食材要求淘洗或切块；大米淘洗 2 遍后沥水 10 分钟。`,
      `把大米与配方清水放入电饭煲，${b}均匀铺在表面，不要集中堆在蒸汽孔附近。`,
      `选择标准煮饭程序；程序结束后不要马上开盖，继续焖 10 分钟让水分分布均匀。`,
      `开盖后用饭勺从底部翻松，加入少量生抽或芝麻，拌匀后再盖盖焖 2 分钟。`,
      `${safe}分成三份趁温热食用；如老人吞咽较慢，可加 20ml 热水再焖软。`,
    ],
  }
  return map[seed.method]
}

export function makeRecipe(seed: RecipeSeed): Recipe {
  const prepMinutes = seed.prep ?? 12
  const cookMinutes = seed.cook ?? 18
  const cookware: Record<CookingMethod, string[]> = {
    stir:['炒锅','锅铲'],stew:['厚底锅','锅铲'],steam:['蒸锅','耐热盘'],pan:['不粘平底锅','锅铲'],bake:['烤箱','烤盘'],soup:['汤锅','汤勺'],boil:['汤锅','漏勺'],salad:['汤锅或烤箱','拌菜碗'],rice:['电饭煲','饭勺'],
  }
  return {
    id:seed.id,name:seed.name,cuisine:seed.cuisine,dishType:seed.dishType,suitableCarbonDays:seed.carbon,ingredients:seed.ingredients,
    preparation:preparation(seed),steps:steps(seed),prepMinutes,cookMinutes,difficulty:cookMinutes > 28 ? 'medium' : 'easy',cookware:cookware[seed.method],
    tags:[...(seed.tags ?? []),'三人份','全熟','少油少盐'],substitutions:seed.substitutions ?? ['同类当季蔬菜可等量替换；肉类替换时仍需彻底熟透。'],
    elderlyTips:['食材切小并烹至软熟；鱼类上桌前再次检查细刺。','先盛出老人份再按其他家人口味补少量调味。'],
    storageTips:['放凉至不烫手后密封冷藏，建议 24 小时内食用。','再次食用时加热至中心持续冒热气至少 2 分钟。'],
    suitableForLunchBox:seed.method !== 'soup' && seed.method !== 'salad',needsOven:seed.oven ?? seed.method === 'bake',goodForMealPrep:['stew','bake','pan'].includes(seed.method),
  }
}
