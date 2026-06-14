// Curated primary stream URLs from u.tvabierta.net (reliable Dominican CDN).
// Keys use fuzzy normalization: lowercase, no spaces, no "RD " prefix.
// These are tried FIRST before the iptv-org URL for each channel.
export const EXTRA_STREAMS = {
  'teleantillas':   ['https://u.tvabierta.net/memfs/bfcf3849-a054-4b72-b731-e9d76192a74f.m3u8'],
  'telemicro':      ['https://u.tvabierta.net/memfs/b97163c9-f21f-49d9-8076-a4926861b305.m3u8'],
  'antena7':        ['https://u.tvabierta.net/memfs/8aefe158-abbf-498b-825c-02695a69fa7f.m3u8',
                     'https://d3mhrz6vhsrmmq.cloudfront.net/index.m3u8'],
  'colorvision':    ['https://u.tvabierta.net/memfs/1d58d166-adc9-4cbe-921d-07da03925317.m3u8'],
  'cdn':            ['https://rtmp-live-ingest-us-east-1-universe-dacast-com.akamaized.net/transmuxv1/streams/ae3e71b4-52af-d834-7388-fc75f9401a03.m3u8',
                     'http://108.168.206.90:1935/cdn/cdn/playlist.m3u8'],
  'cdndeportes':    ['https://u.tvabierta.net/memfs/fbcd05fb-6bbc-4a49-8e76-f282d00da810.m3u8'],
  'telesistema11':  ['https://u.tvabierta.net/memfs/e5ce4485-ee3c-4b68-829d-cbad8230ee68.m3u8',
                     'http://ss3.domint.net:2114/t11_str/telesistema/playlist.m3u8'],
  'telesistema':    ['https://u.tvabierta.net/memfs/e5ce4485-ee3c-4b68-829d-cbad8230ee68.m3u8',
                     'http://ss3.domint.net:2114/t11_str/telesistema/playlist.m3u8'],
  'rnn':            ['https://u.tvabierta.net/memfs/f2f3b3ab-bb2c-4674-a489-2ccc3f2ba77e.m3u8',
                     'http://ss1.domint.net:2122/rnn_str/canal27/playlist.m3u8'],
  'rnndos':         ['https://u.tvabierta.net/memfs/f2f3b3ab-bb2c-4674-a489-2ccc3f2ba77e.m3u8'],
  'telecentro':     ['https://u.tvabierta.net/memfs/966badef-a62a-4386-9db4-0665ff13ae37.m3u8'],
  'televida':       ['https://u.tvabierta.net/memfs/f0e6772a-6e9c-4e76-8104-e7140b33011f.m3u8'],
  'antena21':       ['https://u.tvabierta.net/memfs/c6e222cc-546e-4493-a0ba-913b630a5f49.m3u8'],
  'acento':         ['https://u.tvabierta.net/memfs/a997d04a-79ca-4ce1-906e-81e52316f3c7.m3u8'],
  'coral':          ['https://u.tvabierta.net/memfs/3ad4a730-189f-4e12-a9a4-a074af45725f.m3u8'],
  'telenovisa':     ['https://u.tvabierta.net/memfs/f7fc75d3-5dbd-4341-aed2-868f099dbfe5.m3u8'],
  'elnuevodiario':  ['https://u.tvabierta.net/memfs/661a783c-6b95-4fef-b6f3-708ee2f3f05d.m3u8'],
}

// Fuzzy key: lowercase, strip "RD " prefix, remove all spaces/hyphens
export const nameKey = (name) =>
  (name || '').toLowerCase()
    .replace(/^rd\s*/i, '')
    .replace(/[\s\-_]+/g, '')
    .trim()
