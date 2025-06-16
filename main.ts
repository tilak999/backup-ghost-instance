import dotenv from "dotenv"
dotenv.config()

import { server } from "./router"

const main = async () => {
    const app = await server()
    const address = app.listen({
        port: parseInt(process.env.PORT || "3000"),
        host: process.env.HOST || "0.0.0.0"
    })
    app.log.info(`server listening on ${address}`)
}

main()
