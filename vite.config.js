import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
export default defineConfig({
    base: './', // relative asset paths
    plugins: [viteSingleFile()],
    build: {
        assetsInlineLimit: 100000000, // inline images too
        cssCodeSplit: false,
    },
});