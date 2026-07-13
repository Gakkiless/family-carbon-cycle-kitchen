import { ingredient as I } from '@/src/data/ingredients'
import type { RecipeIngredient } from '@/src/types'
import { makeRecipe, type CookingMethod } from './factory'

const c = 'japanese' as const
const all = ['high','medium','low'] as const
const hm = ['high','medium'] as const
const ml = ['medium','low'] as const
const teriyaki = (): RecipeIngredient[] => [I('soy-sauce',18),I('honey',10),I('water',35),I('cooking-oil',5)]

const specs: Array<[string,string,'main'|'vegetable'|'staple'|'soup',readonly ('high'|'medium'|'low')[],RecipeIngredient[],CookingMethod,number?]> = [
  ['jp-46','日式照烧鸡腿','main',all,[I('chicken-thigh',520),I('onion',180),...teriyaki(),I('ginger',8)],'pan',18],
  ['jp-47','日式照烧鸡胸','main',all,[I('chicken-breast',460),I('broccoli',300),...teriyaki(),I('ginger',8)],'pan',16],
  ['jp-48','盐烤鲭鱼','main',all,[I('mackerel',480),I('lemon',1),I('salt',2),I('cooking-oil',3)],'bake',18],
  ['jp-49','味噌烤鳕鱼','main',all,[I('cod',480),I('miso',35),I('honey',8),I('water',20),I('cooking-oil',3)],'bake',18],
  ['jp-50','日式烤三文鱼','main',all,[I('salmon',480),I('lemon',1),I('soy-sauce',12),I('black-pepper',1),I('cooking-oil',3)],'bake',17],
  ['jp-51','日式姜烧猪肉','main',all,[I('pork-loin',450),I('onion',220),I('ginger',15),I('soy-sauce',18),I('honey',6),I('cooking-oil',6)],'stir',15],
  ['jp-52','日式牛肉洋葱煮','main',all,[I('beef',430),I('onion',300),I('soy-sauce',20),I('honey',8),I('water',260),I('ginger',8)],'stew',20],
  ['jp-53','亲子丼家庭版','staple',hm,[I('chicken-thigh',360),I('egg',5),I('onion',200),I('rice',210),I('soy-sauce',18),I('water',300)],'rice',35],
  ['jp-54','牛丼家庭版','staple',hm,[I('beef',360),I('onion',220),I('rice',210),I('soy-sauce',18),I('honey',6),I('water',280)],'rice',32],
  ['jp-55','日式咖喱鸡肉','main',hm,[I('chicken-thigh',450),I('potato',350),I('carrot',180),I('onion',180),I('curry',3),I('water',650)],'stew',30],
  ['jp-56','日式咖喱牛肉','main',hm,[I('beef',450),I('potato',350),I('carrot',180),I('onion',180),I('curry',3),I('water',650)],'stew',35],
  ['jp-57','日式土豆炖肉','main',hm,[I('pork-loin',380),I('potato',480),I('carrot',160),I('onion',180),I('soy-sauce',18),I('water',500)],'stew',28],
  ['jp-58','日式豆腐汉堡排','main',ml,[I('tofu',350),I('minced-pork',280),I('onion',150),I('egg',1),I('bread-crumbs',35),I('soy-sauce',15),I('cooking-oil',6)],'pan',20],
  ['jp-59','日式鸡肉丸','main',all,[I('chicken-breast',450),I('tofu',150),I('egg',1),I('starch',18),I('soy-sauce',15),I('ginger',8),I('water',120)],'pan',18],
  ['jp-60','日式玉子烧全熟版','main',ml,[I('egg',6),I('milk',60),I('soy-sauce',8),I('cooking-oil',6)],'pan',12],
  ['jp-61','日式茶碗蒸全熟版','main',ml,[I('egg',4),I('shrimp',150),I('shiitake',3),I('water',420),I('soy-sauce',8)],'steam',18],
  ['jp-62','味噌豆腐汤','soup',all,[I('miso',35),I('tofu',250),I('seaweed',1),I('scallion',2),I('water',900)],'soup',12],
  ['jp-63','海带豆腐汤','soup',all,[I('kelp',120),I('tofu',280),I('shiitake',3),I('water',950),I('soy-sauce',8)],'soup',15],
  ['jp-64','日式卷心菜沙拉','vegetable',ml,[I('cabbage',450),I('carrot',100),I('corn',1),I('sesame',12),I('vinegar',10),I('sesame-oil',5)],'salad',8],
  ['jp-65','日式芝麻菠菜','vegetable',all,[I('spinach',450),I('sesame',18),I('soy-sauce',10),I('sesame-oil',4)],'boil',6],
  ['jp-66','日式烤茄子','vegetable',all,[I('eggplant',3),I('miso',20),I('soy-sauce',8),I('cooking-oil',6),I('water',25)],'bake',20],
  ['jp-67','日式酱油炒乌冬','staple',hm,[I('udon',600),I('cabbage',250),I('carrot',100),I('pork-loin',180),I('soy-sauce',18),I('cooking-oil',7)],'stir',14],
  ['jp-68','荞麦面配鸡肉','staple',hm,[I('soba',300),I('chicken-breast',300),I('bok-choy',250),I('soy-sauce',16),I('sesame-oil',4),I('water',200)],'boil',16],
  ['jp-69','三文鱼蔬菜饭','staple',hm,[I('salmon',320),I('rice',220),I('broccoli',250),I('carrot',100),I('soy-sauce',15),I('water',300)],'rice',35],
  ['jp-70','日式饭团组合','staple',hm,[I('rice',240),I('salmon',180),I('nori',3),I('sesame',12),I('soy-sauce',8),I('water',330)],'rice',35],
]

export const japaneseRecipes = specs.map(([id,name,dishType,carbon,ingredients,method,cook]) => makeRecipe({
  id,name,cuisine:c,dishType,carbon:[...carbon],ingredients,method,cook,tags:['日式家庭味','全熟温食'],oven:method === 'bake',
}))
