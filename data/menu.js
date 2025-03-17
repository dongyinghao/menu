import huncai from './huncai.js'
import sucai from './sucai.js'
import tang from './tang.js'
import tangguo from './tangguo.js'
import liangcai from './liangcai.js'
import ganguo from './ganguo.js'
import mianshi from './mianshi.js'
import zaocan from './zaocan.js'
import shaokao from './shaokao.js'
import huoguo from './huoguo.js'

// 标签分类
// 1-辣，2-清淡，3-
// 菜品分类
export const foodType = [
	{
		type: -1,
		sort: -1,
		name: '全部',
	},
	{
		type: 0,
		sort: 0,
		name: '特色菜',
	},
	{
		type: 2,
		sort: 2,
		name: '荤菜',
	},
	{
		type: 1,
		sort: 1,
		name: '素食',
	},
	{
		type: 3,
		sort: 3,
		name: '油炸类',
	},
	{
		type: 4,
		sort: 4,
		name: '粉蒸类',
	},
	{
		type: 5,
		sort: 5,
		name: '鸡鸭兔',
	},
	{
		type: 6,
		sort: 6,
		name: '牛羊类',
	},
	{
		type: 7,
		sort: 7,
		name: '粥类',
	},
	{
		type: 8,
		sort: 8,
		name: '鱼',
	},
	{
		type: 9,
		sort: 9,
		name: '凉菜类',
	},
	{
		type: 10,
		sort: 10,
		name: '干锅类',
	},
	{
		type: 11,
		sort: 11,
		name: '汤锅类',
	},
	{
		type: 12,
		sort: 12,
		name: '火锅',
	},
	{
		type: 13,
		sort: 13,
		name: '烧烤',
	},
	{
		type: 14,
		sort: 14,
		name: '汤类',
	},
	{
		type: 15,
		sort: 15,
		name: '饮料类',
	},
	{
		type: 16,
		sort: 16,
		name: '佐料类',
	},
	{
		type: 17,
		sort: 17,
		name: '河鲜',
	},
	{
		type: 18,
		sort: 18,
		name: '海鲜',
	},
	{
		type: 19,
		sort: 19,
		name: '早餐',
	},
	{
		type: 20,
		sort: 20,
		name: '面食',
	},
];

export const silders = [
	{id: '0028'},
	{id: '0041'},
	{id: '0055'},
	{id: '0014'},
	{id: '0025'},
	{id: '0065'},
	{id: '0039'},
]

// 所有菜品
export const foods = [
	...huncai,
	...sucai,
	...tang,
	...ganguo,
	...tangguo,
	...liangcai,
	...zaocan,
	...mianshi,
	...huoguo,
	...shaokao,
]