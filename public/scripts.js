// public/scripts.js

document.addEventListener('DOMContentLoaded', () => {
  const approveButtons = document.querySelectorAll('.button.approve');
  const completeButtons = document.querySelectorAll('.button.complete');
  const deleteButtons = document.querySelectorAll('.button.delete');
  const tabs = document.querySelectorAll('.tabs li a');

  approveButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const messageId = button.closest('.message').dataset.messageId;
      await approveMessage(messageId);
    });
  });

  completeButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const messageId = button.closest('.message').dataset.messageId;
      await completeMessage(messageId);
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      const messageId = button.closest('.message').dataset.messageId;
      await deleteMessage(messageId);
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', async (event) => {
      event.preventDefault();
      const tabType = tab.getAttribute('href').substring(1); // Get the tab type (e.g., 'pending' or 'completed')
      await switchTab(tabType);
    });
  });

  async function approveMessage(messageId) {
    // 发送异步请求将消息标记为已批准
    await fetch(`/approve/${messageId}`, { method: 'POST' });
    // 刷新页面或更新前端状态
    location.reload();
  }

  async function completeMessage(messageId) {
    // 发送异步请求将消息标记为已完成
    await fetch(`/complete/${messageId}`, { method: 'POST' });
    // 刷新页面或更新前端状态
    location.reload();
  }

  async function deleteMessage(messageId) {
    // 发送异步请求删除消息
    await fetch(`/delete/${messageId}`, { method: 'POST' });
    // 刷新页面或更新前端状态
    location.reload();
  }

  async function switchTab(tabType) {
    // 发送异步请求切换标签页
    await fetch(`/${tabType}`);
    // 刷新页面或更新前端状态
    location.reload();
  }
});
