"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string; // 新增：数据库主键
  text: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputText, setInputText] = useState("");

  // 🔴 改造：从 API 加载数据（替换原来的 localStorage）
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) throw new Error("加载失败");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("加载任务失败:", error);
        // 降级处理：如果加载失败，使用初始数据
        const initialTasks: Task[] = [
          { id: "1", text: "完成项目报告", completed: false },
          { id: "2", text: "买牛奶", completed: false },
          { id: "3", text: "给妈妈打电话", completed: false },
        ];
        setTasks(initialTasks);
      }
    };

    fetchTasks();
  }, []);

  // 🔴 改造：保存到 API（替换原来的 saveTasks 函数）
  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks); // 立即更新 UI
    // 这里不需要再操作 localStorage，因为 API 会直接操作数据库
  };

  // 🔴 改造：添加任务（调用 API）
  const addTask = async () => {
    const t = inputText.trim();
    if (!t) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });

      if (!res.ok) throw new Error("添加失败");
      const newTask = await res.json();
      
      // 把新任务加到列表开头
      saveTasks([newTask, ...tasks]);
      setInputText("");
    } catch (error) {
      console.error("添加任务失败:", error);
      alert("添加失败，请稍后重试");
    }
  };

  // 🔴 改造：切换状态（调用 API）
  const toggleComplete = async (id: string) => {
    try {
      const res = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("更新失败");
      const updatedTask = await res.json();

      // 更新本地列表
      const newTasks = tasks.map(task => 
        task.id === id ? updatedTask : task
      );
      saveTasks(newTasks);
    } catch (error) {
      console.error("更新任务失败:", error);
    }
  };

  // 🔴 改造：删除任务（调用 API）
  const deleteTask = async (id: string) => {
    try {
      await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      // 过滤掉删除的任务
      const newTasks = tasks.filter(task => task.id !== id);
      saveTasks(newTasks);
    } catch (error) {
      console.error("删除任务失败:", error);
    }
  };

  // 过滤搜索（这部分逻辑完全不变）
  const filtered = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 🎨 JSX 部分：你的原始代码完全保留！
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
                key={task.id} /* 改用数据库 id */
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
                    onClick={() => toggleComplete(task.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    {task.completed ? "重做" : "完成"}
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
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