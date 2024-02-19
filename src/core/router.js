import { ROUTES } from './routes.data'
import { Layout } from '@/component/layout/layout.component'
import { NotFound } from '@/component/screens/not-found/not-found.component'

export class Router {
	#routes = ROUTES
	#currentRoute = null
	#layout = null

	constructor() {
		this.#handleRouteChange(this.#routes)
	}

	getCurrentPath() {
		return window.location.pathname
	}

	#handleRouteChange() {
		const path = this.getCurrentPath() || '/'
		let route = this.#routes.find(route => route.path === path)
		if (!route) {
			route = {
				component: NotFound
			}
		}

		this.#currentRoute = route
		this.#render()
	}
	#render() {
		const component = new this.#currentRoute.component()
		console.log(this.#layout)
		if (!this.#layout) {
			this.#layout = new Layout({
				router: this,
				children: component.render()
			})
			document.getElementById('app').innerHTML = this.#layout.render()
		} else {
			document.querySelector('main').innerHTML = component.render()
		}
	}
}
