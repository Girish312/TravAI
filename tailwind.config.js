module.exports = {
  theme: {
    extend: {
      animation: {
        cloud1: 'cloudMove1 20s linear infinite',
        cloud2: 'cloudMove2 25s linear infinite',
      },
      keyframes: {
        cloudMove1: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        cloudMove2: {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
};
