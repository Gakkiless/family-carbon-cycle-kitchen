import { ingredient as I } from '@/src/data/ingredients'
import type { RecipeIngredient } from '@/src/types'
import { makeRecipe, type CookingMethod } from './factory'

const c = 'mediterranean' as const
const all = ['high','medium','low'] as const
const hm = ['high','medium'] as const
const ml = ['medium','low'] as const
const herb = (): RecipeIngredient[] => [I('garlic',2),I('olive-oil',8),I('lemon',1),I('oregano',2),I('black-pepper',1)]

const specs: Array<[string,string,'main'|'vegetable',readonly ('high'|'medium'|'low')[],RecipeIngredient[],CookingMethod,number?]> = [
  ['med-71','柠檬香草烤鸡腿','main',all,[I('chicken-thigh',520),I('zucchini',1),...herb()],'bake',28],
  ['med-72','地中海烤鸡胸','main',all,[I('chicken-breast',480),I('bell-pepper',2),I('onion',160),...herb()],'bake',24],
  ['med-73','番茄橄榄烩鸡肉','main',all,[I('chicken-thigh',480),I('tomato',450),I('olive',60),I('onion',160),I('garlic',2),I('olive-oil',8),I('water',120)],'stew',25],
  ['med-74','香草烤鳕鱼','main',all,[I('cod',480),I('tomato',300),...herb()],'bake',18],
  ['med-75','柠檬蒜香烤鱼','main',all,[I('fish-fillet',480),I('broccoli',300),...herb()],'bake',20],
  ['med-76','番茄炖鱼','main',all,[I('fish-fillet',480),I('tomato',500),I('onion',150),I('garlic',2),I('olive-oil',8),I('water',200)],'stew',22],
  ['med-77','蒜香橄榄油虾仁','main',ml,[I('shrimp',420),I('zucchini',1),I('garlic',3),I('olive-oil',10),I('lemon',1),I('black-pepper',1)],'pan',12],
  ['med-78','番茄虾仁烩菜','main',all,[I('shrimp',380),I('tomato',500),I('zucchini',1),I('onion',120),I('garlic',2),I('olive-oil',8)],'stew',18],
  ['med-79','牛肉彩椒烩菜','main',all,[I('beef',430),I('bell-pepper',2),I('onion',180),I('tomato',250),I('olive-oil',8),I('black-pepper',2)],'stew',24],
  ['med-80','地中海牛肉丸','main',all,[I('beef',420),I('onion',120),I('egg',1),I('bread-crumbs',35),I('tomato',350),I('olive-oil',8),I('oregano',2)],'pan',24],
  ['med-81','鹰嘴豆炖牛肉','main',hm,[I('beef',380),I('chickpea',240),I('tomato',400),I('carrot',150),I('onion',150),I('olive-oil',8),I('water',350)],'stew',35],
  ['med-82','烤鸡肉蔬菜盘','main',all,[I('chicken-breast',460),I('broccoli',280),I('bell-pepper',2),I('onion',150),...herb()],'bake',25],
  ['med-83','烤南瓜鸡肉沙拉','main',hm,[I('chicken-breast',380),I('pumpkin',450),I('lettuce',250),I('walnut',30),I('olive-oil',10),I('lemon',1)],'salad',25],
  ['med-84','金枪鱼土豆沙拉','main',hm,[I('tuna',2),I('potato',450),I('egg',3),I('cucumber',1),I('olive-oil',8),I('vinegar',8)],'salad',18],
  ['med-85','鸡蛋金枪鱼沙拉','main',ml,[I('egg',5),I('tuna',2),I('lettuce',300),I('tomato',250),I('corn',1),I('olive-oil',8),I('vinegar',8)],'salad',15],
  ['med-86','烤西葫芦','vegetable',all,[I('zucchini',3),I('garlic',2),I('olive-oil',8),I('oregano',1),I('black-pepper',1)],'bake',18],
  ['med-87','烤彩椒洋葱','vegetable',all,[I('bell-pepper',3),I('onion',250),I('olive-oil',8),I('oregano',1),I('black-pepper',1)],'bake',20],
  ['med-88','番茄蘑菇烩菜','vegetable',all,[I('tomato',450),I('mushroom',350),I('onion',150),I('garlic',2),I('olive-oil',8),I('water',80)],'stew',18],
  ['med-89','菠菜蘑菇烘蛋全熟版','main',ml,[I('egg',6),I('spinach',300),I('mushroom',250),I('milk',80),I('olive-oil',8),I('black-pepper',1)],'bake',22],
  ['med-90','番茄豆腐炖菜','main',ml,[I('tofu',500),I('tomato',500),I('zucchini',1),I('onion',120),I('olive-oil',8),I('oregano',1),I('water',120)],'stew',20],
]

export const mediterraneanRecipes = specs.map(([id,name,dishType,carbon,ingredients,method,cook]) => makeRecipe({
  id,name,cuisine:c,dishType,carbon:[...carbon],ingredients,method,cook,tags:['地中海家常','香草清淡'],oven:method === 'bake',
}))
