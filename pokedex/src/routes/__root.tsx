import { createRootRoute, Outlet } from '@tanstack/react-router'
import { NotFoundPage, SiteChrome } from '../components/SiteChrome'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

function RootLayout() {
  return (
    <SiteChrome>
      <Outlet />
    </SiteChrome>
  )
}
