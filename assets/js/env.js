const process = {
  env: {
    BASE_URL: location.href.includes('hi.u-tokyo.ac.jp')
      ? 'https://www.hi.u-tokyo.ac.jp/dev'
      : 'http://localhost:5500',
  },
}
