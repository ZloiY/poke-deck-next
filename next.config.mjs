// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      }
    ]
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@svgr/webpack'
        },
      ],
    });
    return config;
  }
};
export default config;
