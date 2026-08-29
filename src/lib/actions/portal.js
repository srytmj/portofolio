/**
 * Move a node to the end of <body> (or another target) so it escapes any
 * ancestor stacking context / overflow. Use for modals, tooltips, popovers.
 *
 * @param {HTMLElement} node
 * @param {string | HTMLElement} [target]
 */
export function portal(node, target = 'body') {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) el.appendChild(node);
  return {
    destroy() {
      node.parentNode?.removeChild(node);
    }
  };
}
