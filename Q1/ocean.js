function addSwingAnimation() {
  const imgs = document.querySelectorAll(".float-img");
  // 初始全部黑白
  imgs.forEach((i) => (i.style.filter = "grayscale(1)"));
  imgs.forEach((img, idx) => {
    img.style.animation = `swing 3s ease-in-out infinite alternate`;
    img.style.animationDelay = `${idx * 0.5}s`;

    // 点击弹出对话框
    img.addEventListener("click", () => {
      // 仅当前图片保持黑白，关闭对话框时恢复彩色
      showDialog(img, () => {
        img.style.filter = "grayscale(1)";
      });
    });
  });
}

// 动态插入关键帧和对话框样式
const style = document.createElement("style");
style.innerHTML = `
@keyframes swing {
  0%   { transform: translateY(-50%) translateX(0); }
  50%  { transform: translateY(-50%) translateX(30px); }
  100% { transform: translateY(-50%) translateX(-30px); }
}
.dialog-mask {
  position: fixed;
  left: 0; top: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-box {
  background: rgba(0,0,0,0.3); /* 半透明 */
  border-radius: 16px;
  padding: 40px 32px;
  max-width: 50vw;      /* 更窄 */
  min-width: 220px;
  width: 100%;
  max-height: 50vh;     /* 更高 */
  height: 70vh;         /* 固定高度更高 */
  font-size: 2rem;
  color: #222;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  text-align: center;
  overflow: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-close {
  position: absolute;
  right: 24px;
  top: 16px;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  background: none;
  border: none;
}
.dialog-text {
  width: 100%;
  min-height: 4em;
  word-break: break-all;
  text-align: left;
  margin: 0 auto;
  font-size: 1.2em;
  line-height: 1.7;
  color: #5DADE2; /* 文字改为淡蓝色 */
}
`;
document.head.appendChild(style);

// 对话框弹出函数，img参数用于判断是哪张图片
function showDialog(img, onClose) {
  // 避免重复弹出
  if (document.querySelector(".dialog-mask")) return;
  const mask = document.createElement("div");
  mask.className = "dialog-mask";
  const box = document.createElement("div");
  box.className = "dialog-box";

  // 判断是哪张图片，设置不同文字和音频
  let text = "十".repeat(50);
  let audioSrc = null;
  if (img && img.getAttribute("src")) {
    const src = img.getAttribute("src");
    if (src.includes("jy.png")) {
      text =
        "我是一头鲸鱼，作为食物链的顶端捕食者，身体中的化学毒素很容易到危险含量，而塑料在分解时会与其他结合，从而进入到我的身体里，希望你能帮帮我！";
      audioSrc = "audio/jy.mp3";
    } else if (src.includes("wg.png")) {
      text =
        "我是一只乌龟，由于塑料袋在水中与水母太像了，经常导致我误食，它在我消化道内堵塞，释放的毒素严重损害了我的身体，求你帮帮我！";
      audioSrc = "audio/wg.mp3";
    } else if (src.includes("zy.png")) {
      text =
        "我是一只章鱼，我的触手吸附力能达100kPa，却无法挣脱聚酰胺渔网；更令我绝望的是，我死亡后，身体分解的有害物质还会破坏我的家园，请帮帮我们！";
      audioSrc = "audio/zy.mp3";
    } else if (src.includes("y.png")) {
      text =
        "我是一条小丑鱼，我经常被海洋中的玻璃碎片划伤，又或者误食，然后出血，感染，甚至是死亡，你能帮帮我吗？";
      audioSrc = "audio/y.mp3";
    }
  }

  // 文字逐字显示
  const textDiv = document.createElement("div");
  textDiv.className = "dialog-text";
  box.appendChild(textDiv);

  // 关闭按钮
  const closeBtn = document.createElement("button");
  closeBtn.className = "dialog-close";
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => {
    mask.remove();
    if (typeof onClose === "function") onClose();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (typeTimer) clearInterval(typeTimer);
    // 关闭对话框后，当前图片恢复彩色
    if (img) img.style.filter = "";
  };
  box.appendChild(closeBtn);

  mask.appendChild(box);
  document.body.appendChild(mask);

  // 点击遮罩关闭
  mask.addEventListener("click", (e) => {
    if (e.target === mask) {
      mask.remove();
      if (typeof onClose === "function") onClose();
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      if (typeTimer) clearInterval(typeTimer);
      // 关闭对话框后，当前图片恢复彩色
      if (img) img.style.filter = "";
    }
  });

  // 打字效果和音频播放
  let idx = 0;
  let typeTimer = null;
  let audio = null;
  function startTypeAndAudio() {
    typeTimer = setInterval(() => {
      idx++;
      textDiv.textContent = text.slice(0, idx);
      if (idx >= text.length) {
        clearInterval(typeTimer);
      }
    }, 190);
    if (audioSrc) {
      audio = new Audio(audioSrc);
      audio.play();
    }
  }
  // 0.5秒后开始打字和音频逻辑
  setTimeout(startTypeAndAudio, 1000);
}

addSwingAnimation();
