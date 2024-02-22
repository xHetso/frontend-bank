import ChildComponent from '../component/child.component'

class RenderService {
	/**
	 * @param {string} html
	 * @param {Array} components
	 * @param {Object} [styles]
	 * @returns {HTMLElement}
	 */
	htmlToElement(html, components = [], styles) {
		const template = document.createElement('template')
		template.innerHTML = html.trim()

		const element = template.content.firstChild

		// styles

		this.#replaceComponentTags(element, components)

		return element
	}

	/**
	 * @param {HTMLElement} parentElement
	 * @param {Array} components
	 */
	// Определение метода replaceComponentTags с двумя аргументами: parentElement и components
	#replaceComponentTags(parentElement, components) {
		// Создание регулярного выражения для поиска тегов, начинающихся с 'component-'
		const componentTagPattern = /^component-/
		// Получение всех дочерних элементов parentElement
		const allElements = parentElement.getElementsByTagName('*')

		// Перебор всех элементов
		for (const element of allElements) {
			// Получение имени тега текущего элемента в нижнем регистре
			const elementTagName = element.tagName.toLowerCase()
			// Проверка, соответствует ли имя тега регулярному выражению componentTagPattern
			if (componentTagPattern.test(elementTagName)) {
				// Удаление 'component-' из имени тега и замена всех дефисов на пустую строку
				const componentName = elementTagName
					.replace(componentTagPattern, '')
					.replace(/-/g, '')

				// Поиск компонента в массиве components, имя которого соответствует обработанному имени тега
				const foundComponent = components.find(Component => {
					// Создание экземпляра Component или использование существующего, если он является экземпляром ChildComponent
					const instance =
						Component instanceof ChildComponent ? Component : new Component()

					// Сравнение имени конструктора экземпляра с обработанным именем тега
					return instance.constructor.name.toLowerCase() === componentName
				})

				if (foundComponent) {
					// Получение содержимого компонента с использованием метода render
					const componentContent =
						foundComponent instanceof ChildComponent
							? foundComponent.render()
							: new foundComponent().render()
					// Замена текущего элемента содержимым компонента
					element.replaceWith(componentContent)
				} else {
					console.error(
						`Component "${componentName}" not found in the provided components array.`
					)
				}
			}
		}
	}
	// #applyModuleStyles
}

export default new RenderService()

{
	/* <div class='home'>
	<h1 class='text'></h1>
	<component-heading></component-heading>
	<component-card-info></component-card-info>
</div>
 */
}
