import { setupWorker } from 'msw/browser'
import { handlers } from 'Mocks/handlers'

export const worker = setupWorker(...handlers)
