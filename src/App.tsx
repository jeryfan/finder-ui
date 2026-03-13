import { File } from "lucide-react";
import "./App.css";
import { Sidebar } from "@/components/sidebar";
import type { SidebarTab } from "./types";

function App() {
  const tabs: Array<SidebarTab> = [
    {
      key: "tab1",
      label: "Tab 1",
      icon: File,
      rootPath: "/",
    },
  ];
  return (
    <div className="w-150 h-100">
      <Sidebar tabs={tabs} />
    </div>
  );
}

export default App;
