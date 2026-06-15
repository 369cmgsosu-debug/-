export default function handler(req, res) {
  const users = [
    { id: 1, name: "田中 太郎" },
    { id: 2, name: "佐藤 次郎" },
    { id: 3, name: "鈴木 花子" },
  ];

  const projects = [
    { id: 1, name: "Aマンション建設工事", type: "点検" },
    { id: 2, name: "Bビル改修プロジェクト", type: "手順書" },
    { id: 3, name: "C道路整備事業", type: "安全管理" },
  ];

  const tasks = [
    { id: 1, title: "現場巡回点検", assignee: 1, project_id: 1, status: "完了", due_date: "2024-05-10" },
    { id: 2, title: "安全掲示板更新", assignee: 1, project_id: 1, status: "進行中", due_date: "2024-05-20" },
    { id: 3, title: "新規作業員教育", assignee: 1, project_id: 2, status: "未着手", due_date: "2024-05-15" },
    { id: 4, title: "材料搬入立会", assignee: 2, project_id: 2, status: "進行中", due_date: "2024-05-18" },
    { id: 5, title: "工程会議資料作成", assignee: 2, project_id: 2, status: "未着手", due_date: "2024-05-12" }, // 遅延
    { id: 6, title: "近隣住民説明会", assignee: 3, project_id: 3, status: "完了", due_date: "2024-05-05" },
    { id: 7, title: "交通規制計画確認", assignee: 3, project_id: 3, status: "未着手", due_date: "2024-05-25" },
    { id: 8, title: "資材置き場整理", assignee: 1, project_id: 1, status: "進行中", due_date: "2024-05-10" }, // 遅延
  ];

  res.status(200).json({ users, projects, tasks });
}
