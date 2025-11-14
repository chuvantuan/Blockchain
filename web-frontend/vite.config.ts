import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // load .env files
  const env = loadEnv(mode, process.cwd(), '')

  const adminTarget = env.VITE_ADMIN_SERVICE_URL || 'http://localhost:9003'
  const identityTarget = env.VITE_IDENTITY_SERVICE_URL || 'http://localhost:9001'
  const examTarget = env.VITE_EXAM_API_URL || 'http://localhost:9002'
  const courseTarget = env.VITE_COURSE_API_URL || 'http://localhost:9004'
  const onlineExamTarget = env.VITE_ONLINE_EXAM_API_URL || 'http://localhost:9005'
  const multisigTarget = env.VITE_MULTISIG_SERVICE_URL || 'http://localhost:9010'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // Frontend calls '/admin/*' -> proxy to admin service under /api/v1/admin/security
        '/admin': {
          target: adminTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/admin/, '/api/v1/admin/security')
        },
        // '/identity/*' -> proxy to identity service under /api/v1
        '/identity': {
          target: identityTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/identity/, '/api/v1')
        },
        // '/exam' -> proxy to exam service under /api/v1
        '/exam': {
          target: examTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/exam/, '/api/v1')
        },
        // '/course' -> proxy to course service
        '/course': {
          target: courseTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/course/, '/api/v1')
        },
        // '/online-exam' -> proxy to online exam service
        '/online-exam': {
          target: onlineExamTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/online-exam/, '')
        },
        // '/multisig' -> proxy to multisig service
        '/multisig': {
          target: multisigTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/multisig/, '/api/v1/multisig')
        }
      }
    }
  }
})
