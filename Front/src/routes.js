import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const privilège = React.lazy(() => import('./views/account/privilège/Privilège'))
const Users = React.lazy(() => import('./views/account/users/Users'))
const ClientList = React.lazy(() => import('./views/customerSettings/clientList/ClientList'))
const ListPayment = React.lazy(() => import('./views/customerSettings/listPayment/ListPayment'))
const Subscription = React.lazy(() => import('./views/customerSettings/subscriptions/Subscriptions'))
const PaymentMethod = React.lazy(() => import('./views/applicationSettings/PaymentMethod/PaymentMethod'))
const Categories = React.lazy(() => import('./views/applicationSettings/Categories/Categories'))
const Kits = React.lazy(() => import('./views/applicationSettings/Articlekits/Kits'))
const ChildCategories = React.lazy(() => import('./views/applicationSettings/childCategories/ChildCatg'))
const Brand = React.lazy(() => import('./views/applicationSettings/Brands/Brands'))
const Article = React.lazy(() => import('./views/applicationSettings/Articles/Articles'))
const Advertisements = React.lazy(() => import('./views/applicationSettings/Advertisements/Advertisements'))
const Discounts = React.lazy(() => import('./views/applicationSettings/Discounts/Discounts'))
const DiscountItems = React.lazy(() => import('./views/applicationSettings/DiscountedItems/DiscountItems'))
const OrderS = React.lazy(() => import('./views/OrderSettings/OrderStatus/OrderS'))
const ListOrderS = React.lazy(() => import('./views/OrderSettings/ListOrders/ListOrders'))
const CommandTrans = React.lazy(() => import('./views/OrderSettings/CommandTransactions/CommandTrans'))
const ProfileIdentifier = React.lazy(() => import('./views/applicationSettings/ProfileIdentifiers/ProfileIdentifiers'))
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/account/privilège', name: 'privilège', element: privilège },
  { path: '/account/users', name: 'users', element: Users },
  { path: '/customerSettings/clientList', name: 'clientList', element: ClientList },
  { path: '/customerSettings/listPayment', name: 'listPayment', element: ListPayment },
  { path: '/customerSettings/subscriptions', name: 'subscriptions', element: Subscription },
  { path: '/applicationSettings/PaymentMethod', name: 'PaymentMethod', element: PaymentMethod },
  { path: '/applicationSettings/Categories', name: 'Categories', element: Categories },
  { path: '/applicationSettings/Articlekits', name: 'Kits', element: Kits },
  { path: '/applicationSettings/childCategories', name: 'childCategories', element: ChildCategories },
  { path: '/applicationSettings/Brands', name: 'Brand', element: Brand },
  { path: '/applicationSettings/Articles', name: 'Article', element: Article },
  { path: '/applicationSettings/Advertisements', name: 'Advertisements', element: Advertisements },
  { path: '/applicationSettings/Discounts', name: 'Discounts', element: Discounts },
  { path: '/applicationSettings/DiscountedItems', name: 'DiscountItems', element: DiscountItems },
  { path: '/Order settings/OrderStatus', name: 'OrderS', element: OrderS },
  { path: '/Order settings/ListOrders', name: 'ListOrderS', element: ListOrderS },
  { path: '/Order settings/CommandTransactions', name: 'CommandTrans', element: CommandTrans },
  { path: '/customerSettings/clientInformation', name: 'ProfileIdentifier', element: ProfileIdentifier },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
