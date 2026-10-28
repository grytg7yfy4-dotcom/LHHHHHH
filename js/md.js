/* ============================================================================
 *  极简 Markdown 渲染器
 *  只支持笔记里真正会用到的语法：标题、段落、粗斜体、行内代码、代码块、
 *  无序/有序列表（含 - [ ] 待办）、引用、表格、分割线、链接、图片。
 *  不引第三方库，离线、内网、手机都能跑。
 * ========================================================================== */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inline(s) {
    var codes = [];
    s = esc(s);
    // 行内代码先摘出来，免得里面的 ** 被当成加粗
    s = s.replace(/`([^`]+)`/g, function (_, c) {
      codes.push(c);
      return '\u0000' + (codes.length - 1) + '\u0000';
    });
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2">');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    s = s.replace(/\u0000(\d+)\u0000/g, function (_, n) {
      return '<code>' + codes[+n] + '</code>';
    });
    return s;
  }

  function isTableSep(line) {
    return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
  }

  function splitRow(line) {
    return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) {
      return c.trim();
    });
  }

  function render(src) {
    var lines = String(src == null ? '' : src).replace(/\r\n?/g, '\n').split('\n');
    var out = [];
    var i = 0;
    var para = [];

    function flush() {
      if (para.length) {
        out.push('<p>' + inline(para.join(' ')) + '</p>');
        para = [];
      }
    }

    while (i < lines.length) {
      var line = lines[i];

      // 代码块
      var fence = line.match(/^\s*```(\w*)\s*$/);
      if (fence) {
        var lang = fence[1] || '';
        var buf = [];
        i++;
        while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
          buf.push(lines[i]);
          i++;
        }
        i++;
        out.push(
          '<pre class="code' + (lang ? ' lang-' + esc(lang) : '') + '"><code>' +
          esc(buf.join('\n')) + '</code></pre>'
        );
        continue;
      }

      // 空行
      if (!line.trim()) { flush(); i++; continue; }

      // 分割线
      if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) { flush(); out.push('<hr>'); i++; continue; }

      // 标题
      var h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        flush();
        var lv = Math.min(h[1].length + 1, 6); // 笔记里 ## 当作正文小标题
        out.push('<h' + lv + '>' + inline(h[2]) + '</h' + lv + '>');
        i++;
        continue;
      }

      // 引用
      if (/^\s*>\s?/.test(line)) {
        flush();
        var q = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          q.push(lines[i].replace(/^\s*>\s?/, ''));
          i++;
        }
        out.push('<blockquote>' + render(q.join('\n')) + '</blockquote>');
        continue;
      }

      // 表格
      if (line.indexOf('|') > -1 && i + 1 < lines.length && isTableSep(lines[i + 1])) {
        flush();
        var head = splitRow(line);
        i += 2;
        var rows = [];
        while (i < lines.length && lines[i].indexOf('|') > -1 && lines[i].trim()) {
          rows.push(splitRow(lines[i]));
          i++;
        }
        var html = '<table><thead><tr>' +
          head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') +
          '</tr></thead><tbody>';
        rows.forEach(function (r) {
          html += '<tr>' + head.map(function (_, k) {
            return '<td>' + inline(r[k] || '') + '</td>';
          }).join('') + '</tr>';
        });
        out.push(html + '</tbody></table>');
        continue;
      }

      // 列表
      var li = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
      if (li) {
        flush();
        var items = [];
        while (i < lines.length) {
          var m = lines[i].match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
          if (!m) break;
          items.push({
            indent: m[1].replace(/\t/g, '  ').length,
            ordered: /\d/.test(m[2]),
            text: m[3]
          });
          i++;
          // 允许列表项的续行（缩进且不是新的一项）
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) &&
                 !/^(\s*)([-*+]|\d+\.)\s+/.test(lines[i])) {
            items[items.length - 1].text += ' ' + lines[i].trim();
            i++;
          }
        }
        out.push(buildList(items));
        continue;
      }

      para.push(line.trim());
      i++;
    }

    flush();
    return out.join('\n');
  }

  function buildList(items) {
    var top = [];
    items.forEach(function (it) {
      if (it.indent >= 2 && top.length) top[top.length - 1].sub.push(it);
      else top.push({ text: it.text, ordered: it.ordered, sub: [] });
    });

    var isOrdered = top.length && top[0].ordered;
    var html = isOrdered ? '<ol>' : '<ul>';
    top.forEach(function (it) {
      var task = it.text.match(/^\[([ xX])\]\s+(.*)$/);
      var body;
      if (task) {
        body = '<li class="task-item"><input type="checkbox" disabled' +
          (task[1].toLowerCase() === 'x' ? ' checked' : '') + '> ' + inline(task[2]) + '</li>';
      } else {
        body = '<li>' + inline(it.text);
      }
      if (it.sub.length) {
        var t = it.sub[0].ordered;
        body += (t ? '<ol>' : '<ul>') + it.sub.map(function (s) {
          return '<li>' + inline(s.text) + '</li>';
        }).join('') + (t ? '</ol>' : '</ul>');
      }
      if (!task) body += '</li>';
      html += body;
    });
    return html + (isOrdered ? '</ol>' : '</ul>');
  }

  global.MD = { render: render, esc: esc };
})(window);
