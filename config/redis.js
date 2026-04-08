const { createClient }= require("redis")

const redisClient = createClient({
    url: process.env.REDIS_URL,
})

redisClient.on("connect", () => {
    console.log("redis client connected")
})

redisClient.on("error", (err) => {
    console.log("redis client error" , err)
})  

redisClient.connect()
module.exports = redisClient