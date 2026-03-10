"use client";

import { useEffect, useState } from "react";

type Task = {
  text: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputText, setInputText] = useState("");

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem("todoList");
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const initialTasks: Task[] = [
        { text: "完成项目报告", completed: false },
        { text: "买牛奶", completed: false },
        { text: "给妈妈打电话", completed: false },
      ];
      setTasks(initialTasks);
      localStorage.setItem("todoList", JSON.stringify(initialTasks));
    }
  }, []);

  // 保存到 localStorage
  const saveTasks = (newTasks: Task[]) => {
    localStorage.setItem("todoList", JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  // 添加任务
  const addTask = () => {
    const t = inputText.trim();
    if (!t) return;
    const newTasks = [{ text: t, completed: false }, ...tasks];
    saveTasks(newTasks);
    setInputText("");
  };

  // 切换完成状态
  const toggleComplete = (idx: number) => {
    const newTasks = [...tasks];
    newTasks[idx].completed = !newTasks[idx].completed;
    saveTasks(newTasks);
  };

  // 删除任务
  const deleteTask = (idx: number) => {
    const newTasks = tasks.filter((_, i) => i !== idx);
    saveTasks(newTasks);
  };

  // 过滤搜索
  const filtered = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-5 font-sans">
      <div className="max-w-[500px] mx-auto bg-white rounded-xl shadow overflow-hidden">
        {/* 头部 */}
        <div className="bg-[#4A90E2] text-white p-6 text-center">
          <h1 className="text-xl font-semibold">我的待办清单</h1>
        </div>

        {/* 搜索 */}
        <div className="p-4 pb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg outline-none focus:border-[#4A90E2]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* 输入 */}
        <div className="p-6 border-b">
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 p-3 border rounded-lg outline-none focus:border-[#4A90E2]"
              placeholder="输入新任务..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button
              onClick={addTask}
              className="bg-[#FF6B8B] text-white px-5 py-3 rounded-lg hover:bg-[#FF476A]"
            >
              添加
            </button>
          </div>
        </div>

        {/* 列表 */}
        <div className="p-6 pt-0">
          <h2 className="text-lg font-semibold my-6 text-gray-600">任务列表</h2>

          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                {searchKeyword
                  ? `没有找到匹配“${searchKeyword}”的任务`
                  : "还没有任务，开始添加吧！"}
              </p >
            </div>
          ) : (
            filtered.map((task, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 mb-3 hover:bg-gray-100"
              >
                <div
                  className={
                    task.completed
                      ? "line-through text-gray-500 flex-1"
                      : "flex-1"
                  }
                >
                  {task.text}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleComplete(i)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    {task.completed ? "重做" : "完成"}
                  </button>
                  <button
                    onClick={() => deleteTask(i)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}