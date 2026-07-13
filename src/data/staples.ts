import { ingredient as I } from '@/src/data/ingredients'
import type { CarbonDayType, Recipe } from '@/src/types'
import { makeRecipe, type CookingMethod } from './recipes/factory'

type StapleSeed = [string,string,string,number,CarbonDayType,CookingMethod]
const seeds: StapleSeed[] = [
  ['rice','米饭','rice',240,'high','rice'],['grain','杂粮饭','mixed-grain',240,'high','rice'],['udon','清汤乌冬面','udon',600,'high','boil'],['soba','荞麦面','soba',300,'high','boil'],['potato','蒸土豆','potato',600,'high','steam'],['sweet-potato','蒸红薯','sweet-potato',600,'high','steam'],['pumpkin','蒸贝贝南瓜','pumpkin',750,'high','steam'],['corn','蒸玉米','corn',3,'high','steam'],
  ['rice','米饭','rice',180,'medium','rice'],['grain','杂粮饭','mixed-grain',180,'medium','rice'],['soba','荞麦面','soba',240,'medium','boil'],['potato','蒸土豆','potato',450,'medium','steam'],['sweet-potato','蒸红薯','sweet-potato',450,'medium','steam'],['pumpkin','蒸贝贝南瓜','pumpkin',600,'medium','steam'],['corn','蒸玉米','corn',2,'medium','steam'],
  ['rice','少量米饭','rice',90,'low','rice'],['sweet-potato','小份蒸红薯','sweet-potato',240,'low','steam'],['pumpkin','小份蒸贝贝南瓜','pumpkin',300,'low','steam'],['corn','小份蒸玉米','corn',1,'low','steam'],['potato','小份蒸土豆','potato',240,'low','steam'],
]

export const stapleRecipes: Recipe[] = seeds.map(([key,name,ingredientId,amount,carbon,method], index) => makeRecipe({
  id:`staple-${carbon}-${key}-${index}`,
  name,
  cuisine:'chinese',
  dishType:'staple',
  carbon:[carbon],
  ingredients:[I(ingredientId,amount),I('water',ingredientId === 'rice' || ingredientId === 'mixed-grain' ? Math.round(amount * 1.45) : 1000, ingredientId === 'rice' || ingredientId === 'mixed-grain' ? '煮饭用' : '蒸煮用，不计实际摄入')],
  method,
  prep:5,
  cook:ingredientId === 'corn' ? 18 : ingredientId === 'rice' || ingredientId === 'mixed-grain' ? 30 : 22,
  tags:['碳循环主食',carbon === 'high' ? '足量主食' : carbon === 'medium' ? '适量主食' : '小份主食'],
}))
