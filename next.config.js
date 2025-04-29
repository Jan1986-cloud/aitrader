/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Genereert statische HTML/CSS/JS bestanden
  trailingSlash: true,  // Voegt trailing slashes toe aan URLs
  images: {
    unoptimized: true,  // Nodig voor statische export
  },
}

module.exports = nextConfig