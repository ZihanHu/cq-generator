<script lang="ts" setup>
import { Message, MessageReturn } from '@arco-design/web-vue';

import { Expose as CqPageExpose } from '~/components/cq/page.vue';
import { Cq } from '~/utils/cq';

type Status = 'loading' | 'failed' | 'success';
const status = ref('loading' as Status);

const query = useRoute().query;
const col = Number(query.col);
const row = Number(query.row);
const max = Number(query.max ?? '10');
const numbers = Number(query.numbers ?? '2');
if (Number.isNaN(col) || Number.isNaN(row)) {
  status.value = 'failed';
}

const exps = status.value === 'loading' ? Cq.generateRandomExpressions({
  num: col * row,
  max,
  numbers,
  operators: [Cq.Operator['+']],
}) : [];

const page = ref({} as CqPageExpose);

let loading: MessageReturn;
/** 弹窗是否打开。 */
const modalOpen = ref(false);
function handleAgain() {
  modalOpen.value = false;
  useRouter().go(0);
}
function handleCancel() {
  modalOpen.value = false;
}

onMounted(() => {
  loading = Message.loading({
    content: '正在保存',
    duration: -Infinity,
  });
  setTimeout(async () => {
    await page.value.save();
    loading.close();
    modalOpen.value = true;
  }, 500);
});
</script>

<template>
  <AModal
    v-model:visible='modalOpen'
    title='保存成功'
    unmount-on-close
    simple
    closable
    ok-text='再次生成'
    :esc-to-close='false'
    message-type='success'
    @ok='handleAgain'
    @cancel='handleCancel'
  >
    生成结果已下载。
  </AModal>
  <AResult v-if='status === "failed"' class='h-full flex flex-col justify-center' status='error' title='错误' />
  <CqPage v-else ref='page' :col='col' :row='row' :expressions='exps' />
</template>
