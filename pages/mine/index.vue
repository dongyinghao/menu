<template>
	<view>用户中心</view>
</template>

<script setup>
	import {computed,ref} from 'vue';
	import {foodType,foods,silders} from '../../data/menu.js';
	import FoodDetail from './components/foodDetail.vue';
	
	const cartRef = ref();
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

	// 点击食物
	const onFoodDetail = (data) => {
		foodDetailRef.value.open(data);
	}

	const onClear = () => {
		selectedFood.value.clear();
	}

	// 自动生成菜单，n:人数
	const onAutoCreateMenu = (n) => {
		
	}

	const onSubmit = () => {
		
	}

	// 减少数量
	const onSubNumber = (data) => {
		if (data.number) {
			--data.number;
		} else {
			selectedFood.value.delete(data.data.name);
		}
	}

	// 点击购物车
	const onCartDetail = (data) => {
		popupCartRef.value.open('bottom')
	}

	// 点击添加购物车
	const onFoodAdd = (e, data) => {
		console.log('点击添加菜品事件：', e);
		throwBall(e.touches[0], () => {
			console.log('添加菜品：', data.name);
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
			console.log('横轴步距：', setpX, w);
			console.log('纵轴步距：', stepY);
			const {a,b,c} = getEquation({x1,y1,x2,y2,x3,y3});
			var timer = setInterval(() => {
				const realTimeD = distance(x3,y3, x, y);
				console.log('实时距离：', realTimeD);
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
		console.log('手指按下', e);
		needTransition.value = false;
	}

	// 按下购物车按钮
	const onTouchmove = (e) => {
		const ev = e.touches[0];
		console.log('手指拖动', ev);
		currentPosition.value.left = ev.pageX * 2 - 48 + 'rpx';
		currentPosition.value.top = ev.pageY * 2 - 100 + 'rpx';
	}

	// 按下购物车按钮
	const onMouseup = (e) => {
		console.log('手指抬起', e);
		needTransition.value = true;
		if (e.currentTarget.offsetLeft < 186) {
			currentPosition.value.left = '12rpx';
		} else {
			currentPosition.value.left = '646rpx';
		}
		console.log(e.currentTarget);
	}

	const isFixed = ref(false);
	const onScroll = (e) => {
		isFixed.value = e.detail.scrollTop > 184;
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
					top: 324rpx;
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
				width: 100rpx;
				height: 100rpx;
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