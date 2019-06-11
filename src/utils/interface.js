/* eslint-disable no-undef */
const INTERFACE = {
  // 'public_host': 'http://hotpay.test.hbtalk.org',
}

switch (window.location.herf) {
  case 'dev':
    NTERFACE.public_host = ''
    break
  case 'pro':
    NTERFACE.public_host = ''
    break
}

const INTERCHILD = {
  // 'GETCODE': INTERFACE.public_host + '/active/getValidateCode.do',
}
export default {
  INTERCHILD,
  INTERFACE
}
