import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { uuid } from "../uuid";
import Task from "./Task";


const Category = ({
  board,
  setBoard,
  focus,
  categoryIndex,
  isLoading,
  setIsLoading,
  getCompletedTask,
}) => {
  const [name, setName] = useState(board.categories[categoryIndex].name);

  const changeName = (e) => {
    setName(e.target.value);
    setBoard((prevBoard) => {
      prevBoard.categories[categoryIndex].name = e.target.value;
      return { ...prevBoard };
    });
  };

  const addTask = () => {
    setBoard((prevBoard) => {
      prevBoard.categories[categoryIndex].tasks = [
        ...prevBoard.categories[categoryIndex].tasks,
        {
          id: uuid(),
          name: "",
        },
      ];
      return { ...prevBoard };
    });

    setTimeout(() => {
      const addedTask = document.querySelector(
        `.taskinput-${categoryIndex}-${
          board.categories[categoryIndex].tasks.length - 1
        }`
      );
      addedTask.focus();
    }, 10);
  };

  const removeCategory = () => {
    setBoard((prevBoard) => {
      prevBoard.categories.splice(categoryIndex, 1);
      return { ...prevBoard };
    });
  };
  return (
    <div className="c-category card mx-2 h-100">
      <div className="card-header">
        <h2 className="m-0">
          <input
            className={`border-0 fw-bold fs-4 bg-transparent category-${categoryIndex}`}
            value={name}
            onChange={changeName}
            placeholder="カテゴリー名を入力"
          ></input>
          <span className="badge bg-primary fs-6 c-category__count">{board.categories[categoryIndex].tasks.length}</span>
        </h2>
      </div>
      <div className="card-body overflow-auto pt-0 pe-4">
        <Droppable
          droppableId={board.categories[categoryIndex].id}
          type={"task"}
        >
          
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="c-dnd-placeholder" style={{minHeight: "calc(100vh - 320px)", minWidth: "100%"}}>
                {board.categories[categoryIndex].tasks.map((task, index) => (
                  <Draggable draggableId={task.id} index={index} key={task.id} >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Task
                          board={board}
                          setBoard={setBoard}
                          focus={focus}
                          categoryIndex={categoryIndex}
                          isLoading={isLoading}
                          taskIndex={index}
                          setIsLoading={setIsLoading}
                          getCompletedTask={getCompletedTask}
                        ></Task>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
              </div>
            )}
          
        </Droppable>
      </div>
      <div className="card-footer">
        <button
          className="btn btn-primary me-3"
          onClick={addTask}
          >
            タスク追加
        </button>
        <button className="btn btn-outline-danger" onClick={removeCategory}>
          カテゴリー削除
        </button>
      </div>
    </div>
  );
};

export default Category;
