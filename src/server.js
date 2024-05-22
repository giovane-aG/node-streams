
import { randomUUID } from 'crypto'
import http from 'http'
import { Readable } from 'stream'

function* run() {
  for (let i = 0; i <= 10; i++) {
    const data = {
      id: randomUUID(),
      name: `Test ${i}`
    }

    yield data
  }
}

const handler = (request, response) => {
  const readable = new Readable({
    read() {
      for (const data of run()) {
        this.push(JSON.stringify(data) + "\n")
      }

      this.push(null)
    }
  })

  readable.pipe(response)
}

const server = http.createServer(handler)
  .listen(3000)
  .on('listening', () => console.log('Server running on http://localhost:3000/'))