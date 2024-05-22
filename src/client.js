import axios from 'axios'
import { Transform, Writable } from 'stream'

const url = 'http://localhost:3000'

const consume = async () => {
  const response = await axios({
    url,
    method: 'get',
    responseType: 'stream'
  })

  return response.data
}

const stream = await consume()

stream
  .pipe(
    new Transform({
      transform(chunk, encoding, callback) {
        const parsedData = JSON.parse(chunk)
        const myNumber = /\d+/.exec(parsedData.name)[0]

        let name = parsedData.name
        if (myNumber % 2 === 0) {
          name = name.concat(' is even')
        } else name = name.concat(' is odd')

        parsedData.name = name
        callback(null, JSON.stringify(parsedData))
      }
    })
  )
  .pipe(
    new Transform({
      transform(chunk, encoding, callback) {
        const parsedData = JSON.parse(chunk.toString())
        parsedData.name = parsedData.name.toUpperCase()

        callback(null, JSON.stringify(parsedData))
      }
    })
  )
  .pipe(
    new Writable({
      write(chunk, encoding, callback) {
        console.log(JSON.parse(chunk.toString()))
        callback()
      }
    })
  )