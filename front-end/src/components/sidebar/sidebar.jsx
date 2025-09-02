import { useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import "./sidebar.css";
import { IoTodayOutline } from "react-icons/io5";
import { Nav, Sidenav } from "rsuite";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [expanded, setExpand] = useState(true);
  const [openKeys, setOpenKeys] = useState(["1"]);
  const [activeKey, setActiveKey] = useState("1-1");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/");
  };

  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);

    switch (eventKey) {
      case "1-1":
        navigate("/home");
        break;
      case "1-2":
        navigate("/calendar");
        break;
      case "1-3":
        navigate("/tasks");
        break;
      default:
        navigate("/home");
        break;
    }
  };

  const sidebarClass = expanded
    ? "sidebar-container"
    : "sidebar-container-collapsed";

  return (
    <div className={sidebarClass}>
      <Sidenav
        expanded={expanded}
        defaultOpenKeys={openKeys}
        appearance="inverse"
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        activeKey={activeKey}
        onSelect={handleSelect}
      >
        <Sidenav.Body>
          <Nav>
            <Nav.Item icon={<IoTodayOutline />} eventKey="1-1">
              Hoje
            </Nav.Item>
            <Nav.Item icon={<FaRegCalendarAlt />} eventKey="1-2">
              Calendário
            </Nav.Item>
            <Nav.Item icon={<MdTaskAlt />} eventKey="1-3">
              Todas as Tarefas
            </Nav.Item>
            <Nav.Item
              eventKey="logout"
              onClick={handleLogout}
              style={{ color: "#e74c3c", marginTop: "20px" }}
            >
              Logout
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
        <Sidenav.Toggle onToggle={() => setExpand(!expanded)} />
      </Sidenav>
    </div>
  );
};

export default Sidebar;
