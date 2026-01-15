import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { marked } from 'marked';
import './styles.css';

const contentDiv = document.getElementById('content') as HTMLDivElement;
const fileNameSpan = document.getElementById('file-name') as HTMLSpanElement;
const openFileBtn = document.getElementById('open-file') as HTMLButtonElement;

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

async function openMarkdownFile() {
  try {
    // 打开文件选择对话框
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Markdown',
        extensions: ['md', 'markdown', 'txt']
      }]
    });

    if (selected) {
      // 读取文件内容
      const content = await readTextFile(selected as string);

      // 渲染 Markdown
      const html = await marked(content);
      contentDiv.innerHTML = html;

      // 显示文件名
      const fileName = (selected as string).split(/[\\/]/).pop() || '';
      fileNameSpan.textContent = fileName;
    }
  } catch (error) {
    console.error('Error opening file:', error);
    contentDiv.innerHTML = `<p style="color: red;">打开文件时出错: ${error}</p>`;
  }
}

// 绑定按钮事件
openFileBtn.addEventListener('click', openMarkdownFile);

// 初始化提示
contentDiv.innerHTML = '<p style="color: #666; text-align: center; margin-top: 100px;">点击上方按钮打开 Markdown 文件</p>';
