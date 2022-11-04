import React, { useState } from "react";

const Task = ({
  board,
  setBoard,
  focus,
  categoryIndex,
  isLoading,
  taskIndex,
  setIsLoading,
  getCompletedTask,
}) => {
  const [name, setName] = useState(
    board.categories[categoryIndex].tasks[taskIndex].name
  );
  const changeName = (e) => {
    setName(e.target.value);
    setBoard((prevBoard) => {
      prevBoard.categories[categoryIndex].tasks[taskIndex].name =
        e.target.value;
      return { ...prevBoard };
    });
  };

  const completeTask = () => {
    setIsLoading(true);
    fetch(
      "https://shuntem.net/gorin2022/gorin2022_m2_api/public/api/deleted_tasks",
      {
        method: "POST",
        headers: {
          authorization: "Bearer compe2022",
          "Content-Type": "multipart/form-data, application/json",
        },
        body: JSON.stringify({
          name: name,
          category: board.categories[categoryIndex].name,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setBoard((prevBoard) => {
            prevBoard.categories[categoryIndex].tasks.splice(taskIndex, 1);
            return { ...prevBoard };
          });
        } else {
          alert("通信に失敗しました。");
        }
      })
      .catch((err) => alert("通信に失敗しました。"))
      .finally(() => {
        setIsLoading(false);
        getCompletedTask();
      });
  };

  const checkActice = () => {
    if (focus.category === categoryIndex && focus.task === taskIndex) {
      return true;
    }
    return false;
  };
  return (
    <div
      className={`d-flex py-3 px-4 my-3 border justify-content-between align-items-center ${
        checkActice() ? "border-primary" : ""
      }`}
    >
      <h3 className="m-0">
        <input
          className={`border-0 bg-transparent taskinput-${categoryIndex}-${taskIndex}`}
          value={name}
          onChange={changeName}
        ></input>
      </h3>
      <button className="btn btn-primary" onClick={completeTask}>
        完了
      </button>
    </div>
  );
};

export default Task;
