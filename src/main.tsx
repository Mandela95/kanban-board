import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { App } from "./App"
import { store } from "./app/store"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      cacheTime: 1000 * 60 * 5,
    },
  },
})

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document.",
  )
}
