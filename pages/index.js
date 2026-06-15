import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>読み込み中...</div>;

  const { users, tasks } = data;

  // Get local date string YYYY-MM-DD
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const userStats = users.map((user) => {
    const userTasks = tasks.filter((t) => t.assignee === user.id);
    const total = userTasks.length;
    const completed = userTasks.filter((t) => t.status === '完了').length;
    const overdue = userTasks.filter(
      (t) => t.status !== '完了' && t.due_date < today
    ).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { ...user, total, completed, overdue, rate };
  });

  return (
    <div className="container">
      <h1>現場是正・タスク管理ダッシュボード</h1>
      <table>
        <thead>
          <tr>
            <th>担当者</th>
            <th>タスク数</th>
            <th>完了率</th>
            <th>遅延数</th>
            <th>詳細</th>
          </tr>
        </thead>
        <tbody>
          {userStats.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.total}</td>
              <td>{user.rate}% ({user.completed}/{user.total})</td>
              <td className={user.overdue > 0 ? 'overdue' : ''}>
                {user.overdue}
              </td>
              <td>
                <Link href={`/users/${user.id}`} className="btn">
                  表示
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
