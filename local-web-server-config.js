// https://github.com/lwsjs/local-web-server/wiki
// ws --config-file local-web-server-config.js
module.exports = {
    rewrite: [
        {
            from: '/odata/*',
            to: 'https://agrotrnspmngm2s0004431717trial.hanatrial.ondemand.com/MyOrders/odata/'
        },
        {
            from: '/test/*',
            to: '../../'
        }
    ]
}