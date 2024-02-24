import { Layout } from '@/components/layout/layout.component'
import { NotFound } from '@/components/screens/not-found/not-found.component'

import { $R } from '../rquery/rquery.lib'

import { ROUTES } from './routes.data'

export class Router {
	#routes = ROUTES
	#currentRoute = null
	#layout = null

	constructor() {
		//popstate событие которое возникает отлавливает кнопку назад кнопку вперед
		window.addEventListener('popstate', () => {
			this.#handleRouteChange()
		})

		this.#handleRouteChange(this.#routes)
		this.#handleLinks()
	}

	#handleLinks() {
		document.addEventListener('click', event => {
			//находим ближайший элемент а
			const target = event.target.closest('a')

			if (target) {
				//по умолчанию отключаем переход на другую страницу
				event.preventDefault()
				//вешаем свою навигацию
				this.navigate(target.href)
			}
		})
	}

	getCurrentPath() {
		return window.location.pathname
	}

	navigate(path) {
		if (path !== this.getCurrentPath()) {
			window.history.pushState({}, '', path)
			this.#handleRouteChange()
		}
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
		const component = new this.#currentRoute.component().render()

		if (!this.#layout) {
			this.#layout = new Layout({
				router: this,
				children: component
			}).render()

			$R('#app').append(this.#layout)
		} else {
			$R('#content').html('').append(component)
		}
	}
}
