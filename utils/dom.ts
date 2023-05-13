let cacheRootDom: HTMLDivElement | undefined;

/**
 * 获取 Vue 的根 DOM。
 * @returns 应用根节点
 */
export function useRootDom(): HTMLDivElement {
  if (!cacheRootDom) {
    cacheRootDom = document.querySelector('#__nuxt') as HTMLDivElement;
  }
  return cacheRootDom;
}

/** 滚动到页顶。 */
export function backToTop() {
  document.documentElement.scrollTop = document.body.scrollTop = 0;
}
