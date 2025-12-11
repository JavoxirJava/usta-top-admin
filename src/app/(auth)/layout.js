export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}  {/* Login/Register — nav yo‘q */}
      </body>
    </html>
  );
}
