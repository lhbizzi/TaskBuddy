import React, { useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
import "./sidebar.css";
import { IoTodayOutline } from "react-icons/io5";
import { Nav, Sidenav } from "rsuite";

const Sidebar = () => {
  const [expanded, setExpand] = useState(true);
  const [activeKey, setActiveKey] = useState("1");
  const [openKeys, setOpenKeys] = useState(["3", "4"]);

  const CustomSidenav = ({
    appearance,
    openKeys,
    expanded,
    onOpenChange,
    onExpand,
    ...navProps
  }) => {
    <div className="flex justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xs bg-white shadow-lg rounded-lg overflow-hidden">
        <Sidenav
          defaultOpenKeys={["1"]}
          expanded={expanded}
          onExpand={setExpand}
          appearance={appearance}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          <Sidenav.Body>
            <Nav {...navProps}>
              <Nav.Item
                icon={<IoTodayOutline />}
                eventKey="1-1"
                className="py-2 px-4 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors duration-200"
              >
                Hoje
              </Nav.Item>
              <Nav.Item
                icon={<FaRegCalendarAlt />}
                eventKey="1-2"
                className="py-2 px-4 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors duration-200"
              >
                Calendário
              </Nav.Item>
              <Nav.Item
                icon={<MdTaskAlt />}
                eventKey="1-3"
                className="py-2 px-4 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors duration-200"
              >
                Todas as Tarefas
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
          <Sidenav.Toggle onToggle={onExpand} />
        </Sidenav>
      </div>
    </div>;
  };
  return (
    <CustomSidenav
      activeKey={activeKey}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
      onSelect={setActiveKey}
      expanded={expanded}
      onExpand={setExpand}
      appearance="inverse"
    />
  );
};

export default Sidebar;
