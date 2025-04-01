
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  Home, 
  User, 
  PlusCircle, 
  ClipboardList, 
  Settings, 
  LogOut, 
  LogIn, 
  UserPlus,
  PenLine,
  PanelLeftClose
} from 'lucide-react';

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine if a menu item is active based on the current path
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center p-2">
          <div className="text-xl font-semibold text-primary">DesignSwipe</div>
          <SidebarTrigger className="ml-auto md:hidden" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/')} 
                  onClick={() => navigate('/')}
                  tooltip="Home"
                >
                  <Home className="mr-2" size={18} />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/tasks')} 
                  onClick={() => navigate('/tasks')}
                  tooltip="Available Tasks"
                >
                  <ClipboardList className="mr-2" size={18} />
                  <span>Browse Tasks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Designer Options - Visible to all users during prototyping */}
        <SidebarGroup>
          <SidebarGroupLabel>Designer Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={isActive('/dashboard')} 
                    onClick={() => navigate('/dashboard')}
                    tooltip="Dashboard"
                  >
                    <ClipboardList className="mr-2" size={18} />
                    <span>My Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Client Options - Now visible to all users during prototyping */}
        <SidebarGroup>
          <SidebarGroupLabel>Client Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/post-task')} 
                  onClick={() => navigate('/post-task')}
                  tooltip="Post a New Task"
                >
                  <PlusCircle className="mr-2" size={18} />
                  <span>Post a Task</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/create-design-task')} 
                  onClick={() => navigate('/create-design-task')}
                  tooltip="Create Design Task"
                >
                  <PenLine className="mr-2" size={18} />
                  <span>Create Design Task</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={isActive('/profile')} 
                    onClick={() => navigate('/profile')}
                    tooltip="Profile"
                  >
                    <User className="mr-2" size={18} />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {!user && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={isActive('/login')} 
                      onClick={() => navigate('/login')}
                      tooltip="Log In"
                    >
                      <LogIn className="mr-2" size={18} />
                      <span>Log In</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={isActive('/register')} 
                      onClick={() => navigate('/register')}
                      tooltip="Register"
                    >
                      <UserPlus className="mr-2" size={18} />
                      <span>Register</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleLogout}
                tooltip="Logout"
              >
                <LogOut className="mr-2" size={18} />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
