<template>
	<!-- 菜品详情 -->
	<uni-popup ref="detailRef" type="bottom" :safe-area="false">
		<view class="bg-white pb-32">
			<view class="ta-c py-24 b-b-gray bg-title">{{currentFood.name}}</view>
			<scroll-view class="popup-box px-24 py-24" :scroll-y="true" :show-scrollbar="false">
				<view class="imgDetail br-8 o-h">
					<image class="wh-full" :src="'/static/img/' + currentFood.id + '.png'" mode="aspectFill"></image>
				</view>
				<view class="pt-24">食材：</view>
				<view v-for="(it, i) in currentFood.sideDishes" class="pl-32 mt-12 flex fs-24">
					<view class="mr-8">{{i+1}}.</view>
					<view class="">{{it}}；</view>
				</view>
				<view class="pt-24">调味料：</view>
				<view class="pl-32 mt-12">
					<view class="fs-24">{{currentFood.seasoning?.join('，') || ''}}</view>
				</view>
				<view class="pt-24">步骤：</view>
				<view v-for="(it,i) in currentFood.step" class="pl-32 mt-12 flex fs-24">
					<view class="mr-8">{{i+1}}.</view>
					<view class="">{{it}}；</view>
				</view>
				<view class="pt-24">小贴士：</view>
				<view v-for="(it,i) in currentFood.keyPoint" class="pl-32 mt-12 flex fs-24">
					<view class="mr-8">{{i+1}}.</view>
					<view class="">{{it}}；</view>
				</view>
			</scroll-view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {computed, ref, defineExpose} from 'vue';

	const detailRef = ref();
	const currentFood = ref({});
	const open = (data) => {
		currentFood.value = data;
		detailRef.value.open('bottom');
	}
	defineExpose({
		open
	})
</script>

<style scoped lang="scss">
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
</style>