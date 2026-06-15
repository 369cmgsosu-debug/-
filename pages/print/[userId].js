import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PrintPage() {
  const router = useRouter();
  const { userId } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>読み込み中...</div>;

  const user = data.users.find((u) => u.id === parseInt(userId));
  if (!user) return <div>ユーザーが見つかりません</div>;

  const userTasks = data.tasks.filter((t) => t.assignee === user.id);

  // Get local date string YYYY-MM-DD
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="container">
      <div className="no-print" style={{ marginBottom: '20px' }}>
        <button onClick={() => window.print()} className="btn">
          印刷実行
        </button>
        <button onClick={() => router.back()} className="btn" style={{ marginLeft: '10px', backgroundColor: '#888' }}>
          戻る
        </button>
      </div>

      <h1 style={{ textAlign: 'center' }}>個人別タスクレポート</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>担当者: {user.name}</span>
        <span>作成日: {today}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>案件名</th>
            <th>タスク名</th>
            <th>期限</th>
            <th>状態</th>
          </tr>
        </thead>
        <tbody>
          {userTasks.map((task) => {
            const project = data.projects.find((p) => p.id === task.project_id);
            const isOverdue = task.status !== '完了' && task.due_date < today;
            return (
              <tr key={task.id}>
                <td>{project ? project.name : '不明'}</td>
                <td>{task.title}</td>
                <td className={isOverdue ? 'overdue' : ''}>{task.due_date}</td>
                <td>{isOverdue ? '遅延' : task.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
