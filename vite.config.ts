import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 저장소 하위 경로와 도메인 루트 모두에서 빌드 결과를 제공할 수 있습니다.
export default defineConfig({ base: './', plugins: [react()] });
