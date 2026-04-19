import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  useEffect(() => {
    // 1. Find or create the favicon link tag
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    
    // 2. Set the properties
    (link as HTMLLinkElement).rel = 'icon';
    (link as HTMLLinkElement).type = 'image/png';
    (link as HTMLLinkElement).href = '/chalodrive.png'; // This matches the filename in your public folder
    
    // 3. Append to the head if it's new
    document.getElementsByTagName('head')[0].appendChild(link);
    
    // 4. Update the Website Title
    document.title = "RentiGo | Rent Your Ride";
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}