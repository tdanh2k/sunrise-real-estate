/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ManagementImport } from './routes/_management'
import { Route as ClientImport } from './routes/_client'
import { Route as ClientIndexImport } from './routes/_client/index'
import { Route as ClientContactImport } from './routes/_client/contact'
import { Route as ClientAboutImport } from './routes/_client/about'
import { Route as ManagementUserRouteImport } from './routes/_management/user/route'
import { Route as ManagementManagementRouteImport } from './routes/_management/management/route'
import { Route as ClientBlogIndexImport } from './routes/_client/blog/index'
import { Route as ClientPostIdImport } from './routes/_client/post/$id'
import { Route as ClientBlogIdImport } from './routes/_client/blog/$id'
import { Route as ManagementUserPostsRouteImport } from './routes/_management/user/posts/route'
import { Route as ManagementManagementUsersRouteImport } from './routes/_management/management/users/route'
import { Route as ManagementManagementPostsRouteImport } from './routes/_management/management/posts/route'
import { Route as ManagementManagementPostsIndexImport } from './routes/_management/management/posts/index'
import { Route as ManagementUserPostsPostIndexImport } from './routes/_management/user/posts/post/index'
import { Route as ManagementUserPostsPendingpostsIndexImport } from './routes/_management/user/posts/pending_posts/index'
import { Route as ManagementUserPostsDraftpostIndexImport } from './routes/_management/user/posts/draft_post/index'
import { Route as ManagementManagementUsersUserIndexImport } from './routes/_management/management/users/user/index'
import { Route as ManagementManagementPostsPosttypeIndexImport } from './routes/_management/management/posts/post_type/index'
import { Route as ManagementManagementPostsPostdetailIndexImport } from './routes/_management/management/posts/post_detail/index'
import { Route as ManagementManagementPostsPostIndexImport } from './routes/_management/management/posts/post/index'
import { Route as ManagementManagementPostsDraftpostIndexImport } from './routes/_management/management/posts/draft_post/index'

// Create/Update Routes

const ManagementRoute = ManagementImport.update({
  id: '/_management',
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

const ClientContactRoute = ClientContactImport.update({
  path: '/contact',
  getParentRoute: () => ClientRoute,
} as any)

const ClientAboutRoute = ClientAboutImport.update({
  path: '/about',
  getParentRoute: () => ClientRoute,
} as any)

const ManagementUserRouteRoute = ManagementUserRouteImport.update({
  path: '/user',
  getParentRoute: () => ManagementRoute,
} as any)

const ManagementManagementRouteRoute = ManagementManagementRouteImport.update({
  path: '/management',
  getParentRoute: () => ManagementRoute,
} as any)

const ClientBlogIndexRoute = ClientBlogIndexImport.update({
  path: '/blog/',
  getParentRoute: () => ClientRoute,
} as any)

const ClientPostIdRoute = ClientPostIdImport.update({
  path: '/post/$id',
  getParentRoute: () => ClientRoute,
} as any)

const ClientBlogIdRoute = ClientBlogIdImport.update({
  path: '/blog/$id',
  getParentRoute: () => ClientRoute,
} as any)

const ManagementUserPostsRouteRoute = ManagementUserPostsRouteImport.update({
  path: '/posts',
  getParentRoute: () => ManagementUserRouteRoute,
} as any)

const ManagementManagementUsersRouteRoute =
  ManagementManagementUsersRouteImport.update({
    path: '/users',
    getParentRoute: () => ManagementManagementRouteRoute,
  } as any)

const ManagementManagementPostsRouteRoute =
  ManagementManagementPostsRouteImport.update({
    path: '/posts',
    getParentRoute: () => ManagementManagementRouteRoute,
  } as any)

const ManagementManagementPostsIndexRoute =
  ManagementManagementPostsIndexImport.update({
    path: '/',
    getParentRoute: () => ManagementManagementPostsRouteRoute,
  } as any)

const ManagementUserPostsPostIndexRoute =
  ManagementUserPostsPostIndexImport.update({
    path: '/post/',
    getParentRoute: () => ManagementUserPostsRouteRoute,
  } as any)

const ManagementUserPostsPendingpostsIndexRoute =
  ManagementUserPostsPendingpostsIndexImport.update({
    path: '/pending_posts/',
    getParentRoute: () => ManagementUserPostsRouteRoute,
  } as any)

const ManagementUserPostsDraftpostIndexRoute =
  ManagementUserPostsDraftpostIndexImport.update({
    path: '/draft_post/',
    getParentRoute: () => ManagementUserPostsRouteRoute,
  } as any)

const ManagementManagementUsersUserIndexRoute =
  ManagementManagementUsersUserIndexImport.update({
    path: '/user/',
    getParentRoute: () => ManagementManagementUsersRouteRoute,
  } as any)

const ManagementManagementPostsPosttypeIndexRoute =
  ManagementManagementPostsPosttypeIndexImport.update({
    path: '/post_type/',
    getParentRoute: () => ManagementManagementPostsRouteRoute,
  } as any)

const ManagementManagementPostsPostdetailIndexRoute =
  ManagementManagementPostsPostdetailIndexImport.update({
    path: '/post_detail/',
    getParentRoute: () => ManagementManagementPostsRouteRoute,
  } as any)

const ManagementManagementPostsPostIndexRoute =
  ManagementManagementPostsPostIndexImport.update({
    path: '/post/',
    getParentRoute: () => ManagementManagementPostsRouteRoute,
  } as any)

const ManagementManagementPostsDraftpostIndexRoute =
  ManagementManagementPostsDraftpostIndexImport.update({
    path: '/draft_post/',
    getParentRoute: () => ManagementManagementPostsRouteRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_client': {
      preLoaderRoute: typeof ClientImport
      parentRoute: typeof rootRoute
    }
    '/_management': {
      preLoaderRoute: typeof ManagementImport
      parentRoute: typeof rootRoute
    }
    '/_management/management': {
      preLoaderRoute: typeof ManagementManagementRouteImport
      parentRoute: typeof ManagementImport
    }
    '/_management/user': {
      preLoaderRoute: typeof ManagementUserRouteImport
      parentRoute: typeof ManagementImport
    }
    '/_client/about': {
      preLoaderRoute: typeof ClientAboutImport
      parentRoute: typeof ClientImport
    }
    '/_client/contact': {
      preLoaderRoute: typeof ClientContactImport
      parentRoute: typeof ClientImport
    }
    '/_client/': {
      preLoaderRoute: typeof ClientIndexImport
      parentRoute: typeof ClientImport
    }
    '/_management/management/posts': {
      preLoaderRoute: typeof ManagementManagementPostsRouteImport
      parentRoute: typeof ManagementManagementRouteImport
    }
    '/_management/management/users': {
      preLoaderRoute: typeof ManagementManagementUsersRouteImport
      parentRoute: typeof ManagementManagementRouteImport
    }
    '/_management/user/posts': {
      preLoaderRoute: typeof ManagementUserPostsRouteImport
      parentRoute: typeof ManagementUserRouteImport
    }
    '/_client/blog/$id': {
      preLoaderRoute: typeof ClientBlogIdImport
      parentRoute: typeof ClientImport
    }
    '/_client/post/$id': {
      preLoaderRoute: typeof ClientPostIdImport
      parentRoute: typeof ClientImport
    }
    '/_client/blog/': {
      preLoaderRoute: typeof ClientBlogIndexImport
      parentRoute: typeof ClientImport
    }
    '/_management/management/posts/': {
      preLoaderRoute: typeof ManagementManagementPostsIndexImport
      parentRoute: typeof ManagementManagementPostsRouteImport
    }
    '/_management/management/posts/draft_post/': {
      preLoaderRoute: typeof ManagementManagementPostsDraftpostIndexImport
      parentRoute: typeof ManagementManagementPostsRouteImport
    }
    '/_management/management/posts/post/': {
      preLoaderRoute: typeof ManagementManagementPostsPostIndexImport
      parentRoute: typeof ManagementManagementPostsRouteImport
    }
    '/_management/management/posts/post_detail/': {
      preLoaderRoute: typeof ManagementManagementPostsPostdetailIndexImport
      parentRoute: typeof ManagementManagementPostsRouteImport
    }
    '/_management/management/posts/post_type/': {
      preLoaderRoute: typeof ManagementManagementPostsPosttypeIndexImport
      parentRoute: typeof ManagementManagementPostsRouteImport
    }
    '/_management/management/users/user/': {
      preLoaderRoute: typeof ManagementManagementUsersUserIndexImport
      parentRoute: typeof ManagementManagementUsersRouteImport
    }
    '/_management/user/posts/draft_post/': {
      preLoaderRoute: typeof ManagementUserPostsDraftpostIndexImport
      parentRoute: typeof ManagementUserPostsRouteImport
    }
    '/_management/user/posts/pending_posts/': {
      preLoaderRoute: typeof ManagementUserPostsPendingpostsIndexImport
      parentRoute: typeof ManagementUserPostsRouteImport
    }
    '/_management/user/posts/post/': {
      preLoaderRoute: typeof ManagementUserPostsPostIndexImport
      parentRoute: typeof ManagementUserPostsRouteImport
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
    ClientPostIdRoute,
    ClientBlogIndexRoute,
  ]),
  ManagementRoute.addChildren([
    ManagementManagementRouteRoute.addChildren([
      ManagementManagementPostsRouteRoute.addChildren([
        ManagementManagementPostsIndexRoute,
        ManagementManagementPostsDraftpostIndexRoute,
        ManagementManagementPostsPostIndexRoute,
        ManagementManagementPostsPostdetailIndexRoute,
        ManagementManagementPostsPosttypeIndexRoute,
      ]),
      ManagementManagementUsersRouteRoute.addChildren([
        ManagementManagementUsersUserIndexRoute,
      ]),
    ]),
    ManagementUserRouteRoute.addChildren([
      ManagementUserPostsRouteRoute.addChildren([
        ManagementUserPostsDraftpostIndexRoute,
        ManagementUserPostsPendingpostsIndexRoute,
        ManagementUserPostsPostIndexRoute,
      ]),
    ]),
  ]),
])

/* prettier-ignore-end */
