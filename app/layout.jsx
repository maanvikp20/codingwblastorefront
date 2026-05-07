import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}