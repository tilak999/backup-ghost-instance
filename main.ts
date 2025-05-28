import dotenv from "dotenv"
dotenv.config()

import { server } from "./router"

const main = async () => {
    const s = await server()
    const address = s.listen({ port: 3000 })
    s.log.info(`server listening on ${address}`)
}

main()
