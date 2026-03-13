import { Sidebar, FileList, ContextMenu, useStore, type SidebarTab } from "./";
import { useEffect } from "react";

function App() {
  const {
    setOpenHandler,
    setDownloadHandler,
    setUploadHandler,
    setRefreshHandler,
    setFiles,
  } = useStore();

  useEffect(() => {
    // 设置各种处理器
    setOpenHandler((file) => console.log("Open:", file));
    setDownloadHandler((file) => console.log("Download:", file));
    setUploadHandler((isFolder, path) =>
      console.log("Upload:", isFolder, path),
    );
    setRefreshHandler(() => console.log("Refresh"));
  }, []);

  // 加载文件数据
  useEffect(() => {
    setFiles([
      {
        name: "doc.pdf",
        path: "/doc.pdf",
        size: 1024,
        type: "file",
        lastModified: "2024-01-01",
      },
      { name: "folder", path: "/folder", size: 0, type: "directory" },
    ]);
  }, []);

  const tabs: SidebarTab[] = [
    { key: "files", label: "My Files", rootPath: "/" },
    { key: "skills", label: "Skills", rootPath: "/skills" },
  ];

  return (
    <div className="h-screen w-150 flex">
      <Sidebar tabs={tabs} />
      <div className="flex-1 flex flex-col">
        <FileList />
      </div>
      <ContextMenu /> {/* 只需要渲染一次，自动管理显示 */}
    </div>
  );
}

export default App;
