import { ROUTES } from './routes.data'
import { Layout } from '@/component/layout/layout.component'
import { NotFound } from '@/component/screens/not-found/not-found.component'

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
				event.presentDefault()
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
		const component = new this.#currentRoute.component()
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
