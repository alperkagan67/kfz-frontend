/**
 * Layout Component
 *
 * KFZ-22: Added Breadcrumb navigation
 */

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Breadcrumbs from './Breadcrumbs'
import { Box, Container } from '@mui/material'

function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
        <Container maxWidth="xl" disableGutters>
          <Breadcrumbs />
        </Container>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
