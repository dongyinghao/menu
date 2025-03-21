<template>
	<view class="pager flex-v o-h relative">
		<view class="header px-32 flex-none pb-24">
			<view class="py-24 flex-bc c-white">
				<view class="flex flex-vc">
					<image class="avatar" src="/static/icon/avatar.png"></image>
					<view class="pl-24">爸爸厨房</view>
				</view>
				<text class="fs-56">+</text>
			</view>
			<view class="py-12 px-16">
				<view class="search-box px-32 flex-vc">
					<input class="fs-28 h-full grow mr-16" placeholder="搜索美食" placeholder-class="c-gray" />
					<image src="/static/icon/search.png"></image>
				</view>
			</view>
		</view>
		<scroll-view :scroll-y="true" :show-scrollbar="false" class="main pb-24 px-24 border-box flex-auto o-h"
			:class="{isFixed}" @scroll="onScroll">
			<!--轮播-->
			<view class="pt-24">
				<swiper class="swiper" circular :autoplay="true" :interval="5000" :duration="500">
					<swiper-item v-for="it in silders">
						<view class="swiper-item flex-cc">
							<image :src="getImg(it.id)" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<!--菜品分类 -->
			<scroll-view :scroll-x="true" :show-scrollbar="false" class="b-b-gray food-type">
				<view class="flex gap-32 py-24">
					<view v-for="it in foodType"
						  class="type-cell px-32 py-8 noWrap fs-28"
						  :class="{active: currentType === it.type}"
						  @click="onTypeClick(it)"
					>{{it.name}}</view>
				</view>
			</scroll-view>
			<view v-show="isFixed" class="food-type-placeholder"></view>
			<!--菜品列表-->
			<view class="flex-auto o-a flex-v">
				<view class="flex gap-16 py-16 flex-wrap pl-4">
					<view v-for="it in currentMenu" class="menu-cell px-12 pt-12 fs-28 flex fd-c flex"
						:class="{active: selectedFood.has(it.name) && selectedFood.get(it.name).number}">
						<view @click="onFoodDetail(it)" class="flex-auto o-h br-16">
							<image :src="getImg(it.id)" mode="aspectFill"></image>
						</view>
						<view class="py-24 flex-bc flex-none bold">
							<text>{{it.name}}</text>
							<view class="flex-vc">
								<view 
									v-show="selectedFood.has(it.name) && selectedFood.get(it.name).number"
									@touchstart="selectedFood.delete(it.name)" 
									class="icon-sub mr-16"
								></view>
								<view @touchstart="onFoodAdd($event, it)" class="icon-add"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 购物车悬浮按钮 -->
		<view 
		 ref="cartRef"
		 @click="onCartDetail"
		 @touchstart="onMousedown" 
		 @touchend="onMouseup"
		 @touchmove.stop="onTouchmove" 
		 id="myElement" 
		 class="shopping-cart flex-cc relative" 
		 :style="{top: currentPosition.top, left: currentPosition.left}"
		 :class="{transition: needTransition}"
		>
			<image src="/static/icon/shopping-cart.png"></image>
			<uni-badge :text="totalFoods" :offset="[4, -12]" absolute="rightTop"></uni-badge>
		</view>
		<view 
			class="ball"
  		    v-show="ball.show"
		    :style="{top:ball.top,left:ball.left,width:ball.width+'px',height: ball.width+'px'}"
		></view>
		<!-- 购物车弹窗 -->
		<uni-popup ref="popupCartRef" type="bottom" :safe-area="false" mask-background-color="rgba(0,0,0,0.6)">
			<view class="bg-white">
				<view class="ta-c py-24 b-b-gray bg-title">共计 <text class="bold">{{totalFoods}}</text> 道菜品</view>
				<scroll-view class="popup-box" :scroll-y="true" :show-scrollbar="false">
					<view v-for="([k,v], i) in selectedFood" class="flex-bc py-16 px-24">
						<view class="flex-vc">
							<text class="mr-20 fs-28">{{i + 1}}</text>
							<view class="icon-food mr-20">
								<image class="wh-full br-12" :src="getImg(v.data.id)"></image>
							</view>
							<view class="food-name oneline fs-28">{{v.data.name}}</view>
						</view>
						<view class="flex-vc fs-32">
							<view class="icon-add" @click="++v.number"></view>
							<view class="uni-mx-8">{{v.number}}<text class="uni-ml-1">份</text></view>
							<view class="icon-sub" @click="onSubNumber(v)"></view>
						</view>
					</view>
					<view v-show="!selectedFood.size" class="pt-32 flex px-16 fs-24 pb-24">
						<view class="py-8 mr-16 flex-none">自动选菜：</view>
						<view class="flex flex-wrap gap-16">
							<view class="br-12 b-orange bg-orange-1 px-12 py-8" @click="onAutoCreateMenu(2)">情侣餐</view>
							<view class="br-12 b-orange bg-orange-1 px-12 py-8" @click="onAutoCreateMenu(3)">三菜一汤</view>
							<view class="br-12 b-orange bg-orange-1 px-12 py-8" @click="onAutoCreateMenu(4)">四菜一汤</view>
							<view class="br-12 b-orange bg-orange-1 px-12 py-8" @click="onAutoCreateMenu(5)">五菜一汤</view>
							<view class="br-12 b-orange bg-orange-1 px-12 py-8" @click="onAutoCreateMenu(99)">节日套餐</view>
							<view class="br-12 b-orange bg-orange-1 px-12 py-8" @click="onAutoCreateMenu(100)">斋饭套餐</view>
						</view>
					</view>
					
					<view class="flex-vc fs-28 ta-c gap-32 px-32 py-24 b-t-gray" v-show="selectedFood.size">
						<view @click="onClear" class="bg-title flex-1 py-24 br-16">全部清除</view>
						<view @click="onSubmit" class="c-white flex-2 py-24 bg-orange br-16">下单</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		<!-- 提示信息弹窗 -->
		<uni-popup ref="messageRef">
			<view class="py-24 px-32 br-16 bg-white">
				<text class="">下单成功!</text>
			</view>
		</uni-popup>
		
		<!-- 菜品详情 -->
		<food-detail ref="foodDetailRef"></food-detail>
	</view>
</template>

<script setup>
	import {computed,ref} from 'vue';
	import {foodType,foods,silders} from '../../data/menu.js';
	import imgUrlMap from '../../data/nameAndUrlMap.js';
	import FoodDetail from './components/foodDetail.vue';
	
	const cartRef = ref();
	const messageRef = ref();
	const popupCartRef = ref();
	const foodDetailRef = ref();
	const currentPosition = ref({
		top: '60%',
		left: '12rpx'
	});
	const ball = ref({
		top: 0,
		left: 0,
		width: 20,
		show: false
	});
	const message = ref({
		type: 20,
		text: false
	});
	const needTransition = ref(false);
	// 当前菜品类型
	const currentType = ref(-1);
	const currentMenu = computed(() => {
		return foods.filter(it => (currentType.value === -1 && !it.type.includes(12) && !it.type.includes(13)) || it.type.includes(currentType.value));
	})
	const totalFoods = computed(() => {
		let i = 0;
		selectedFood.value.forEach(v => {
			i += v.number
		})
		return i;
	})

	const selectedFood = ref(new Map());
	const onTypeClick = (data) => {
		currentType.value = data.type;
	}

	// 获取图片地址
	const getImg = (id) => {
		return imgUrlMap[id];
	}

	// 点击食物
	const onFoodDetail = (data) => {
		foodDetailRef.value.open(data);
	}

	const onClear = () => {
		selectedFood.value.clear();
	}

	// 自动生成菜单，n:人数
	const onAutoCreateMenu = (n) => {
		const list = [];
		if (n === 2) {
			// 1汤，1特色菜，1荤菜，1青菜
			const a = findFoodByRandom(1, 14);
			const b = findFoodByRandom(1, 0);
			const c = findFoodByRandom(1, 2, [0,14]);
			const d = findFoodByRandom(1, 1);
			list.push(...a,...b,...c,...d);
		} else if (n === 3) {
			// 1汤，2荤菜，1青菜
			const a = findFoodByRandom(1, 14);
			const b = findFoodByRandom(2, 2, [14]);
			const c = findFoodByRandom(1, 1);
			list.push(...a,...b,...c);
		} else if (n === 4) {
			// 1汤，3荤菜，1青菜
			const a = findFoodByRandom(1, 14);
			const b = findFoodByRandom(3, 2, [14]);
			const c = findFoodByRandom(1, 1);
			list.push(...a,...b,...c);
		} else if (n === 5) {
			// 1汤，1特色菜，2荤菜，1凉菜，1青菜
			const a = findFoodByRandom(1, 14);
			const b = findFoodByRandom(1, 0);
			const c = findFoodByRandom(2, 2, [0,14]);
			const d = findFoodByRandom(1, 9);
			const e = findFoodByRandom(1, 1);
			list.push(...a,...b,...c,...d,...e);
		} else if (n === 99) {
			// 1汤，1特色菜，2荤菜，1凉菜，1鱼，1粉蒸，1青菜
			const a = findFoodByRandom(1, 14);
			const b = findFoodByRandom(1, 0);
			const c = findFoodByRandom(2, 2, [0,8,14,4]);
			const d = findFoodByRandom(1, 9);
			const e = findFoodByRandom(1, 8);
			const f = findFoodByRandom(1, 4);
			const g = findFoodByRandom(1, 1);
			list.push(...a,...b,...c,...d,...e,...f,...g);
		} else if (n === 100) {
			// 米汤，凉菜，3素菜
			const a = findFoodByRandom(1, 9);
			const b = findFoodByRandom(3, 1,[14]);
			const c = findFoodByIds(['140022']);
			list.push(...a,...b,...c);
		}
		selectedFood.value.clear();
		list.forEach(it => {
			const selected = selectedFood.value.get(it.name);
			if (selected) {
				++selected.number;
			} else {
				selectedFood.value.set(it.name, {
					number: 1,
					data: it
				});
			}
		})
	}
	
	// 随机选择菜品，exclude:排除的类型
	const findFoodByRandom = (n, type, exclude) => {
		const excludeList = [7,11,12,12,15,16,19,20];
		// 如果没有type就排除指定类型，否则排除type类型;如果指定了exclude就需要排除exclude类型
		const filterTypeMenu = JSON.parse(JSON.stringify(foods.filter(it => {
			return (type === undefined && !excludeList.some(t => it.type.includes(t))) || it.type.includes(type) &&
			!(exclude || []).some(t => it.type.includes(t));
		})));
		if (n >= filterTypeMenu.length) return filterTypeMenu;
		const selected = [];
		for(let i = 0; i < n; i++) {
			const idx = getRandomNumber([0, filterTypeMenu.length]);
			selected.push(filterTypeMenu[idx]);
			filterTypeMenu.splice(idx, 1);
		}
		return selected;
	}
	
	const findFoodByIds = (ids) => {
		return foods.filter(it => ids.includes(it.id));
	}
	
	// 在指定整数区间内获取一个随机数array: [0-99]
	const getRandomNumber = (array) => {
		const start = array[0] || 0;
		const end = array[1] || 100;
		return start + Math.floor(Math.random() * end);
	}

	// 下单
	const onSubmit = () => {
		message.value.text = '下单成功！';
		messageRef.value.open('center');
		setTimeout(() => {
			messageRef.value.close();
		}, 2000);
		popupCartRef.value.close();
	}

	// 减少数量
	const onSubNumber = (data) => {
		if (data.number > 1) {
			--data.number;
		} else {
			selectedFood.value.delete(data.data.name);
		}
	}

	// 点击购物车
	const onCartDetail = (data) => {
		popupCartRef.value.open('bottom');
	}

	// 点击添加购物车
	const onFoodAdd = (e, data) => {
		throwBall(e.touches[0], () => {
			const selected = selectedFood.value.get(data.name);
			if (selected) {
				++selected.number;
			} else {
				selectedFood.value.set(data.name, {
					number: 1,
					data
				});
			}
			console.log('已选择菜品', selectedFood.value);
		});
	}

	const throwBall = (data, cb) => {
		var x1 = data.pageX - 10;
		var y1 = data.pageY - 10;
		const query = uni.createSelectorQuery();
		query.select('#myElement').boundingClientRect((rect) => {
			var x3 = rect.left + 20;
			var y3 = rect.top + 20;
			const p = findPassPoint({x1,y1}, {x2: x3,y2: y3});
			const x2 = p.x;
			const y2 = p.y;
			let x = x1,y = y1;
			let size = 20;
			const w = x3 - x1;
			const setpX = w / 20;
			const stepY = (y3 - y1) / 10;
			const {a,b,c} = getEquation({x1,y1,x2,y2,x3,y3});
			var timer = setInterval(() => {
				const realTimeD = distance(x3,y3, x, y);
				if (realTimeD > 25) {
					x += setpX;
					if (Math.abs(w) < 24) {
						y += stepY;
					} else {
						y = a * x * x + b * x + c;
					}
					ball.value.show = true;
					ball.value.left = x + 'px';
					ball.value.width -= 0.5;
					ball.value.top = y + 'px';
				} else {
					ball.value.show = false;
					ball.value.width = 20;
					clearInterval(timer);
					cb();
				}
			}, 20);
		}).exec();
	}

	// 按下购物车按钮
	const onMousedown = (e) => {
		needTransition.value = false;
	}

	// 按下购物车按钮
	const onTouchmove = (e) => {
		const ev = e.touches[0];
		currentPosition.value.left = ev.pageX * 2 - 70 + 'rpx';
		currentPosition.value.top = Math.min(ev.pageY * 2 - 100, 1430) + 'rpx';
	}

	// 按下购物车按钮
	const onMouseup = (e) => {
		needTransition.value = true;
		if (e.currentTarget.offsetLeft < 186) {
			currentPosition.value.left = '12rpx';
		} else {
			currentPosition.value.left = '646rpx';
		}
		if (e.currentTarget.offsetTop < 20) {
			currentPosition.value.top = '14rpx';
		}
	}

	const isFixed = ref(false);
	const onScroll = (e) => {
		isFixed.value = e.detail.scrollTop > 178;
	}

	// 根据三个点的坐标计算二次抛物线公式的常量
	const getEquation = ({x1,y1,x2,y2,x3,y3}) => {
		// var a = ((y1 - y3) * (x1 - x2) - (y1 - y2) * (x1 - x3)) / ((x1 * x1 - x3 * x3) * (x1 - x2) - (x1 * x1 - x2 * x2) * (x1 - x3));
		// var b = ((y3 - y1) - a * (x3 * x3 - x1 * x1)) / (x3 - x1);
		// var c = y1 - a * x1 * x1 - b * x1;
		// 计算分母
		const denominator = (x1 - x2) * (x1 - x3) * (x2 - x3);
		// 计算系数a
		const a = (y1 * (x2 - x3) + y2 * (x3 - x1) + y3 * (x1 - x2)) / denominator;
		// 计算系数b
		const b = (y1 * (x3 * x3 - x2 * x2) + y2 * (x1 * x1 - x3 * x3) + y3 * (x2 * x2 - x1 * x1)) / denominator;
		// 计算系数c
		const c = (y1 * x2 * x3 * (x2 - x3) + y2 * x1 * x3 * (x3 - x1) + y3 * x1 * x2 * (x1 - x2)) / denominator;
		return {a,b,c};
	}

	// 找到路径必经点(该点的作用在于使小球路径更像抛球的效果)
	// 第一个点为起点，第二个点为终点
	const findPassPoint = ({x1,y1}, {x2,y2}) => {
		// 找到坐标位置更高的一个点(y值小位置越高)
		const heigher = y1 < y2 ? {x: x1,y: y1} : {x: x2,y: y2};
		// 如果是起点更高
		if (heigher.x === x1 && x2 > x1 || heigher.x === x2 && x2 < x1) {
			return {
				x: heigher.x + 10,
				y: heigher.y - 10
			}
		} else {
			return {
				x: heigher.x - 10,
				y: heigher.y - 10
			}
		}
	}

	const distance = (x1, y1, x2, y2) => {
		const dx = Math.abs(x2 - x1);
		const dy = Math.abs(y2 - y1);
		return Math.sqrt(dx * dx + dy * dy);
	}
</script>

<style scoped lang="scss">
	.pager {
		height: 100vh;
		.ball {
			width: 20px;
			height: 20px;
			background-color: #FF8F1F;
			position: fixed;
			border-radius: 50%;
		}
		.header {
			background: linear-gradient(270deg, #FEBE52 0%, #FF8F1F 100%);
			padding-top: 80rpx;

			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
			}

			.search-box {
				height: 72rpx;
				background-color: #F3F4F6;
				border-radius: 36rpx;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.main {
			.type-cell {
				background-color: rgba(#FF8F1F, 0.1);
				border-radius: 12rpx;

				&.active {
					color: #fff;
					background-color: #FF8F1F;
				}
			}

			.swiper {
				height: 320rpx;

				.swiper-item {
					height: 100%;
					border-radius: 32rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.menu-cell {
				width: 312rpx;
				height: 360rpx;
				border-radius: 32rpx;
				border: 1px solid transparent;
				box-shadow: 0 0 6rpx 0 #ddd;
				&.active {
					border: 1px solid #FF8F1F;
				}
				image {
					width: 100%;
					height: 100%;
				}
			}

			&.isFixed {
				.food-type {
					position: fixed;
					top: 322rpx;
					width: 100%;
					left: 0;
					z-index: 2;
					background-color: #fff;
					padding-left: 24rpx;
					padding-right: 24rpx;
				}

				.food-type-placeholder {
					height: 100rpx;
				}
			}
		}

		.shopping-cart {
			width: 96rpx;
			height: 96rpx;
			background-color: #FF8F1F;
			border-radius: 50%;
			position: absolute;
			z-index: 3;
			box-shadow: 0 0 18rpx 2rpx rgba(#B95305, 0.5);
			&.transition {
				transition: 0.2s linear all;
			}

			image {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.popup-box {
			max-height: 1000rpx;
			min-height: 200rpx;

			.food-name {
				width: 260rpx;
			}

			.icon-food {
				width: 80rpx;
				height: 80rpx;
				background-color: #ddd;
				border-radius: 12rpx;
			}

			.imgDetail {
				height: 400rpx;
				width: 700rpx;
			}
		}
	}
</style>