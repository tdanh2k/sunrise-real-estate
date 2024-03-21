/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ClientImport } from './routes/_client'
import { Route as ClientIndexImport } from './routes/_client/index'
import { Route as ManagementManagementImport } from './routes/management/_management'
import { Route as ClientContactImport } from './routes/_client/contact'
import { Route as ClientAboutImport } from './routes/_client/about'
import { Route as ManagementManagementIndexImport } from './routes/management/_management/index'
import { Route as ClientBlogIndexImport } from './routes/_client/blog/index'
import { Route as ClientFlatIdImport } from './routes/_client/flat/$id'
import { Route as ClientBlogIdImport } from './routes/_client/blog/$id'

// Create Virtual Routes

const ManagementImport = createFileRoute('/management')()

// Create/Update Routes

const ManagementRoute = ManagementImport.update({
  path: '/management',
  getParentRoute: () => rootRoute,
} as any)

const ClientRoute = ClientImport.update({
  id: '/_client',
  getParentRoute: () => rootRoute,
} as any)

const ClientIndexRoute = ClientIndexImport.update({
  path: '/',
  getParentRoute: () => ClientRoute,
} as any)

const ManagementManagementRoute = ManagementManagementImport.update({
  id: '/_management',
  getParentRoute: () => ManagementRoute,
} as any)

const ClientContactRoute = ClientContactImport.update({
  path: '/contact',
  getParentRoute: () => ClientRoute,
} as any)

const ClientAboutRoute = ClientAboutImport.update({
  path: '/about',
  getParentRoute: () => ClientRoute,
} as any)

const ManagementManagementIndexRoute = ManagementManagementIndexImport.update({
  path: '/',
  getParentRoute: () => ManagementManagementRoute,
} as any)

const ClientBlogIndexRoute = ClientBlogIndexImport.update({
  path: '/blog/',
  getParentRoute: () => ClientRoute,
} as any)

const ClientFlatIdRoute = ClientFlatIdImport.update({
  path: '/flat/$id',
  getParentRoute: () => ClientRoute,
} as any)

const ClientBlogIdRoute = ClientBlogIdImport.update({
  path: '/blog/$id',
  getParentRoute: () => ClientRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_client': {
      preLoaderRoute: typeof ClientImport
      parentRoute: typeof rootRoute
    }
    '/_client/about': {
      preLoaderRoute: typeof ClientAboutImport
      parentRoute: typeof ClientImport
    }
    '/_client/contact': {
      preLoaderRoute: typeof ClientContactImport
      parentRoute: typeof ClientImport
    }
    '/management': {
      preLoaderRoute: typeof ManagementImport
      parentRoute: typeof rootRoute
    }
    '/management/_management': {
      preLoaderRoute: typeof ManagementManagementImport
      parentRoute: typeof ManagementRoute
    }
    '/_client/': {
      preLoaderRoute: typeof ClientIndexImport
      parentRoute: typeof ClientImport
    }
    '/_client/blog/$id': {
      preLoaderRoute: typeof ClientBlogIdImport
      parentRoute: typeof ClientImport
    }
    '/_client/flat/$id': {
      preLoaderRoute: typeof ClientFlatIdImport
      parentRoute: typeof ClientImport
    }
    '/_client/blog/': {
      preLoaderRoute: typeof ClientBlogIndexImport
      parentRoute: typeof ClientImport
    }
    '/management/_management/': {
      preLoaderRoute: typeof ManagementManagementIndexImport
      parentRoute: typeof ManagementManagementImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  ClientRoute.addChildren([
    ClientAboutRoute,
    ClientContactRoute,
    ClientIndexRoute,
    ClientBlogIdRoute,
    ClientFlatIdRoute,
    ClientBlogIndexRoute,
  ]),
  ManagementRoute.addChildren([
    ManagementManagementRoute.addChildren([ManagementManagementIndexRoute]),
  ]),
])

/* prettier-ignore-end */
