export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
      // 如果需要 directUrl（如连接池场景），可以取消注释：
      // directUrl: process.env.DIRECT_DATABASE_URL,
    },
  },
}