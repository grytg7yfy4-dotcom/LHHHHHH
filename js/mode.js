/* ============================================================================
 *  运行模式判断：只读 or 可编辑
 *
 *  - file:// 打开、localhost / 127.0.0.1 → 可编辑（就是你自己）
 *  - 其他域名（github.io 等）→ 只读（访客看到的是提交进仓库的存档）
 *  - URL 带 ?edit=1 强制可编辑，?ro=1 强制只读（本机预览线上效果用）
 * ========================================================================== */
(function (g) {
  'use strict';

  g.detectReadonly = function (loc) {
    loc = loc || g.location || {};
    var q = String(loc.search || '').toLowerCase();
    if (/(^|[?&])edit=1(&|$)/.test(q)) return false;
    if (/(^|[?&])ro=1(&|$)/.test(q)) return true;
    if (loc.protocol === 'file:') return false;
    var h = String(loc.hostname || '').toLowerCase();
    return !(h === '' || h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]');
  };
})(window);
