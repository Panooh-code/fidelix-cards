import { useLocation } from 'react-router-dom';
import MinimalHeader from './MinimalHeader';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Routes that should show the MinimalHeader
  const showMinimalHeader = [
    '/wizard',
    '/my-cards',
    '/my-customer-cards'
  ].some(route => location.pathname.startsWith(route)) ||
  // Dynamic routes patterns
  /^\/my-card\//.test(location.pathname) ||  // /my-card/:cardCode
  /^\/my-cards\/.*\/customers$/.test(location.pathname); // /my-cards/:cardId/customers
  
  // Routes that should NOT show any header (public card pages and home)
  const hideAllHeaders = location.pathname === '/' || 
                         /^\/card\//.test(location.pathname); // /card/:publicCode

  if (hideAllHeaders) {
    return <>{children}</>;
  }

  if (showMinimalHeader) {
    return (
      <>
        <MinimalHeader />
        <div className="pt-14"> {/* Offset for fixed header */}
          {children}
        </div>
      </>
    );
  }

  // Default case - no header
  return <>{children}</>;
};

export default ConditionalLayout;