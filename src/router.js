class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        
        // Listen for URL changes
        //window.addEventListener('popstate', () => this.handleRoute());
        //window.addEventListener('hashchange', () => this.handleRoute());

        // avoid using addEventListener() as requested
        window.onpopstate = () => this.handleRoute();
        window.onhashchange = () => this.handleRoute();
    }

    // Register a route
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    // Navigate to a route
    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    // Handle route changes
    handleRoute() {
        const path = window.location.hash.slice(1) || '/';
        this.currentRoute = path;
        
        const handler = this.routes[path];
        if (handler) {
            handler();
        }
    }

    // Get current route
    getCurrentRoute() {
        return this.currentRoute;
    }
}

export const router = new Router();