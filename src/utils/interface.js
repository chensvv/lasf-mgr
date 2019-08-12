const INTERFACE = {
  'public_host': 'http://10.110.148.59:8085/lasf-mgr'
}

switch (window.location.herf) {
  case 'dev':
    NTERFACE.public_host = "";
    break;
  case 'pro':
    NTERFACE.public_host = "";
    break;
}

const INTERCHILD = {
  'applist': INTERFACE.public_host + '/app/list',
  'reglist': INTERFACE.public_host + '/app/alireg',
  'wordlist': INTERFACE.public_host + '/app/keyword',
  'cachelist': INTERFACE.public_host + '/app/cache',
  'cachedel': INTERFACE.public_host + '/app/cachedel',
  'cacheadd': INTERFACE.public_host + '/app/cacheadd',
  'waslist': INTERFACE.public_host + '/was/weblist',
  'wasadd': INTERFACE.public_host + '/was/add',
  'wasupd': INTERFACE.public_host + '/was/update',
  'wasdel': INTERFACE.public_host + '/was/delete',
  'dictlist': INTERFACE.public_host + '/dict/list',
  'dictaddupd': INTERFACE.public_host + '/dict/addandUpdate',
  'dictdel': INTERFACE.public_host + '/dict/del',
  'csclist': INTERFACE.public_host + '/csc/csc',
  'cscadd': INTERFACE.public_host + '/csc/add',
  'cscdel': INTERFACE.public_host + '/csc/delete',
  'qalist': INTERFACE.public_host + '/qa/list'
}
export default {
  INTERCHILD,
  INTERFACE
}
