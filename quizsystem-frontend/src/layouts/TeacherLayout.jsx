import SidebarLayout from "../components/layout/SidebarLayout";

const menuItems = [
  {
    label: "Dashboard",
    path: "/teacher/dashboard",
    icon: "🏠",
  },
  {
    label: "Quizzes",
    path: "/teacher/quizzes",
    icon: "📝",
  },
  {
    label: "Evaluations",
    path: "/teacher/evaluations",
    icon: "📋",
  },
];

function TeacherLayout() {
  return (
    <SidebarLayout
      menuItems={menuItems}
    />
  );
}

export default TeacherLayout;