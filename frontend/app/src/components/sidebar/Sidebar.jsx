import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBIcon
} from 'cdbreact';

import { NavLink } from 'react-router-dom'
import Logo from '../../assets/images/LogoU17White.png'
import PropTypes from 'prop-types'
import './Sidebar.css'

const Sidebar = ({ children, scroll }) => {

  return (
    <>
      <div className='sidebar'>
        <CDBSidebar textColor="#fff" backgroundColor="#333">
          <CDBSidebarHeader prefix={<CDBIcon icon="bars" size="lg" />}>
            <img src={Logo} style={{width: '30px', marginRight: '10px'}}></img>
            Fanta Volley
          </CDBSidebarHeader>

          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              <NavLink exact="true" to="/" className={({ isActive }) => isActive? "activeClicked": ''}>
                <CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact="true" to="/leagues" className={({ isActive }) => isActive ? "activeClicked" : ''}>
                <CDBSidebarMenuItem icon="trophy">Leghe</CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
            <span className="separator" style={{width: '90%', height: '1px', backgroundColor: '#fff', position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}></span>
            <CDBSidebarMenu>
              <NavLink exact="true" to="/players" className={({ isActive }) => isActive ? "activeClicked" : ''}>
                <CDBSidebarMenuItem icon="users">Giocatori</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact="true" to="/stats" className={({ isActive }) => isActive ? "activeClicked" : ''}>
                <CDBSidebarMenuItem icon="chart-bar">Statistiche</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact="true" to="/rules" className={({ isActive }) => isActive ? "activeClicked" : ''}>
                <CDBSidebarMenuItem icon="book">Regolamento</CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          </CDBSidebarContent>
          
          <CDBSidebarFooter style={{ textAlign: 'left' }}>
            <div>
              <CDBSidebarContent className="sidebar-content">
                <CDBSidebarMenu>
                  <NavLink exact="true" to="/account" className={({ isActive }) => isActive ? "activeClicked" : ''}>
                    <CDBSidebarMenuItem icon="user">Account</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to='/logout' className='activeClicked logout-button'>
                    <CDBSidebarMenuItem icon="user-slash" style={{color: '#fff'}}>Esci</CDBSidebarMenuItem>
                  </NavLink>
                </CDBSidebarMenu>
              </CDBSidebarContent>
              <p style={{textAlign: 'center'}}>LFVM</p>
            </div>
          </CDBSidebarFooter>
        </CDBSidebar>

        <div className={scroll ? "page-content scroll" : "page-content"}>
          {children}
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  scroll: PropTypes.bool
};

export default Sidebar;