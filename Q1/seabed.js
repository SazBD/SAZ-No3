document.addEventListener("DOMContentLoaded", () => {
  const stack = document.querySelector(".card-stack");
  const cards = stack.querySelectorAll(".card");
  let spread = false;
  const answered = new Array(cards.length).fill(false);

  // 题库（根据图片内容整理）
  const questions = [
    {
      q: "1. 海洋中最常见的垃圾是什么？",
      options: ["塑料制品", "玻璃瓶", "金属罐头", "纸制品"],
      correct: 1,
      tip: "这种垃圾在海洋中难以降解，对海洋生物危害极大。",
    },
    {
      q: "2. 海洋覆盖了地球表面大约多少？",
      options: ["91%", "88%", "71%", "68%"],
      correct: 3,
      tip: "海洋覆盖了地球表面的71%，包含了97%的水资源。",
    },
    {
      q: "3. 下列哪种塑料制品对海洋生物危害最大？",
      options: ["塑料袋", "塑料吸管", "塑料瓶", "废弃渔网"],
      correct: 4,
      tip: "废弃渔网占海洋塑料污染46%，被称为“幽灵渔具”，每年导致数十万海洋生物死亡。",
    },
    {
      q: "4. 下列哪种行为最有助于保护海洋？",
      options: [
        "使用防晒霜",
        "减少海鲜消费",
        "使用可重复使用的水瓶",
        "参与海滩清洁",
      ],
      correct: 3,
      tip: "使用可重复使用的水瓶每年可减少数百万塑料瓶进入海洋生态系统。",
    },
    {
      q: "5. 微塑料是指直径小于多少的塑料颗粒？",
      options: ["1厘米", "1毫米", "5毫米", "1米"],
      correct: 3,
      tip: "微塑料可被浮游生物摄入，通过食物链富集，最终可能进入人类食物系统。",
    },
    {
      q: "6. 减少海洋塑料污染最有效的方式是什么？",
      options: [
        "回收塑料",
        "使用可重复使用的购物袋",
        "参与海滩清洁",
        "避免使用一次性塑料制品",
      ],
      correct: 2,
      tip: "使用可重复使用的购物袋和替代品是最有效的减少塑料污染的方式。",
    },
    {
      q: "7. 下列哪项是有利于海洋保护区的措施？",
      options: [
        "建立海洋保护区",
        "减少碳排放",
        "禁止塑料制品",
        "推广可持续渔业",
      ],
      correct: 1,
      tip: "海洋保护区为海洋生物提供安全的栖息地，使种群得以恢复和繁衍。",
    },
  ];

  // 扇形散开
  stack.addEventListener(
    "click",
    () => {
      if (spread) return;
      spread = true;
      const total = cards.length;
      const angleRange = 120;
      const radius = 180;
      const center = (total - 1) / 2;
      for (let i = 0; i < total; i++) {
        const angle = (i - center) * (angleRange / (total - 1));
        const rad = (angle * Math.PI) / 180;
        const x = Math.sin(rad) * radius * 2;
        const y = radius - Math.cos(rad) * radius - 100;
        cards[
          i
        ].style.transform = `translate(calc(-50% + ${x}px), ${y}px) rotate(${angle}deg) scale(1)`;
        cards[i].style.zIndex = 100 - Math.abs(i - center);
        cards[i].style.left = "50%";
        cards[i].style.top = "";
        cards[i].style.width = "240px";
        cards[i].style.height = "340px";
        cards[i].style.opacity = answered[i] ? "0.3" : "1";
        cards[i].innerHTML = "";
      }
    },
    { once: true }
  );

  // 卡片点击高亮并放大居中，显示对应题目
  cards.forEach((card, idx) => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("option-btn")) return;
      if (!spread || answered[idx]) return;
      e.stopPropagation();
      cards.forEach((c, i) => {
        c.classList.remove("card-active");
        c.style.width = "240px";
        c.style.height = "340px";
        c.style.left = "50%";
        c.style.top = "";
        c.style.opacity = answered[i] ? "0.3" : "1";
        c.style.transform = c.style.transform.replace(
          /rotate\([^)]+\)/,
          (m) => m
        );
        c.innerHTML = "";
      });
      card.classList.add("card-active");
      card.style.left = "50%";
      card.style.top = "50%";
      card.style.width = "1100px";
      card.style.height = "600px";
      card.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)";
      card.style.zIndex = 999;

      // 取出当前题目
      const q = questions[idx];
      // 生成选项按钮HTML
      let optionsHtml = "";
      q.options.forEach((opt, i) => {
        optionsHtml += `<button class="option-btn" data-index="${
          i + 1
        }" style="padding: 18px 0; font-size: 1.3rem; border-radius: 16px; border: none; background: linear-gradient(90deg, #5dade2 60%, #48c6ef 100%); color: #fff; font-weight: bold; box-shadow: 0 4px 16px rgba(93,173,226,0.12); cursor: pointer; transition: background 0.2s, transform 0.2s;">${String.fromCharCode(
          65 + i
        )}. ${opt}</button>`;
      });

      // 插入题目内容
      card.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          width: 100%;
          padding: 40px 60px 32px 60px;
          box-sizing: border-box;
        ">
          <div style="
            font-size: 2.1rem;
            font-weight: bold;
            color: #154360;
            margin-bottom: 36px;
            text-align: center;
            letter-spacing: 1.5px;
            line-height: 1.3;
            text-shadow: 0 2px 8px rgba(93,173,226,0.15);
          ">
            ${q.q}
          </div>
          <div style="
            display: flex;
            flex-direction: column;
            gap: 22px;
            width: 80%;
            max-width: 700px;
            margin: 0 auto 32px auto;
          ">
            ${optionsHtml}
          </div>
          <div style="
            margin-top: auto;
            font-size: 1.1rem;
            color: #2874a6;
            background: rgba(255,255,255,0.7);
            border-radius: 10px;
            padding: 10px 20px;
            box-shadow: 0 2px 8px rgba(93,173,226,0.08);
            text-align: center;
            letter-spacing: 1px;
          ">
            提示：${q.tip}
          </div>
        </div>
      `;

      // 绑定选项按钮点击事件
      const correctIndex = q.correct;
      const optionBtns = card.querySelectorAll(".option-btn");
      optionBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          // 缩小动画
          btn.style.transform = "scale(0.9)";
          setTimeout(() => {
            btn.style.transform = "scale(1)";
          }, 200);

          // 判断正误并变色
          if (parseInt(btn.dataset.index) === correctIndex) {
            btn.style.background = "#28a745";
            optionBtns.forEach((b) => (b.disabled = true));

            // 判断是否全部答完
            const isLast = answered.filter(Boolean).length === cards.length - 1;

            // 创建“继续”或“完成”按钮
            if (!card.querySelector(".continue-btn")) {
              const continueBtn = document.createElement("button");
              continueBtn.className = "continue-btn";
              continueBtn.style.position = "absolute";
              continueBtn.style.left = "50%";
              continueBtn.style.bottom = "30px";
              continueBtn.style.transform = "translateX(-50%)";
              continueBtn.style.padding = "16px 48px";
              continueBtn.style.fontSize = "1.2rem";
              continueBtn.style.background =
                "linear-gradient(90deg, #5dade2 60%, #48c6ef 100%)";
              continueBtn.style.color = "#fff";
              continueBtn.style.border = "none";
              continueBtn.style.borderRadius = "24px";
              continueBtn.style.boxShadow = "0 4px 16px rgba(93,173,226,0.12)";
              continueBtn.style.cursor = "pointer";
              continueBtn.style.fontWeight = "bold";
              continueBtn.style.letterSpacing = "2px";
              continueBtn.textContent = isLast ? "完成" : "继续";
              card.appendChild(continueBtn);

              continueBtn.addEventListener("click", () => {
                answered[idx] = true;
                if (answered.every(Boolean)) {
                  // 先回到卡片堆
                  const total = cards.length;
                  const angleRange = 120;
                  const radius = 180;
                  const center = (total - 1) / 2;
                  for (let i = 0; i < total; i++) {
                    const angle = (i - center) * (angleRange / (total - 1));
                    const rad = (angle * Math.PI) / 180;
                    const x = Math.sin(rad) * radius * 2;
                    const y = radius - Math.cos(rad) * radius - 100;
                    cards[
                      i
                    ].style.transform = `translate(calc(-50% + ${x}px), ${y}px) rotate(${angle}deg) scale(1)`;
                    cards[i].style.zIndex = 100 - Math.abs(i - center);
                    cards[i].style.left = "50%";
                    cards[i].style.top = "";
                    cards[i].style.width = "240px";
                    cards[i].style.height = "340px";
                    cards[i].style.opacity = answered[i] ? "0.3" : "1";
                    cards[i].innerHTML = "";
                  }

                  // 再弹出提示弹窗
                  setTimeout(() => {
                    const popup = document.createElement("div");
                    popup.id = "ocean-popup";
                    popup.style.position = "fixed";
                    popup.style.left = "50%";
                    popup.style.top = "50%";
                    popup.style.transform = "translate(-50%, -50%)";
                    popup.style.width = "600px";
                    popup.style.height = "300px";
                    popup.style.background = "rgba(93, 173, 226, 0.7)";
                    popup.style.borderRadius = "24px";
                    popup.style.boxShadow = "0 8px 32px rgba(93,173,226,0.18)";
                    popup.style.display = "flex";
                    popup.style.flexDirection = "column";
                    popup.style.justifyContent = "center";
                    popup.style.alignItems = "center";
                    popup.style.zIndex = "2000";
                    popup.style.fontSize = "1.25rem";
                    popup.style.color = "#154360";
                    popup.style.padding = "36px 32px";
                    popup.innerHTML = `
    <div style="text-align:center;line-height:2;">
      海洋所遭受的伤害远不于此，我们不能目睹海洋继续受到伤害。<br>
      希望就在行动中，让我们从此刻开始，成为海洋的守护者。<br>
      心向蔚蓝，生生不息！
    </div>
  `;
                    document.body.appendChild(popup);
                  }, 1500); // 延迟0.85秒后弹窗出现
                } else {
                  // 恢复所有卡片为散开状态，并设置已答过的卡片透明度为0.3
                  const total = cards.length;
                  const angleRange = 120;
                  const radius = 180;
                  const center = (total - 1) / 2;
                  for (let i = 0; i < total; i++) {
                    const angle = (i - center) * (angleRange / (total - 1));
                    const rad = (angle * Math.PI) / 180;
                    const x = Math.sin(rad) * radius * 2;
                    const y = radius - Math.cos(rad) * radius - 100;
                    cards[
                      i
                    ].style.transform = `translate(calc(-50% + ${x}px), ${y}px) rotate(${angle}deg) scale(1)`;
                    cards[i].style.zIndex = 100 - Math.abs(i - center);
                    cards[i].style.left = "50%";
                    cards[i].style.top = "";
                    cards[i].style.width = "240px";
                    cards[i].style.height = "340px";
                    cards[i].style.opacity = answered[i] ? "0.3" : "1";
                    cards[i].innerHTML = "";
                  }
                }
              });
            }
          } else {
            btn.style.background = "#dc3545";
            setTimeout(() => {
              btn.style.background =
                "linear-gradient(90deg, #5dade2 60%, #48c6ef 100%)";
            }, 2000);
          }
        });
      });
    });
  });
});
