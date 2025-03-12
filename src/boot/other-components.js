import Print from 'vue3-print-nb'
// Global instruction
// Vue.use(Print)

export default async ({ app }) => {
  // app.use(WacomGSS)
  app.use(Print)

  // app.use(VuePdf)
}
