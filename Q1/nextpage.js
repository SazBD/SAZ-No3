const tooltip = document.getElementById("tooltip");
const garbageItems = document.querySelectorAll(".garbage");
const btn = document.getElementById("salvage-btn");
const boat = document.getElementById("boat");
const ocean = document.getElementById("ocean");

let dragging = null;
let offsetX = 0,
  offsetY = 0;

// 记录已消失垃圾数量
let garbageGoneCount = 0;

// 鼠标移入垃圾时显示信息
garbageItems.forEach((garbage) => {
  garbage.addEventListener("mouseenter", (e) => {
    const info = garbage.getAttribute("data-info");
    tooltip.textContent = info;
    tooltip.style.display = "block";
  });

  garbage.addEventListener("mousemove", (e) => {
    tooltip.style.left = `${e.pageX + 10}px`;
    tooltip.style.top = `${e.pageY + 10}px`;
  });

  garbage.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });

  // 鼠标按下开始拖动
  garbage.addEventListener("mousedown", (e) => {
    dragging = garbage;
    // 计算鼠标和垃圾左上角的偏移
    const rect = garbage.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    // 绝对定位到ocean下
    const oceanRect = ocean.getBoundingClientRect();
    garbage.style.position = "absolute";
    garbage.style.left = rect.left - oceanRect.left + "px";
    garbage.style.top = rect.top - oceanRect.top + "px";
    ocean.appendChild(garbage); // 移到ocean下
    garbage.style.zIndex = 1000;
    garbage.style.animation = "none";
    document.body.style.userSelect = "none";
  });
});

// 鼠标移动时拖动垃圾
document.addEventListener("mousemove", (e) => {
  if (dragging) {
    const oceanRect = ocean.getBoundingClientRect();
    let x = e.clientX - oceanRect.left - offsetX;
    let y = e.clientY - oceanRect.top - offsetY;
    x = Math.max(0, Math.min(oceanRect.width - dragging.offsetWidth, x));
    y = Math.max(0, Math.min(oceanRect.height - dragging.offsetHeight, y));
    dragging.style.left = x + "px";
    dragging.style.top = y + "px";
    dragging.style.position = "absolute";

    // 检查碰撞（只检测船中间200px宽、中心点以上50px高的区域）
    const boatRect = boat.getBoundingClientRect();
    const dragRect = dragging.getBoundingClientRect();
    const boatCenterX = boatRect.left + boatRect.width / 2;
    const boatCenterY = boatRect.top + boatRect.height / 2;
    const boatMiddleRect = {
      left: boatCenterX - 100,
      right: boatCenterX + 100,
      top: boatCenterY - 50,
      bottom: boatCenterY, // 只到中心点
    };
    if (
      dragRect.right > boatMiddleRect.left &&
      dragRect.left < boatMiddleRect.right &&
      dragRect.bottom > boatMiddleRect.top &&
      dragRect.top < boatMiddleRect.bottom
    ) {
      dragging.style.display = "none";
      showFireworks();
      garbageGoneCount++;
      // 修改按钮文字
      if (garbageGoneCount === 1) {
        btn.textContent = "不错";
      } else if (garbageGoneCount === 2) {
        btn.textContent = "真棒";
      } else if (garbageGoneCount === 3) {
        btn.textContent = "漂亮";
      } else if (garbageGoneCount === 4) {
        btn.textContent = "继续探索";
        btn.onclick = () => {
          bubbleTransitionAndJump("ocean.html");
        };
      } else {
        // 其它情况移除跳转事件，防止多次添加
        btn.onclick = null;
      }
      dragging = null;
    }
  }
});

// 鼠标松开停止拖动
document.addEventListener("mouseup", () => {
  if (dragging) {
    dragging.style.zIndex = "";
    dragging = null;
    document.body.style.userSelect = "";
  }
});

// 动画结束后允许点击
btn.addEventListener("animationend", () => {
  btn.style.pointerEvents = "auto";
});

// 点击按钮让小船滑入
// btn.addEventListener('click', () => {
//   boat.classList.add('boat-move-in');
//   btn.textContent = '加油'; // 只修改按钮文字，其他不变
// });

btn.addEventListener("click", () => {
  if (btn.textContent == "打捞") {
    boat.classList.add("boat-move-in");
    btn.textContent = "加油"; // 只在“打捞”时变为“加油”
  }
});

// 在船两侧显示烟花
function showFireworks() {
  const oceanRect = ocean.getBoundingClientRect();
  const boatRect = boat.getBoundingClientRect();
  // 左侧烟花
  const fireworkLeft = document.createElement("img");
  fireworkLeft.src = "img/yh.png";
  fireworkLeft.className = "firework";
  fireworkLeft.style.position = "absolute";
  fireworkLeft.style.width = "120px";
  fireworkLeft.style.left = boat.offsetLeft - 100 + "px";
  fireworkLeft.style.top = boat.offsetTop - 60 + "px";
  fireworkLeft.style.pointerEvents = "none";
  ocean.appendChild(fireworkLeft);

  // 右侧烟花
  const fireworkRight = document.createElement("img");
  fireworkRight.src = "img/yh.png";
  fireworkRight.className = "firework";
  fireworkRight.style.position = "absolute";
  fireworkRight.style.width = "120px";
  fireworkRight.style.left = boat.offsetLeft + boat.offsetWidth - 20 + "px";
  fireworkRight.style.top = boat.offsetTop - 60 + "px";
  fireworkRight.style.pointerEvents = "none";
  ocean.appendChild(fireworkRight);

  // 动画后移除
  setTimeout(() => {
    fireworkLeft.remove();
    fireworkRight.remove();
  }, 1200);
}

function bubbleTransitionAndJump(targetUrl) {
  // 创建气泡遮罩
  let mask = document.createElement('div');
  mask.id = 'bubble-mask';
  document.body.appendChild(mask);

  // 生成气泡
  for (let i = 0; i < 40; i++) {
    let bubble = document.createElement('div');
    bubble.className = 'bubble';
    // 随机大小、位置、延迟
    let size = 20 + Math.random() * 60;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = Math.random() * 100 + 'vw';
    bubble.style.background = `rgba(173,216,230,${0.18 + Math.random() * 0.25})`;
    bubble.style.animationDelay = Math.random() * 0.8 + 's';
    mask.appendChild(bubble);
  }

  // 动画结束后跳转
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 2600); // 动画时长略大于 bubble-rise
}
