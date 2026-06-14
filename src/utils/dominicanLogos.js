// Map of tvg-id → channel number and display name for known Dominican channels
const KNOWN_CHANNELS = [
  { id: 'TeleAntillas.do',    num: 2,  label: 'Tele Antillas'   },
  { id: 'Canal4RD.do',        num: 4,  label: 'Canal 4 RD'      },
  { id: 'Telemicro.do',       num: 5,  label: 'Telemicro'       },
  { id: 'TelemicroInternacional.do', num: 5, label: 'Telemicro Internacional' },
  { id: 'Antena7.do',         num: 7,  label: 'Antena 7'        },
  { id: 'ColorVision.do',     num: 9,  label: 'Color Vision'    },
  { id: 'CDN.do',             num: 10, label: 'CDN'             },
  { id: 'CDNDeportes.do',     num: 10, label: 'CDN Deportes'    },
  { id: 'Telesistema11.do',   num: 11, label: 'Telesistema 11'  },
  { id: 'RNN.do',             num: 13, label: 'RNN'             },
  { id: 'Canal17RTVD.do',     num: 17, label: 'Canal 17 RTVD'   },
  { id: 'CinevisionCanal19.do', num: 19, label: 'Cinevision Canal 19' },
  { id: 'Telecentro.do',      num: 26, label: 'Telecentro'      },
  { id: 'Teleuniverso.do',    num: 29, label: 'Teleuniverso'    },
  { id: 'TVN24.do',           num: 24, label: 'TVN24'           },
]

const ID_MAP = Object.fromEntries(KNOWN_CHANNELS.map(c => [c.id.toLowerCase(), c]))

export function getChannelNumber(tvgId) {
  if (!tvgId) return 999
  const entry = ID_MAP[tvgId.toLowerCase().split('@')[0]]
  return entry?.num ?? 999
}

// Logos (Wikipedia/public CDN) — keyed by partial tvg-id (before @)
const LOGO_MAP = {
  'teleantillas.do':          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/TeleAntillas_Logo.png/120px-TeleAntillas_Logo.png',
  'canal4rd.do':              'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Canal_4_RD.png/120px-Canal_4_RD.png',
  'telemicro.do':             'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Canal5DO-logo.svg/120px-Canal5DO-logo.svg.png',
  'telemicrointernacional.do':'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Canal5DO-logo.svg/120px-Canal5DO-logo.svg.png',
  'antena7.do':               'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Antena7RD.png/120px-Antena7RD.png',
  'colorvision.do':           'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Color_Vision_Logo.png/120px-Color_Vision_Logo.png',
  'cdn.do':                   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/CDN_logo.png/120px-CDN_logo.png',
  'cdndeportes.do':           'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/CDN_logo.png/120px-CDN_logo.png',
  'telesistema11.do':         'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Logo_Telesistema.png/120px-Logo_Telesistema.png',
  'rnn.do':                   'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/RNN_Logo.png/120px-RNN_Logo.png',
  'canal17rtvd.do':           'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/RTVD.png/120px-RTVD.png',
  'telecentro.do':            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Telecentro_DO.png/120px-Telecentro_DO.png',
  'teleuniverso.do':          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Teleuniverso.png/120px-Teleuniverso.png',
  'tvn24.do':                 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/TVN24.svg/120px-TVN24.svg.png',
  'cinevisioncanal19.do':     'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Cinevision_logo.png/120px-Cinevision_logo.png',
}

export function getLogo(tvgId) {
  if (!tvgId) return null
  const key = tvgId.toLowerCase().split('@')[0]
  return LOGO_MAP[key] ?? null
}
