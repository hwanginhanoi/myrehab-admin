import { defineConfig } from '@kubb/core';
import { pluginClient } from '@kubb/plugin-client';
import { pluginTs} from '@kubb/plugin-ts';
import { pluginZod } from '@kubb/plugin-zod';
import { pluginOas } from '@kubb/plugin-oas'

export default defineConfig({
    root: '.',
    input: {
        path: './petstore.yaml',
    },
    output: {
        path: './api',
        clean: true,
    },
    plugins: [
        pluginOas({
            output: {
                path: './schemas',
            },
            validate: true,
        }),
        pluginTs({
            output: {
                path: './types',
            },
        }),
        pluginZod({
            output: {
                path: './zod',
            },
        }),
        pluginClient({
            output: {
                path: './api',
                barrelType: 'named',
            },
            client: 'axios',
            importPath: '@/lib/api-client',
            group: {
                type: 'tag',
            },
        }),
    ],
});