import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 修正點：將帶有參數的路由設為 Client 渲染，避開預渲染錯誤
  {
    path: 'history/:dataset',
    renderMode: RenderMode.Client
  },
  {
    path: 'history',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];