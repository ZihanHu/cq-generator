<script lang="ts" setup>
import htmlToCanvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { Expose as CqItemExpose } from '~/components/cq/item.vue';
import { Cq } from '~/utils/cq';

export interface Props {
  /**
   * 题目列表。
   *
   * 显示顺序：先列再行、从上到下、从左到右。
   */
  expressions: Cq.Expression[];
  /**
   * 题目列数。
   * @default 4
   */
  col?: number;
  /**
   * 题目行数。
   * @default 5
   */
  row?: number;
}
export interface SaveOptions {
  /** 文件名。 */
  filename?: string;
}
export interface Expose {
  /** 唯一 ID。 */
  id: string;
  /**
   * 保存为 PDF。
   * @param options 选项
   */
  save: (options?: SaveOptions) => Promise<void>;
}

const props = withDefaults(defineProps<Props>(), {
  col: 4,
  row: 5,
});

/** 保存为 PDF。 */
async function handleSave(options?: SaveOptions): Promise<void> {
  const filename = options?.filename ?? `口算训练_${id}`;
  const canvas = await htmlToCanvas(document.getElementById(id)!, {
    scale: 3,
    //@ts-expect-error
    dpi: 300,
  });
  const image = canvas.toDataURL();
  const pdf = new jsPDF({
    compress: true,
  });
  pdf.addImage(image, 'PNG', 0, 0, 210, 297);
  const url = pdf.output('bloburl');
  const el = document.createElement('a');
  el.setAttribute('href', url.toString());
  el.setAttribute('download', `${filename}.pdf`);
  el.click();
  el.remove();
}
const item = ref({} as CqItemExpose);

/** 唯一 ID 。 */
const id = `cq-page-${Math.floor(Math.random() * 1000)}`;

const exps = props.expressions;

/** 位置转表达式的值。 */
function posToExp(i: number, j: number) {
  return exps[(i - 1) * props.row + j - 1];
}
/** 每一列的宽度。 */
const width = ref('');
/** 重新计算每一列的宽度。 */
function computeWidth() {
  width.value = `${Math.floor(1 / props.col * 1000) / 10}%`;
}
computeWidth();

defineExpose<Expose>({
  id,
  save: handleSave,
});
</script>

<template>
  <div :id='id' class='paper-a4 mx-auto select-none'>
    <div class='w-max mx-auto mb-8'>
      <ATypographyTitle class='w-max m-0 justify-center' :heading='1'>
        口算训练
      </ATypographyTitle>
    </div>
    <div class='flex w-full h-full'>
      <div v-for='i of col' :key='i' class='h-full' :style='{ width }'>
        <template v-for='j of row' :key='`${i}-${j}`'>
          <CqItem v-if='posToExp(i, j)' class='mb-1' ref='item' :expression='posToExp(i, j)' />
        </template>
      </div>
    </div>
  </div>
</template>
