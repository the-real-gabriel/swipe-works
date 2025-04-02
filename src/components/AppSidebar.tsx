
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Home, 
  User, 
  PlusCircle, 
  ClipboardList, 
  Settings, 
  LogOut, 
  LogIn, 
  UserPlus
} from 'lucide-react';

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine if a menu item is active based on the current path
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center p-2 justify-between">
          <div className={`text-xl font-semibold text-primary flex items-center gap-1.5 ${state === "collapsed" ? "hidden" : ""}`}>
            <span className="font-bold">Design</span>
            <span>Swipe</span>
          </div>
          <SidebarTrigger className={state === "collapsed" ? "mx-auto" : "ml-auto"} />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col justify-between h-full">
        {/* Main Navigation - All at the top */}
        <div className="space-y-1">
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
        </div>
        
        {/* Account Options - At the bottom */}
        <div className="mt-auto">
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

            {user && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  tooltip="Logout"
                >
                  <LogOut className="mr-2" size={18} />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
