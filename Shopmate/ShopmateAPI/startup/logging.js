const winston = require('winston');
const { format } = winston;

require('express-async-errors');
const morgan = require('morgan');

module.exports = function (app) {    

    winston.add(new winston.transports.File({
        filename: 'logfile.log'
    }));

    winston.exceptions.handle([
        new winston.transports.File({
            filename: 'uncaughtExceptions.log',
            level: 'error'
        },
        new winston.transports.Console({
                format: format.combine(
                    format.timestamp(),
                    format.colorize(),
                    format.prettyPrint({ colorize: true }),
                    format.simple()
            ),
            level: 'error'
        }))
    ]);

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    if (app.get('env') === 'development') {
        winston.add(new winston.transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.prettyPrint({ colorize: true }),
                format.simple()              
            )
        }));
        app.use(morgan('tiny'));
        winston.info('Development level logging to console...');
    }
};