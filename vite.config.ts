import { readFileSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import { DATA_FILES } from './src/data/schemas.ts'

/** Fails the build (and the dev server start) when a published JSON file does not match its schema. */
function validateData(): Plugin {
  let root = process.cwd()
  return {
    name: 'validate-data',
    configResolved(config) {
      root = config.root
    },
    buildStart() {
      for (const [file, schema] of Object.entries(DATA_FILES)) {
        let data: unknown
        try {
          data = JSON.parse(readFileSync(path.join(root, file), 'utf8'))
        } catch (error) {
          this.error(`${file} is not valid JSON: ${(error as Error).message}`)
        }
        const result = schema.safeParse(data)
        if (!result.success) {
          const problems = result.error.issues.map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`)
          this.error(`${file} is not valid:\n${problems.join('\n')}`)
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [validateData(), react(), tailwindcss()],
})
