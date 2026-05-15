import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={` h-full w-full antialiased`}
    >
      <body className="min-h-full w-full flex flex-col bg-[#dc965a] justify-between" cz-shortcut-listen="true">
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}