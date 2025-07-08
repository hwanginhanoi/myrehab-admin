import { defineConfig } from '@kubb/core';
import { pluginClient } from '@kubb/swagger-client';
import { pluginTs} from '@kubb/swagger-ts';
import { pluginZod } from '@kubb/swagger-zod';
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
                exportType: 'barrel',

            },
            client: {
                importPath: '@/lib/api-client',
            },
            group: {
                type: 'tag'
            }
        }),
    ],
});