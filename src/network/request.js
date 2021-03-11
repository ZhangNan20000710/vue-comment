import axios from 'axios'
export function request(config) {
  const comment = axios.create({
    baseURL: "http://localhost:8081",
    headers: {
      token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOlsiNDAyOGQxODE3NjllNDVjODAxNzY5ZTQ2Y2U5ZjAwODciLCI1NzA2NDU4NDciXSwiZXhwIjoxNjEwOTQ4OTcyLCJpYXQiOjE2MTA5NDUzNzJ9.rhehwAtoszqzXwRlkqfHlslbiCe3rcet5jKyTI_RO_o"
    },
  })

  comment.interceptors.response.use(config => {
    return config.data
  },err=>{//失败响应拦截
    console.log(err);
  })
  return comment(config)
}