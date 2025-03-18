<template>
	<view class="pager">
		<view class="container relative">
			<!-- 抽奖转盘 -->
			<view 
				class="plate relative o-h wh-full br-p-50" 
				:class="{rotate: loading}"
				:style="{transform:'rotate('+ initDeg +'deg)'}"
			>
				<view v-for="i in formData.prizeSize" class="cell" :style="{
					zIndex: i,
					clipPath: 'polygon(0% 0%, 100% 0%, ' + getDeg() + ')',
					transform:'rotate('+(i-1)*360/formData.prizeSize+'deg)',
					backgroundColor: i%2 ? '#FAF8F3' : '#FAE4B0'}"
				></view>
				<!-- 转盘数字 -->
				<view v-for="i in formData.prizeSize" class="prize c-white" :style="{transform:'rotate('+((i-1)*360/formData.prizeSize + 180/formData.prizeSize) +'deg)'}">
					{{i}}
				</view>
			</view>
			<!-- 灯光 -->
			<view v-for="i in formData.lightSize / 2" class="light-box" :class="flag ? 'on' : 'off'" :style="{transform:'rotate('+(i-1)*360/formData.lightSize+'deg)'}">
				<view></view>
				<view></view>
			</view>
			<!-- 抽奖指针 -->
			<view class="pointer">
				<view class="arrow"></view>
				<view class="center"></view>
			</view>
		</view>
		<view @click="onStart" class="uni-mx-16 bg-red br-16 mt-24 py-16 c-white ta-c fs-40">{{loading ? '停止' : '抽奖'}}</view>
		<view class="set flex-bc px-32 fs-28 c-white">
			<view @click="onSet">设置参数</view>
			<view @click="onReset">恢复默认设置</view>
		</view>
		<!-- 抽奖盘设置弹窗 -->
		<uni-popup ref="setRef" type="bottom" :safe-area="false" mask-background-color="rgba(0,0,0,0.6)">
			<view class="bg-white">
				<view class="ta-c py-24 b-b-gray bg-title">设置</view>
				<scroll-view :scroll-y="true" :show-scrollbar="false">
					<view class="px-16 py-24">
						<uni-forms :modelValue="data" label-width="100px" label-align="right">
							<uni-forms-item label="奖品数量:" name="prizeSize">
								<slider :value="data.prizeSize" @change="onChange($event,'prizeSize')" min="4" max="30" :block-size="16" show-value :step="2"/>
							</uni-forms-item>
							<uni-forms-item label="灯光数量:" name="lightSize">
								<slider :value="data.lightSize" @change="onChange($event,'lightSize')" min="4" max="20" :block-size="16" show-value :step="2"/>
							</uni-forms-item>
							<uni-forms-item label="灯光闪烁间隔:" name="flagSetp">
								<slider :value="data.flagSetp" @change="onChange($event,'flagSetp')" min="0.1" max="3" :block-size="16" show-value :step="0.1"/>
							</uni-forms-item>
						</uni-forms>
					</view>
				</scroll-view>
				<view class="flex-vc fs-28 ta-c gap-32 px-32 py-24 b-t-gray">
					<view @click="onCancel" class="bg-title flex-1 py-24 br-16">取消</view>
					<view @click="onSubmit" class="c-white flex-1 py-24 bg-orange br-16">确认</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="messageRef">
			<view class="py-24 px-32 br-16 bg-white">
				<text class="">{{msg}}</text>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {computed,onMounted,ref} from 'vue';
	
	const messageRef = ref();
	const setRef = ref();
	const msg = ref('');
	const data = ref({
		prizeSize: 4,	// 转盘等分数量
		lightSize: 12,	// 灯光数量
		flagSetp: 0.8,	// 灯光变换时间间隔
	});
	const formData = ref({
		prizeSize: 8,	// 转盘等分数量
		lightSize: 12,	// 灯光数量
		flagSetp: 0.8,	// 灯光变换时间间隔
	});
	// 转盘旋转中
	const loading = ref(false);
	// 旋转中
	const rotating = ref(false);
	// 初始角度
	const initDeg = ref(-180/formData.value.prizeSize);
	
	const getDeg = () => {
		const deg = Math.floor(360 / formData.value.prizeSize);
		if (deg > 45) {
			return 100 * Math.tan(Math.PI * (90-deg) / 180) + '% ' +'100%';
		} else {
			return '100% ' + 100 * Math.tan(Math.PI * deg / 180) + '%';
		}
	}
	
	const flag = ref(false);
	const timer = ref(null);
	
	const init = () => {
		timer.value && clearInterval(timer.value);
		timer.value = setInterval(() => {
			flag.value = !flag.value;
		}, formData.value.flagSetp * 1000);
	}
	
	const onStart = () => {
		loading.value = !loading.value;
		if (!loading.value) {
			setTimeout(() => {
				const target = Math.floor(Math.random() * 360);
				initDeg.value += 360 * 1 + target;
				const cell = 360 / formData.value.prizeSize;
				let index = 1;
				for(let i = 1; i <= formData.value.prizeSize; i++) {
					if (cell * i > target) {
						console.log(66666, i);
						index = i;
						break;
					}
				};
				// setTimeout(() => {
				// 	msg.value = '恭喜您抽中了' + (index) + '！';
				// 	messageRef.value.open('center');
				// 	setTimeout(() => {
				// 		messageRef.value.close();
				// 	}, 2000)
				// }, 2000)
				console.log('旋转角度：',initDeg.value,'    中奖区域：',index,'   区域数量：',formData.value.prizeSize ,'  区域角度：' ,cell, '  中奖角度：',target % 360);
			})
			formData.value.flagSetp = 0.8;
		} else {
			formData.value.flagSetp = 0.3;
		}
		init();
	}
	
	const onChange = (v, k) => {
		formData.value[k] = v.detail.value;
	}
	
	const onReset = () => {
		formData.value.lightSize = 12;
		formData.value.prizeSize = 12;
		formData.value.flagSetp = 0.8;
	}
	
	const onSet = () => {
		Object.assign(data.value, formData.value);
		setRef.value.open();
	}
	
	const onCancel = () => {
		setRef.value.close();
	}
	
	const onSubmit = () => {
		setRef.value.close();
	}
	
	onMounted(init);
</script>

<style scoped lang="scss">
	.pager {
		height: 100vh;
		background-color: #e1c5a2;
		overflow: hidden;
		.container {
			width: 600rpx;
			height: 600rpx;
			margin: 200rpx auto;
			border-radius: 50%;
			border: 50rpx solid #FA4634;
			.plate {
				transition: all 1.5s ease-out;
				&.rotate {
					animation: rotateAnimation 0.5s infinite linear;
				}
				.cell {
					width: 500rpx;
					height: 500rpx;
					position: absolute;
					left: 300rpx;
					top: 300rpx;
					transform-origin: left top;
				}
			}
			.pointer {
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background-color: #FA4634;
				z-index: 98;
				.arrow {
					width: 0;
					height: 0;
					position: absolute;
					bottom: 60rpx;
					left: 0;
					right: 0;
					margin: 0 auto;
					border-bottom: 160rpx solid #FA4634;
					border-left: 14rpx solid transparent;
					border-right: 14rpx solid transparent;
				}
				.center {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					top: 0;
					margin: auto;
					background-color: #fff;
					border-radius: 50%;
				}
			}
			.light-box {
				width: 36rpx;
				margin: 0 auto;
				position: absolute;
				z-index: 99;
				left: 0;
				right: 0;
				top: -42rpx;
				bottom: -42rpx;
				view {
					width: 100%;
					border-radius: 50%;
					height: 36rpx;
					background-color: #fff;
					&:last-child {
						position: absolute;
						bottom: 0;
					}
				}
				&.on {
					&:nth-child(odd) {
						view {
							background-color: #fff;
							box-shadow: 0 0 50rpx 30rpx #fff;
						}
						
					}
					&:nth-child(even) {
						view {
							background-color: #c6c6c6;
						}
					}
				}
				&.off {
					&:nth-child(odd) {
						view {
							background-color: #c6c6c6;
						}
						
					}
					&:nth-child(even) {
						view {
							background-color: #fff;
							box-shadow: 0 0 50rpx 30rpx #fff;
						}
					}
				}
			}
			.prize {
				width: 48rpx;
				margin: 0 auto;
				position: absolute;
				z-index: 97;
				left: 0;
				right: 0;
				top: -42rpx;
				bottom: -42rpx;
				padding-top: 100rpx;
				text-align: center;
				color: #000;
			}
		}
		.set {
			position: absolute;
			bottom: 30rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
		}
	}
	/* 定义旋转动画 */
	@keyframes rotateAnimation {
	  from {
	    transform: rotate(0deg);
	  }
	  to {
	    transform: rotate(360deg);
	  }
	}
</style>