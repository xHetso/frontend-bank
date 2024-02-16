import { AboutUs } from '@/component/screens/about-us/about-us.component'
import { Auth } from '@/component/screens/auth/auth.component'
import { Home } from '@/component/screens/home/home.component'

export const ROUTES = [
	{
		path: '/',
		component: Home
	},
	{
		path: '/auth',
		component: Auth
	},
	{
		path: '/about-us',
		component: AboutUs
	}
]
