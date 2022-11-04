import React, { useEffect, useRef } from "react";

const SaveComplete = ({ completedTask }) => {
  const canvas = useRef(null);
  const saveBtn = useRef(null);
  let ctx;
  const draw = () => {
    ctx.fillStyle = "#ff0000";
    let height = 40;
    ctx.font = "20px sans-serif";
    completedTask.forEach((item) => {
      ctx.fillText(`・[${item.category}] ${item.name}`, 30, height);
      height += 30;
    });
    return height;
  };
  useEffect(() => {
    ctx = canvas.current.getContext("2d");
    console.log(ctx);
    canvas.current.height = draw() + 50;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    draw();
    saveBtn.current.href = canvas.current.toDataURL("image/png");
    saveBtn.current.download = "image/png";
  }, [completedTask]);
  return (
    <div>
      <a ref={saveBtn} className="btn btn-primary">
        完了タスクリスト保存
      </a>
      <canvas
        className="d-none"
        ref={canvas}
        width={"400px"}
        height={"400px"}
      ></canvas>
    </div>
  );
};

export default SaveComplete;
