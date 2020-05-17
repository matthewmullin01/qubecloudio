import { ServerFullComponent } from 'src/app/home/servers/server-full/server-full.component';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy extends RouteReuseStrategy {
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {}
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return null;
  }
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const name = future.component && (future.component as any).name;
    /*
    Do as normal (future.routeConfig === curr.routeConfig) unless its one of these: && (name !== ... && name !== ......)
    */
    return future.routeConfig === curr.routeConfig && future.component !== ServerFullComponent;
    // return future.routeConfig === curr.routeConfig; // Default
  }
}
