export function getDefaultSidebarType(
  responsive,
  defaultOpen,
  { float, mini }
) {
  let sidebar = 'normal';

  if (responsive) {
    if (window.innerWidth < 600) {
      sidebar = null;
    } else if (window.innerWidth < 1000) {
      sidebar = 'mini';
    }
  } else {
    sidebar = !defaultOpen ? null : float ? 'float' : mini ? 'mini' : 'normal';
  }

  return sidebar;
}

export function getScreenResizeListener(defaultSidebar, setSidebar) {
  let lastSidebar = defaultSidebar;

  function screenResizeListener(e) {
    if (window.innerWidth < 600) {
      if (lastSidebar !== null) {
        lastSidebar = null;
        setSidebar(null);
      }
    } else if (window.innerWidth < 1000) {
      if (lastSidebar !== 'mini') {
        lastSidebar = 'mini';
        setSidebar('mini');
      }
    } else if (lastSidebar !== 'normal') {
      lastSidebar = 'normal';
      setSidebar('normal');
    }
  }

  const addScreenResizeListener = () => {
    window.addEventListener('resize', screenResizeListener, true);
  };

  const removeScreenResizeListener = () => {
    window.removeEventListener('resize', screenResizeListener, true);
  };

  return {
    addScreenResizeListener,
    removeScreenResizeListener
  };
}

export const handleOpenResponsiveSidebar = (setSidebar) => {
  if (window.innerWidth < 600) {
    setSidebar(sidebar => sidebar ? null : 'float');
  } else if (window.innerWidth < 1000) {
    setSidebar(sidebar => sidebar === 'float mini' ? 'mini' : 'float mini');
  } else {
    setSidebar(sidebar => sidebar === 'mini' ? 'normal' : 'mini');
  }
};