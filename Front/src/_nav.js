import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilContact,
  cilSettings,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Account',
  },
  {
    component: CNavItem,
    name: 'Privileges',
    to: '/account/privilège',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/account/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavGroup,
    name: 'customer settings',
    to: '/customerSettings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'client list',
        to: '/customerSettings/clientList',
      },
      {
        component: CNavItem,
        name: 'client information',
        to: '/customerSettings/clientInformation',
      },
      {
        component: CNavItem,
        name: 'list of payment cards',
        to: '/customerSettings/listPayment',
      },
      {
        component: CNavItem,
        name: 'subscriptions',
        to: '/customerSettings/subscriptions',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'application settings',
    to: '/applicationSettings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Payment method',
        to: '/applicationSettings/PaymentMethod',
      },
      {
        component: CNavItem,
        name: 'Profile identifiers',
        to: '/applicationSettings/ProfileIdentifiers',
      },
      {
        component: CNavItem,
        name: 'Categories',
        to: '/applicationSettings/Categories',
      },
      {
        component: CNavItem,
        name: 'Article kits',
        to: '/applicationSettings/Articlekits',
      },
      {
        component: CNavItem,
        name: 'child Categories',
        to: '/applicationSettings/childCategories',
      },
      {
        component: CNavItem,
        name: 'Brands',
        to: '/applicationSettings/Brands',
      },
      {
        component: CNavItem,
        name: 'Articles',
        to: '/applicationSettings/Articles',
      },
      {
        component: CNavItem,
        name: 'Advertisements',
        to: '/applicationSettings/Advertisements',
      },
      {
        component: CNavItem,
        name: 'Discounts',
        to: '/applicationSettings/Discounts',
      },
      {
        component: CNavItem,
        name: 'Discounted items',
        to: '/applicationSettings/DiscountedItems',
      },

    ],
  },
  {
    component: CNavGroup,
    name: 'Order settings',
    to: '/OrderSettings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Order status',
        to: '/Order settings/OrderStatus',
      },
      {
        component: CNavItem,
        name: 'List of orders',
        to: '/Order settings/ListOrders',
      },
      {
        component: CNavItem,
        name: 'Command transactions',
        to: '/Order settings/CommandTransactions',
      },
      
    

    ],
  },
 
]

export default _nav
