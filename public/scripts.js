// public/scripts.js

function addMessage() {
    var name = document.getElementById('name').value;
    var tool = document.getElementById('tool').value;
    var link = document.getElementById('link').value;
    var quantity = document.getElementById('quantity').value;

    if (name && tool && quantity) {
        var messageDiv = createMessageDiv(name, tool, link, quantity);
        var messagesDiv = document.getElementById('messages');
        messagesDiv.insertBefore(messageDiv, messagesDiv.firstChild);
    } else {
        alert('請填寫完整信息！');
    }
}

function createMessageDiv(name, tool, link, quantity) {
    var messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <strong>${name}</strong> said：
        <br>需要工具 (Tool)：${tool}
        ${link ? `<br>工具網站鏈接 (Tool Link)：${link}` : ''}
        <br>數量 (Quantity)：${quantity}
        <br>時間 (Date)：${new Date().toLocaleString('en-GB', { hour12: false })}
        <div class="actions">
            <button onclick="approveMessage(this.parentElement.parentElement)">等待批准 (Waiting for approval)</button>
            <button onclick="deleteMessage(this.parentElement.parentElement)">刪除 (Delete)</button>
        </div>
    `;

    return messageDiv;
}

function completeMessage(messageId) {
    messageDiv.remove();
    // 在資料庫中刪除留言
    var messageId = messageDiv.dataset.messageId;
    fetch(`/delete/${messageId}`, { method: 'POST' });
}

function approveMessage(messageDiv) {
    messageDiv.classList.add('pending');
    var buttons = messageDiv.querySelector('.actions').querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent === '等待批准 (Waiting for approval)') {
            button.textContent = '已完成 (Finish)';
            button.onclick = () => completeMessage(messageDiv.dataset.messageId);
        }
    });
}

function deleteMessage(messageDiv) {
    messageDiv.remove();
    // 在資料庫中刪除留言
    var messageId = messageDiv.dataset.messageId;
    fetch(`/delete/${messageId}`, { method: 'POST' });
}
