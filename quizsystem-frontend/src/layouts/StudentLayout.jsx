import SidebarLayout from "../components/layout/SidebarLayout";

const menuItems = [
  {
    label: "Dashboard",
    path: "/student/dashboard",
    icon: "📊",
  },
  {
    label: "Available Quizzes",
    path: "/student/quizzes",
    icon: "📝",
  },
  {
    label: "My Results",
    path: "/student/results",
    icon: "📈",
  },
];

function StudentLayout() {
  return (
    <SidebarLayout
      menuItems={menuItems}
    />
  );
}

export default StudentLayout;