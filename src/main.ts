import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { marked } from 'marked';
import './styles.css';

const contentDiv = document.getElementById('content') as HTMLDivElement;
const fileNameSpan = document.getElementById('file-name') as HTMLSpanElement;
const openFileBtn = document.getElementById('open-file') as HTMLButtonElement;
const themeToggleBtn = document.getElementById('theme-toggle') as HTMLButtonElement;

// 設定 marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 主題管理
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

async function openMarkdownFile() {
  try {
    // 開啟檔案選擇對話框
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Markdown',
        extensions: ['md', 'markdown', 'txt']
      }]
    });

    if (selected) {
      // 讀取檔案內容
      const content = await readTextFile(selected as string);

      // 渲染 Markdown
      const html = await marked(content);
      contentDiv.innerHTML = html;

      // 顯示檔案名稱
      const fileName = (selected as string).split(/[\\/]/).pop() || '';
      fileNameSpan.textContent = fileName;
    }
  } catch (error) {
    console.error('Error opening file:', error);
    contentDiv.innerHTML = `<p style="color: red;">開啟檔案時發生錯誤: ${error}</p>`;
  }
}

// 綁定按鈕事件
openFileBtn.addEventListener('click', openMarkdownFile);
themeToggleBtn.addEventListener('click', toggleTheme);

// 初始化
loadTheme();
contentDiv.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 100px;">點擊上方按鈕開啟 Markdown 檔案</p>';
