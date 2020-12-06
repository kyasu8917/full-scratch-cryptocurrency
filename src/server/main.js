const Server = require('./server');

var server = new Server(process.argv[2], process.argv[3]);
// catching signals and do something before exit
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function (sig) {
    process.once(sig, function () {
        console.log('signal: ' + sig);
        server.beforeShotdown();
    });
});