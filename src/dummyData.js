import { uuid } from "./uuid";

export const dummyData = {
  id: uuid(),
  name: "ボード名",
  categories: [
    {
      id: uuid(),
      name: "カテゴリー名",
      tasks: [
        {
          id: uuid(),
          name: "タスク名",
        },
        {
          id: uuid(),
          name: "タスク名",
        },
        {
          id: uuid(),
          name: "タスク名",
        },
      ],
    },
    {
      id: uuid(),
      name: "カテゴリー名",
      tasks: [
        {
          id: uuid(),
          name: "タスク名",
        },
        {
          id: uuid(),
          name: "タスク名",
        },
      ],
    },
  ],
};
