/* eslint-disable @typescript-eslint/no-unused-vars */
// # Mapping Function Name
// WithPrefix
// # Mapping Function Code
function map(req, env) {
  const r = /[^/]*\/\/[^/]+\/([^/]+)\/([^/]+)\/(.*)$/.exec(req.url)
  if (r) {
    return {
      media_key: req.path,
      fwd_key: r[3],
      transformation: r[2],
      resource_type: r[1],
    }
  }
  return {
    media_key: req.path,
    transformation: 'f_auto,q_auto',
    resource_type: 'image',
  }
}
