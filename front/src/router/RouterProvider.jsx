import {
	Outlet,
	RouterProvider as TanstackRouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from '@tanstack/react-router';
import Admin from '../pages/Admin';
import Quizz from '../pages/Quizz';
import Navbar from '../components/Navbar';

const rootRoute = createRootRoute({
	component: () => (
		<>
			<Navbar />
			<Outlet />
		</>
	),
});

const quizzRoute = createRoute({
	path: '/',
	getParentRoute: () => rootRoute,
	component: Quizz,
});

const adminRoute = createRoute({
	path: '/admin',
	getParentRoute: () => rootRoute,
	component: Admin,
});

const routeTree = rootRoute.addChildren([adminRoute, quizzRoute]);

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	defaultStaleTime: 0,
});

const RouterProvider = () => {
	return <TanstackRouterProvider router={router} />;
};

export { RouterProvider };
