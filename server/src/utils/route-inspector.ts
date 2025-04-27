import { Express } from 'express';

export function listRoutes(app: Express) {
    const routes: {
        method: string;
        path: string;
        stack: string[];
    }[] = [];

    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
            // Routes defined directly
            const route = middleware.route;
            const methods = Object.keys(route.methods);
            methods.forEach((method) => {
                routes.push({
                    method: method.toUpperCase(),
                    path: route.path,
                    stack: route.stack.map((l: any) => l.name),
                });
            });
        } else if (middleware.name === 'router') {
            // Routes in routers
            middleware.handle.stack.forEach((handler: any) => {
                const route = handler.route;
                if (!route) return;
                const methods = Object.keys(route.methods);
                methods.forEach((method) => {
                    routes.push({
                        method: method.toUpperCase(),
                        path: route.path,
                        stack: route.stack.map((l: any) => l.name),
                    });
                });
            });
        }
    });

    return routes;
}
