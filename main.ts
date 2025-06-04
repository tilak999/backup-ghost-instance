import dotenv from "dotenv"
dotenv.config()

import { server } from "./router"

const main = async () => {
    const app = await server()
    const address = app.listen({ port: 3000 })
    app.log.info(`server listening on ${address}`)
}

main()
