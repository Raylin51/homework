import * as fetchMock from 'fetch-mock'

interface Tasks {
  [key: number]: any
}

const cache = new Map()
let tasks: Tasks = {}
let timer: NodeJS.Timeout | null = null

fetchMock
  .get(`http://mock.com/api/user/1`, { msg: 'user1' })
  .get(`http://mock.com/api/user/2`, { msg: 'user2' })
  .get(`http://mock.com/api/user/3`, { msg: 'user3' })
  .get(`http://mock.com/api/user/888`, 500)
  .get(`http://mock.com/api/user/1,2`, [{ msg: 'user1' }, { msg: 'user2' }])
  .get(`http://mock.com/api/user/1,2,888`, 500)

const getUserById = (userId: number): Promise<string> => {
  if (cache.has(userId)) {
    return new Promise(resolve => {
      resolve(cache.get(userId))
    })
  } else {
    return middleWare(userId)
      .then(res => {
        if (!cache.has(userId)) {
          cache.set(userId, res)
        }
        return res
      })
      .catch(err => {
        throw err
      })
  }
}

const middleWare = (id: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    tasks[id] = [resolve, reject]
    const curTime = new Date()
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      const tasksList = Object.keys(tasks).map(Number)
      getUserByIds(tasksList)
        .then(res => {
          tasksList.map(taskId => {
            const taskResolve = tasks[taskId][0]
            taskResolve(res[tasksList.indexOf(taskId)])
          })
          timer = null
          tasks = {}
        })
        .catch(err => {
          tasksList.map(taskId => {
            const taskReject = tasks[taskId][1]
            taskReject(err)
          })
          timer = null
          tasks = {}
        })
    }, 300)
  })
}


const getUserByIds = (ids: number[]): Promise<any> => {
  return fetch(`http://mock.com/api/user/${ids.join(',')}`)
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        return res
      } else {
        throw new Error(res.statusText)
      }
    })
    .then(res => {
      let resp = res.json()
      if (ids.length === 1) {
        return Promise.resolve(resp)
          .then(result => [result])
      } else {
        return resp
      }
    })
    .catch(err => {
      throw err
    })
}


// Test

setTimeout(() => {
  getUserById(888)
    .then(res => console.log(`res0-888: ${res}`))
    .catch(err => console.log(`err0-888: ${err}`)) // Output: err
}, 0)

setTimeout(() => {
  getUserById(1)
    .then(res => console.log(`res1-1: ${res}`))
    .catch(err => console.log(`err1-1: ${err}`)) // Output: err
  getUserById(2)
    .then(res => console.log(`res1-2: ${res}`))
    .catch(err => console.log(`err1-2: ${err}`)) // Output: err
  getUserById(888)
    .then(res => console.log(`res1-888: ${res}`))
    .catch(err => console.log(`err1-888: ${err}`)) // Output: err
}, 1000)

setTimeout(() => {
  getUserById(1)
    .then(res => console.log(`res2-1: ${res}`)) // Output: res
    .catch(err => console.log(`err2-1: ${err}`)) 
  getUserById(2)
    .then(res => console.log(`res2-2: ${res}`)) // Output: res
    .catch(err => console.log(`err2-2: ${err}`)) 
}, 2000)

setTimeout(() => {
  getUserById(1)
    .then(res => console.log(`res3-1: ${res}`)) //Output: res
    .catch(err => console.log(`err3-1: ${err}`)) 
  getUserById(2)
    .then(res => console.log(`res3-2: ${res}`)) //Output: res
    .catch(err => console.log(`err3-2: ${err}`)) 
  getUserById(888)
    .then(res => console.log(`res3-888: ${res}`))
    .catch(err => console.log(`err3-888: ${err}`)) // Output: err
}, 3000)
