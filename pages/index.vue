<script lang="ts" setup>
interface Input {
  num: number;
  numbers: number;
  max: number;
}
const input = ref({
  num: 100,
  numbers: 2,
  max: 10,
} as Input);

function generateNumbersExample(numbers: number) {
  let ans = '3';
  for (let i = 2; i <= numbers; ++i) {
    ans += `+${i + 2}`;
  }
  return ans;
}

async function handleGenerate() {
  const { num, numbers, max } = input.value;
  await navigateTo({
    path: '/view',
    query: {
      col: 4,
      row: Math.floor(num / 4),
      numbers,
      max,
    },
  });
}
</script>

<template>
  <div class='m-10'>
    <ATypographyTitle class='text-center' :heading='1'>
      口算训练生成器
    </ATypographyTitle>
    <AForm :model='input' @submit-success='handleGenerate'>
      <AFormItem field='num' label='题目数量' required>
        <AInputNumber class='w-32' v-model='input.num' mode='button' :precision='0' :step='1' :min='1' :max='100' />
      </AFormItem>
      <AFormItem field='numbers' label='数值个数' required>
        <AInputNumber class='w-32' v-model='input.numbers' mode='button' :precision='0' :step='1' :min='2' :max='5' />
        <template #help>
          单个算式的数字数量。<br />
          如算式“{{ generateNumbersExample(input.numbers) }}”有 {{ input.numbers }} 个数字。
        </template>
      </AFormItem>
      <AFormItem field='max' label='最大值' required>
        <AInputNumber class='w-32' v-model='input.max' mode='button' :precision='0' :step='1' :min='10' :max='100' />
        <template #help>
          算式中的数字不会超过 {{ input.max }}。<br />
          计算时，每一步的结果也不会超过 {{ input.max }}。
        </template>
      </AFormItem>
      <AFormItem>
        <AButton type='primary' html-type='submit'>
          生成
        </AButton>
      </AFormItem>
    </AForm>
  </div>
</template>
