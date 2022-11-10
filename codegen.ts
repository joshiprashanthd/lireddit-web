import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'http://localhost:4000/graphql',
    documents: ['./src/graphql/**/*.graphql'],
    generates: {
        './src/gql/graphql.tsx': {
            plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
        },
    },
}

export default config
