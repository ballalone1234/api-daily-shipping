module.exports = {
    apps: [
      {
        name: 'API-Starter',
        script: './app.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '2G',
        env: {
          NODE_ENV: 'development',
          TZ: 'Asia/Bangkok'
        },
        env_production: {
          NODE_ENV: 'production',
          TZ: 'Asia/Bangkok'
        }
      }
    ]
  }
  