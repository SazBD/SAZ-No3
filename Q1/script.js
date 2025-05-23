const bubbleContainer = document.getElementById('bubble-container');
const jumpButton = document.getElementById('jump-button');
let bubbleInterval;

// 创建气泡
function createBubble() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  const size = Math.random() * 80 + 20; // 随机大小（更大）
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}vw`; // 随机水平位置
  bubble.style.animationDuration = `${Math.random() * 1.5 + 1}s`; // 更快的动画时长
  bubbleContainer.appendChild(bubble);

  // 动画结束后移除气泡
  bubble.addEventListener('animationend', () => {
    bubble.remove();
  });
}

// 按钮点击事件
jumpButton.addEventListener('click', () => {
  jumpButton.style.display = 'none'; // 隐藏按钮
  bubbleInterval = setInterval(createBubble, 50); // 更高频率生成气泡

  setTimeout(() => {
    clearInterval(bubbleInterval); // 停止生成气泡
    bubbleContainer.innerHTML = ''; // 清空气泡
    window.location.href = 'nextpage.html'; // 跳转到目标页面
  }, 5000); // 5秒后跳转
});