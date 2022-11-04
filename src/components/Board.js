import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { dummyData } from "../dummyData";
import { uuid } from "../uuid";
import Category from "./Category";
import SaveComplete from "./SaveComplete";

const Board = () => {
  const [board, setBoard] = useState(dummyData);
  const [name, setName] = useState(board.name);
  const [focus, setFocus] = useState({ category: -1, task: -1 });
  const [isLoading, setIsLoading] = useState(false);
  const [completedTask, setCompletedTask] = useState([]);

  const changeName = (e) => {
    setBoard((prevBoard) => {
      prevBoard.name = e.target.value;
      return { ...prevBoard };
    });
    setName(e.target.value);
  };

  const addCategory = () => {
    setBoard((prevBoard) => {
      prevBoard.categories = [
        ...prevBoard.categories,
        {
          id: uuid(),
          name: "",
          tasks: [],
        },
      ];
      return { ...prevBoard };
    });

    setTimeout(() => {
      const addedCategory = document.querySelector(
        `.category-${board.categories.length - 1}`
      );
      addedCategory.focus();
    }, 10);
  };

  const handleDragEnd = (drag) => {
    const { destination, source } = drag;

    if (drag.type === "category") {
      setBoard((prevBoard) => {
        const [removed] = prevBoard.categories.splice(source.index, 1);
        prevBoard.categories.splice(destination.index, 0, removed);
        return { ...prevBoard };
      });
    } else if (drag.type === "task") {
      if (destination === null || source === null) {
        return "";
      }
      const sourceCategoryIndex = board.categories.findIndex(
        (category) => category.id === source.droppableId
      );
      const destinationCategoryIndex = board.categories.findIndex(
        (category) => category.id === destination.droppableId
      );

      setBoard((prevBoard) => {
        const [removed] = prevBoard.categories[
          sourceCategoryIndex
        ].tasks.splice(source.index, 1);
        prevBoard.categories[destinationCategoryIndex].tasks.splice(
          destination.index,
          0,
          removed
        );

        return { ...prevBoard };
      });
    }
  };
  const handleKeyDown = (e) => {
    console.log(e.key);

    if (focus.category === -1 && focus.task === -1) {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        setFocus({
          category: 0,
          task: 0,
        });
      }
    } else if (e.key === "ArrowDown") {
      if (
        board.categories[focus.category].tasks[focus.task + 1] !== undefined
      ) {
        setFocus((prevFocus) => ({ ...prevFocus, task: prevFocus.task + 1 }));
      }
    } else if (e.key === "ArrowUp") {
      if (
        board.categories[focus.category].tasks[focus.task - 1] !== undefined
      ) {
        setFocus((prevFocus) => ({ ...prevFocus, task: prevFocus.task - 1 }));
      }
    } else if (e.key === "ArrowRight") {
      let nextCategoryIndex = -1;
      board.categories.forEach((category, index) => {
        if (
          focus.category < index &&
          nextCategoryIndex === -1 &&
          category.tasks.length !== 0
        ) {
          nextCategoryIndex = index;
        }
      });

      if (board.categories[nextCategoryIndex].tasks.length - 1 <= focus.task) {
        setFocus((prevFocus) => ({
          category: nextCategoryIndex,
          task: board.categories[nextCategoryIndex].tasks.length - 1,
        }));
      } else {
        setFocus((prevFocus) => ({
          ...prevFocus,
          category: nextCategoryIndex,
        }));
      }
    } else if (e.key === "ArrowLeft") {
      let nextCategoryIndex = -1;
      board.categories.forEach((category, index) => {
        if (focus.category > index && category.tasks.length !== 0) {
          nextCategoryIndex = index;
        }
      });

      if (board.categories[nextCategoryIndex].tasks.length - 1 <= focus.task) {
        setFocus((prevFocus) => ({
          category: nextCategoryIndex,
          task: board.categories[nextCategoryIndex].tasks.length - 1,
        }));
      } else {
        setFocus((prevFocus) => ({
          ...prevFocus,
          category: nextCategoryIndex,
        }));
      }
    } else if (e.key === "Enter") {
      if (document.activeElement.tagName === "INPUT") {
        document.activeElement.blur();
      } else {
        const activeTask = document.querySelector(
          `.taskinput-${focus.category}-${focus.task}`
        );
        if (activeTask) {
          activeTask.focus();
        }
      }
    } else if (e.key === "c") {
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
            category: board.categories[focus.category].name,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBoard((prevBoard) => {
              prevBoard.categories[focus.category].tasks.splice(focus.task, 1);
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
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focus]);

  useEffect(() => {
    getCompletedTask();
  }, []);

  const getCompletedTask = () => {
    setIsLoading(true);
    fetch(
      "https://shuntem.net/gorin2022/gorin2022_m2_api/public/api/deleted_tasks",
      {
        method: "GET",
        headers: {
          authorization: "Bearer compe2022",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setCompletedTask(data))
      .catch((err) => alert("通信に失敗しました"))
      .finally(() => setIsLoading(false));
  };

  const removeCompTask = (id) => {
    setIsLoading(true);
    fetch(
      "https://shuntem.net/gorin2022/gorin2022_m2_api/public/api/deleted_tasks/" +
      id,
      {
        method: "DELETE",
        headers: {
          authorization: "Bearer compe2022",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setCompletedTask(data))
      .catch((err) => alert("通信に失敗しました"))
      .finally(() => setIsLoading(false));
  };

  const parsedCompletedTasks =  () => {
    let _completedTasks = [];
    for(let i in completedTask){
      if ( typeof _completedTasks[completedTask[i].category] === "undefined" ){
        _completedTasks[completedTask[i].category] = {
          category: completedTask[i].category,
          tasks: []
        } 
      }
      _completedTasks[completedTask[i].category].tasks.push(completedTask[i])
    }
    let _tasks = []
    for (let m in _completedTasks) {
      _tasks.push(_completedTasks[m])
    }
    return _tasks
  }
  return (
    <div className="container-xxl mt-2">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="card">
          <div className="card-header">
            <h1>
              <input
                className="border-0 bg-transparent fw-bold fs-2"
                value={name}
                onChange={changeName}
                placeholder="ボード名を入力"
              ></input>
            </h1>
          </div>
          <div className="c-board__body card-body overflow-auto">
            <Droppable
              droppableId={board.id}
              type={"category"}
              direction={"horizontal"}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="d-flex h-100"
                >
                  {board.categories.map((category, index) => (
                    <Draggable
                      draggableId={category.id}
                      key={category.id}
                      index={index}
                      type="task"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="h-100"
                        >
                          <Category
                            board={board}
                            setBoard={setBoard}
                            focus={focus}
                            categoryIndex={index}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            getCompletedTask={getCompletedTask}
                          ></Category>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button
                    className="btn btn-outline-primary c-category"
                    onClick={addCategory}
                  >
                    カテゴリー追加
                  </button>
                  <div className="c-category card mx-2 h-100">
                    <div className="card-header bg-success">
                      <h2 className="m-0 fs-5 fw-bold pt-1 pb-1 text-white">
                        完了タスク一覧
                        <span className="badge bg-light text-success fs-8 c-category__count">{completedTask.length}</span>
                      </h2>
                    </div>
                    <div className="c-card-body " style={{ maxHeight: "calc(100vh - 260px)", overflow: "auto" }}>
                          {parsedCompletedTasks().map((item) => (
                            <div className="pe-3 ps-3">
                              <h5 className="fw-bold pt-3">{item.category}</h5>
                              {item.tasks.map( (task) => (
                                <div class="d-flex py-3 px-4 pt-1 pb-1 my-2 border justify-content-between align-items-center ">
                                  <h4 class="m-0 fs-6">{task.name}</h4>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeCompTask(task.id)}
                                  >
                                    削除
                                </button>
                                </div>                                  
                              ))}
                            </div>
                          ))}
                    </div>
                  </div>
                  
                </div>
              )}
            </Droppable>
          </div>
          <div className="card-footer">
            <SaveComplete completedTask={completedTask}></SaveComplete>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
