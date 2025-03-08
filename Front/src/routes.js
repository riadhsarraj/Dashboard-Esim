import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Admins = React.lazy(() => import('./views/account/admins/Admins'))
const Users = React.lazy(() => import('./views/account/users/Users'))
const Orders = React.lazy(() => import('./views/followUp/orders/Orders'))
const Payment = React.lazy(() => import('./views/followUp/payment/Payment'))
const Plans = React.lazy(() => import('./views/ESim/plans/Plans'))
const Price = React.lazy(() => import('./views/ESim/price/Price'))
const ClientList = React.lazy(() => import('./views/customerSettings/clientList/ClientList'))


// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/account/admins', name: 'admins', element: Admins },
  { path: '/account/users', name: 'users', element: Users },
  { path: '/customerSettings/clientList', name: 'clientList', element: ClientList },
  { path: '/followUp/orders', name: 'orders', element: Orders },
  { path: '/followUp/payment', name: 'payment', element: Payment },
  { path: '/ESim/plans', name: 'plans', element: Plans },
  { path: '/ESim/price', name: 'price', element: Price },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
