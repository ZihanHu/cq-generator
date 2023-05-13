<script lang="ts" setup>
import { Cq } from '~/utils/cq';
import { VueLatex } from 'vatex';

export interface Props {
  max?: number;
  expression: Cq.Expression;
  fontSize?: number;
}
export interface Expose {
  text: string;
}

const props = withDefaults(defineProps<Props>(), {
  max: 9,
  fontSize: 18,
});

const text = Cq.expressionToString(props.expression, true) + '=';

defineExpose<Expose>({
  text,
});
</script>

<template>
  <VueLatex class='block select-none' :expression='text' :fontsize='props.fontSize' />
</template>
