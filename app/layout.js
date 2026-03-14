jsexport const metadata = {
  title: 'Monarch — Where Founders Find Their Missing Half',
  description: 'Monarch connects entrepreneurs, cofounders, advisers, and consultants through intelligent matching.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0B0E11' }}>
        {children}
      </body>
    </html>
  )
}
