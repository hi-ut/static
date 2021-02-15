const process = {
  env: {
    BASE_URL: location.href.includes('localhost')
      ? 'http://localhost:8000'
      : 'https://www.hi.u-tokyo.ac.jp/dev',
    DATA_URL: location.href.includes('localhost')
      ? 'http://localhost:8000'
      : 'https://raw.githubusercontent.com/hi-ut/static_test/master',
  },
}
