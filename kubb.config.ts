import {defineConfig} from '@kubb/core'
import {pluginOas} from '@kubb/plugin-oas'
import {pluginTs} from '@kubb/plugin-ts'
import {pluginZod} from '@kubb/plugin-zod'
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
				dataReturnType: 'data',
			},
			mutation: {
				methods: ['post', 'put', 'delete', 'patch'],
			},
			query: {
				methods: ['get'],
				importPath: "@tanstack/react-query"
			},
			suspense: {},
		}),
	],
})
