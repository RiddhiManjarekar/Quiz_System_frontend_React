import SidebarLayout from "../components/layout/SidebarLayout";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: "📊",
  },
  {
    label: "Students",
    path: "/admin/students",
    icon: "🎓",
  },
  {
    label: "Teachers",
    path: "/admin/teachers",
    icon: "👨‍🏫",
  },
  {
    label: "Quizzes",
    path: "/admin/quizzes",
    icon: "📝",
  },
];

function AdminLayout() {
  return (
    <SidebarLayout
      menuItems={menuItems}
    />
  );
}

export default AdminLayout;