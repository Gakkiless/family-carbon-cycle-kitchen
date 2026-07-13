import type { Ingredient, IngredientCategory, RecipeIngredient } from '@/src/types'

type IngredientSeed = [string, string, IngredientCategory, string, number?, string[]?]

const seeds: IngredientSeed[] = [
  ['beef','牛肉','meat','g',100],['beef-brisket','牛腩','meat','g',100],['chicken-breast','鸡胸肉','meat','g',100,['鸡脯肉']],
  ['chicken-thigh','鸡腿肉','meat','g',100],['pork-loin','猪里脊','meat','g',100,['瘦猪肉']],['minced-pork','猪肉末','meat','g',100],
  ['mackerel','鲭鱼','seafood','g',100],['cod','鳕鱼','seafood','g',100],['salmon','三文鱼','seafood','g',100],['bass','鲈鱼','seafood','条',1],
  ['fish-fillet','鱼片','seafood','g',100],['shrimp','虾仁','seafood','g',100],['tuna','水浸金枪鱼','seafood','罐',1],['dried-shrimp','虾皮','seafood','g',20],
  ['egg','鸡蛋','egg-tofu','个',1],['tofu','北豆腐','egg-tofu','g',100,['豆腐']],['silken-tofu','嫩豆腐','egg-tofu','盒',1],['miso','味噌','seasoning','g',50],
  ['rice','大米','staple','g',100,['米']],['mixed-grain','杂粮米','staple','g',100],['udon','乌冬面','staple','g',200],['soba','荞麦面','staple','g',100],
  ['potato','土豆','staple','g',100],['sweet-potato','红薯','staple','g',100],['pumpkin','贝贝南瓜','staple','g',100,['南瓜']],['corn','玉米','staple','根',1],
  ['oats','燕麦','staple','g',100],['chickpea','鹰嘴豆','staple','g',100],['bread-crumbs','面包糠','staple','g',50],
  ['tomato','番茄','vegetable','g',100,['西红柿']],['carrot','胡萝卜','vegetable','g',100],['onion','洋葱','vegetable','g',100],['green-pepper','青椒','vegetable','个',1],
  ['bell-pepper','彩椒','vegetable','个',1],['broccoli','西兰花','vegetable','g',100],['asparagus','芦笋','vegetable','g',100],['lettuce','生菜','vegetable','g',100],
  ['romaine','油麦菜','vegetable','g',100],['spinach','菠菜','vegetable','g',100],['zucchini','西葫芦','vegetable','根',1],['cabbage','卷心菜','vegetable','g',100],
  ['bok-choy','青菜','vegetable','g',100],['cucumber','黄瓜','vegetable','根',1],['bitter-melon','苦瓜','vegetable','根',1],['celery','芹菜','vegetable','g',100],
  ['lotus-root','莲藕','vegetable','g',100],['eggplant','茄子','vegetable','根',1],['radish','白萝卜','vegetable','g',100],['winter-melon','冬瓜','vegetable','g',100],
  ['napa-cabbage','大白菜','vegetable','g',100],['garlic','蒜','seasoning','瓣',1],['ginger','姜','seasoning','g',20],['scallion','香葱','seasoning','根',1],
  ['wood-ear','泡发木耳','mushroom','g',100],['shiitake','鲜香菇','mushroom','朵',1],['king-oyster','杏鲍菇','mushroom','g',100],['mixed-mushroom','混合菌菇','mushroom','g',100],
  ['mushroom','口蘑','mushroom','g',100],['seaweed','紫菜','other','袋',1],['kelp','海带','other','g',100],['sesame','熟芝麻','other','g',50],
  ['walnut','核桃仁','other','g',100],['lemon','柠檬','fruit','个',1],['olive','黑橄榄','other','g',100],['milk','牛奶','other','ml',250],
  ['soy-sauce','生抽','seasoning','ml',100],['dark-soy','老抽','seasoning','ml',100],['cooking-oil','食用油','seasoning','ml',500,['植物油']],['olive-oil','橄榄油','seasoning','ml',250],
  ['sesame-oil','芝麻油','seasoning','ml',100],['cooking-wine','料酒','seasoning','ml',100],['vinegar','米醋','seasoning','ml',100],['salt','盐','seasoning','g',100],
  ['black-pepper','黑胡椒','seasoning','g',50],['starch','淀粉','seasoning','g',100],['curry','咖喱块','seasoning','块',1],['honey','蜂蜜','seasoning','g',100],
  ['tomato-paste','番茄膏','seasoning','g',100],['oregano','干牛至','seasoning','g',20],['water','清水','other','ml',500],['nori','海苔片','other','片',1],
]

export const ingredients: Ingredient[] = seeds.map(([id,name,category,unit,rounding,aliases=[]]) => ({
  id,name,aliases,category,defaultUnit:unit,commonPurchaseUnit:unit,purchaseRounding:rounding ?? 1,
}))

export const ingredientMap = Object.fromEntries(ingredients.map(item => [item.id, item])) as Record<string, Ingredient>

export function ingredient(id: string, amountForThree: number, note?: string, optional = false): RecipeIngredient {
  const item = ingredientMap[id]
  if (!item) throw new Error(`Unknown ingredient: ${id}`)
  return { ingredientId:id, name:item.name, amountForThree, unit:item.defaultUnit, category:item.category, note, optional }
}

export const categoryLabels: Record<IngredientCategory, string> = {
  meat:'肉类', seafood:'鱼虾海鲜', 'egg-tofu':'鸡蛋和豆制品', staple:'主食和杂粮', vegetable:'蔬菜', mushroom:'菌菇', fruit:'水果', seasoning:'调味料', other:'其他',
}
