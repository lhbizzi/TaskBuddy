import { useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import "./sidebar.css";
import { IoTodayOutline } from "react-icons/io5";
import { Nav, Sidenav } from "rsuite";

const Sidebar = () => {
  const [expanded, setExpand] = useState(true);
  const [openKeys, setOpenKeys] = useState(["1"]);

  // Usamos uma classe CSS condicional
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
          </Nav>
        </Sidenav.Body>
        <Sidenav.Toggle onToggle={() => setExpand(!expanded)} />
      </Sidenav>
    </div>
  );
};

export default Sidebar;
