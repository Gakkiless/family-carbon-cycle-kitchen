import { ingredient as I } from '@/src/data/ingredients'
import type { RecipeIngredient } from '@/src/types'
import { makeRecipe, type CookingMethod } from './factory'

const c = 'chinese' as const
const all = ['high','medium','low'] as const
const hm = ['high','medium'] as const
const ml = ['medium','low'] as const
const season = (): RecipeIngredient[] => [I('soy-sauce',15),I('cooking-oil',5),I('ginger',10),I('water',60)]
const light = (): RecipeIngredient[] => [I('garlic',2),I('cooking-oil',5),I('salt',2)]

const specs: Array<[string,string,'main'|'vegetable'|'soup',readonly ('high'|'medium'|'low')[],RecipeIngredient[],CookingMethod,number?]> = [
  ['cn-01','番茄炖牛肉','main',hm,[I('beef',450),I('tomato',500),I('onion',150),...season()],'stew',35],
  ['cn-02','土豆胡萝卜炖牛肉','main',hm,[I('beef',420),I('potato',350),I('carrot',180),I('onion',120),...season()],'stew',40],
  ['cn-03','青椒洋葱炒牛肉','main',all,[I('beef',400),I('green-pepper',2),I('onion',180),I('soy-sauce',15),I('starch',8),I('cooking-oil',8)],'stir',14],
  ['cn-04','黑椒牛肉杏鲍菇','main',all,[I('beef',400),I('king-oyster',260),I('onion',120),I('black-pepper',2),I('soy-sauce',15),I('cooking-oil',8)],'stir',16],
  ['cn-05','香煎鸡胸肉','main',all,[I('chicken-breast',450),I('lemon',1),I('black-pepper',2),I('soy-sauce',12),I('cooking-oil',6),I('water',30)],'pan',15],
  ['cn-06','香菇焖鸡腿','main',all,[I('chicken-thigh',500),I('shiitake',8),I('onion',120),...season()],'stew',28],
  ['cn-07','土豆烧鸡','main',hm,[I('chicken-thigh',500),I('potato',450),I('carrot',120),...season()],'stew',30],
  ['cn-08','番茄鸡肉烩菜','main',all,[I('chicken-breast',420),I('tomato',450),I('zucchini',1),I('onion',120),...season()],'stew',22],
  ['cn-09','芦笋炒鸡胸','main',all,[I('chicken-breast',420),I('asparagus',300),I('garlic',2),I('soy-sauce',12),I('cooking-oil',6)],'stir',13],
  ['cn-10','西兰花炒鸡胸','main',all,[I('chicken-breast',420),I('broccoli',420),I('garlic',2),I('soy-sauce',12),I('cooking-oil',6)],'stir',15],
  ['cn-11','木耳炒鸡蛋','main',ml,[I('egg',5),I('wood-ear',180),I('green-pepper',1),I('soy-sauce',10),I('cooking-oil',8)],'stir',12],
  ['cn-12','番茄炒鸡蛋','main',all,[I('egg',5),I('tomato',500),I('scallion',2),I('soy-sauce',8),I('cooking-oil',8)],'stir',12],
  ['cn-13','苦瓜炒鸡蛋','main',ml,[I('egg',5),I('bitter-melon',2),I('garlic',2),I('salt',2),I('cooking-oil',8)],'stir',12],
  ['cn-14','虾仁蒸蛋','main',all,[I('shrimp',220),I('egg',4),I('water',320),I('soy-sauce',8),I('sesame-oil',3)],'steam',15],
  ['cn-15','西葫芦炒鸡蛋','main',all,[I('egg',5),I('zucchini',2),I('scallion',2),I('salt',2),I('cooking-oil',8)],'stir',12],
  ['cn-16','青椒炒猪里脊','main',all,[I('pork-loin',420),I('green-pepper',2),I('onion',100),I('soy-sauce',15),I('starch',8),I('cooking-oil',8)],'stir',15],
  ['cn-17','木耳炒肉片','main',all,[I('pork-loin',420),I('wood-ear',180),I('carrot',100),I('soy-sauce',15),I('starch',8),I('cooking-oil',8)],'stir',15],
  ['cn-18','莲藕炒肉片','main',hm,[I('pork-loin',400),I('lotus-root',350),I('green-pepper',1),I('soy-sauce',15),I('cooking-oil',8)],'stir',16],
  ['cn-19','芹菜炒肉丝','main',all,[I('pork-loin',420),I('celery',350),I('carrot',80),I('soy-sauce',15),I('starch',8),I('cooking-oil',8)],'stir',14],
  ['cn-20','鱼香茄子少油版','vegetable',hm,[I('eggplant',3),I('minced-pork',120),I('green-pepper',1),I('soy-sauce',12),I('vinegar',10),I('cooking-oil',10),I('water',80)],'stew',18],
  ['cn-21','清蒸鲈鱼','main',all,[I('bass',1),I('ginger',15),I('scallion',3),I('soy-sauce',15),I('cooking-oil',5)],'steam',15],
  ['cn-22','清蒸鳕鱼','main',all,[I('cod',450),I('ginger',12),I('scallion',3),I('soy-sauce',12),I('cooking-oil',5)],'steam',13],
  ['cn-23','番茄炖鱼片','main',all,[I('fish-fillet',450),I('tomato',500),I('napa-cabbage',250),I('ginger',10),I('water',500),I('salt',2)],'stew',20],
  ['cn-24','虾仁西兰花','main',all,[I('shrimp',350),I('broccoli',420),I('garlic',2),I('soy-sauce',10),I('cooking-oil',7)],'stir',13],
  ['cn-25','芦笋炒虾仁','main',all,[I('shrimp',350),I('asparagus',320),I('garlic',2),I('soy-sauce',10),I('cooking-oil',7)],'stir',12],
  ['cn-26','家常豆腐少油版','main',ml,[I('tofu',500),I('wood-ear',120),I('green-pepper',1),I('carrot',80),I('soy-sauce',15),I('cooking-oil',8),I('water',80)],'stew',18],
  ['cn-27','肉末豆腐','main',all,[I('tofu',500),I('minced-pork',180),I('scallion',2),I('soy-sauce',15),I('cooking-oil',6),I('water',100)],'stew',16],
  ['cn-28','香菇烧豆腐','main',ml,[I('tofu',500),I('shiitake',8),I('bok-choy',250),I('soy-sauce',15),I('cooking-oil',6),I('water',100)],'stew',18],
  ['cn-29','白菜豆腐煲','main',ml,[I('tofu',450),I('napa-cabbage',500),I('shiitake',6),I('water',450),I('soy-sauce',12),I('sesame-oil',3)],'stew',22],
  ['cn-30','萝卜炖牛腩','main',all,[I('beef-brisket',500),I('radish',500),I('ginger',15),I('water',800),I('soy-sauce',15)],'stew',50],
  ['cn-31','蒜蓉生菜','vegetable',all,[I('lettuce',450),...light()],'stir',6],
  ['cn-32','清炒油麦菜','vegetable',all,[I('romaine',450),...light()],'stir',6],
  ['cn-33','蒜蓉菠菜','vegetable',all,[I('spinach',450),...light()],'stir',6],
  ['cn-34','清炒西兰花','vegetable',all,[I('broccoli',480),...light(),I('water',30)],'stir',8],
  ['cn-35','番茄炒西葫芦','vegetable',all,[I('tomato',350),I('zucchini',2),...light()],'stir',10],
  ['cn-36','清炒卷心菜','vegetable',all,[I('cabbage',500),...light(),I('vinegar',5)],'stir',8],
  ['cn-37','香菇青菜','vegetable',all,[I('shiitake',8),I('bok-choy',450),...light(),I('soy-sauce',8)],'stir',10],
  ['cn-38','烤贝贝南瓜','vegetable',hm,[I('pumpkin',650),I('olive-oil',8),I('black-pepper',1),I('salt',1)],'bake',25],
  ['cn-39','烤土豆块','vegetable',hm,[I('potato',600),I('olive-oil',10),I('black-pepper',2),I('salt',2)],'bake',28],
  ['cn-40','凉拌黄瓜少盐版','vegetable',all,[I('cucumber',3),I('garlic',2),I('vinegar',12),I('sesame-oil',4),I('soy-sauce',6)],'salad',5],
  ['cn-41','紫菜蛋花汤','soup',all,[I('seaweed',1),I('egg',2),I('water',900),I('scallion',2),I('salt',2),I('sesame-oil',2)],'soup',8],
  ['cn-42','番茄鸡蛋汤','soup',all,[I('tomato',350),I('egg',3),I('water',900),I('scallion',2),I('salt',2),I('cooking-oil',3)],'soup',12],
  ['cn-43','冬瓜虾皮汤','soup',all,[I('winter-melon',500),I('dried-shrimp',20),I('water',900),I('ginger',5),I('salt',2),I('sesame-oil',2)],'soup',15],
  ['cn-44','菌菇豆腐汤','soup',all,[I('mixed-mushroom',300),I('tofu',300),I('water',900),I('scallion',2),I('salt',2),I('sesame-oil',2)],'soup',15],
  ['cn-45','萝卜牛肉汤','soup',all,[I('beef',280),I('radish',450),I('water',1100),I('ginger',12),I('salt',2)],'soup',35],
]

export const chineseRecipes = specs.map(([id,name,dishType,carbon,ingredients,method,cook]) => makeRecipe({
  id,name,cuisine:c,dishType,carbon:[...carbon],ingredients,method,cook,tags:[dishType === 'soup' ? '清淡汤品' : '中式家常'],oven:method === 'bake',
}))
