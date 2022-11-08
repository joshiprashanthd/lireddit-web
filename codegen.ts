import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'http://localhost:4000/graphql',
    documents: ['./src/graphql/**/*.graphql'],
    generates: {
        './src/gql/': {
            preset: 'client',
            config: {
                withHooks: true,
            },
            plugins: ['typescript-urql'],
        },
    },
}

export default config
