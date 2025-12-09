import {defineConfig} from '@kubb/core'
import {pluginOas} from '@kubb/plugin-oas'
import {pluginTs} from '@kubb/plugin-ts'
import {pluginZod} from '@kubb/plugin-zod'
import {pluginClient} from '@kubb/plugin-client'
import {pluginReactQuery} from '@kubb/plugin-react-query'

export default defineConfig({
	root: '.',
	input: {
		path: 'http://localhost:8080/v3/api-docs',
	},
	output: {
		path: './src/api',
		clean: true,
	},
	plugins: [
		pluginOas(),
		pluginTs({
			output: {
				path: 'types',
			},
			group: {
				type: 'tag',
			},
			enumType: 'asConst',
		}),
		pluginZod({
			output: {
				path: 'zod',
			},
			group: {
				type: 'tag',
			},
		}),
		pluginClient({
			output: {
				path: 'clients',
			},
			group: {
				type: 'tag',
			},
			client: 'axios',
			importPath: '@/lib/api-client',
			dataReturnType: 'data',
			pathParamsType: 'object',
		}),
		pluginReactQuery({
			output: {
				path: './hooks',
			},
			group: {
				type: 'tag',
				name: ({group}) => `${group}Hooks`,
			},
			client: {
				importPath: '@/lib/api-client',
				dataReturnType: 'full',
			},
			mutation: {
				methods: ['post', 'put', 'delete'],
			},
			infinite: {
				queryParam: 'next_page',
				initialPageParam: 0,
				nextParam: 'pagination.next.cursor',
				previousParam: ['pagination', 'prev', 'cursor'],
			},
			query: {
				methods: ['get'],
				importPath: "@tanstack/react-query"
			},
			suspense: {},
		}),
	],
})
