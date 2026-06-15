import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const statusClassMap = {
  '未着手': 'not-started',
  '進行中': 'in-progress',
  '完了': 'completed',
  '遅延': 'overdue'
};

export default function UserPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>読み込み中...</div>;

  const user = data.users.find((u) => u.id === parseInt(id));
  if (!user) return <div>ユーザーが見つかりません</div>;

  const userTasks = data.tasks.filter((t) => t.assignee === user.id);
  const projectIds = [...new Set(userTasks.map((t) => t.project_id))];

  // Get local date string YYYY-MM-DD
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="container">
      <Link href="/" className="btn no-print" style={{ marginBottom: '20px', backgroundColor: '#888' }}>
        戻る
      </Link>
      <h1>{user.name} のタスク一覧</h1>
      <p>抱えている案件数: {projectIds.length}</p>

      <div style={{ marginBottom: '20px' }}>
        <Link href={`/print/${user.id}`} className="btn print-btn">
          印刷用ページを表示
        </Link>
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
            const statusText = isOverdue ? '遅延' : task.status;
            const statusClass = statusClassMap[statusText] || '';

            return (
              <tr key={task.id}>
                <td>{project ? project.name : '不明'}</td>
                <td>{task.title}</td>
                <td className={isOverdue ? 'overdue' : ''}>{task.due_date}</td>
                <td>
                  <span className={`status-label status-${statusClass}`}>
                    {statusText}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
