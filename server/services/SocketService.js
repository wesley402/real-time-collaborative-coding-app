var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;



module.exports = function(io) {

    // one page has one socket id
    var collaborations = []; // collabration session
    var socketIdToSessionId = []; // map socket ID to session ID
    var sessionPath = "/temp_sessions/";

    io.on('connection', (socket) => {
        let sessionId = socket.handshake.query['sessionId']; // get session
        socketIdToSessionId[socket.id] = sessionId; // map socket to session

        if(sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        }
        else {
            console.log('sessionId not in collabration')
            redisClient.get(sessionPath + sessionId, function(data) {
                if(data) {
                    console.log('session terminated previously: pulling back from Redis.');
                    collaborations[sessionId] = {
                        'cachedChangeEvents': JSON.parse(data),
                        'participants': []
                    };
                }
                else {
                    console.log('creating new session');
                    collaborations[sessionId] = {
                        'cachedChangeEvents': [],
                        'participants': []
                    };
                }
                collaborations[sessionId]['participants'].push(socket.id);
            });
        }

        socket.on('change', (delta) => {
            let sessionId = socketIdToSessionId[socket.id];
            console.log('change');
            if(sessionId in collaborations) {
                collaborations[sessionId]['cachedChangeEvents'].push(
                  ['change', delta, Date.now()]
                );
                let participants = collaborations[sessionId]['participants'];
                for(let i = 0; i < participants.length; i++) {
                    if(socket.id != participants[i]) {
                        io.to(participants[i]).emit('change', delta);
                    }
                }

            }
            else {
                console.log('WARNING: could not tie socket_id to any collaboration');
            }
        });

        socket.on('restoreBuffer', () => {
            let sessionId = socketIdToSessionId[socket.id];
            console.log('restoring buffer for session: ' + sessionId + ', socket: ' + socket.id);
            if(sessionId in collaborations) {
                let changeEvents = collaborations[sessionId]['cachedChangeEvents'];
                for(let i = 0; i < changeEvents.length; i++) {
                    socket.emit(changeEvents[i][0], changeEvents[i][1]);
                }
            }
        })

        socket.on('cursorMove', cursor => {
            console.log('cursorMove ' + socketIdToSessionId[socket.id] + ' ' + cursor);
            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;

            let sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for(let i = 0; i < participants.length; i++) {
                    if(socket.id != participants[i]) {
                        io.to(participants[i]).emit('cursorMove', JSON.stringify(cursor));
                    }
                }

            }
            else {
                console.log('WARNING: could not tie socket_id to any collaboration');
            }
        });

        socket.on('disconnect', function() {
            let sessionId = socketIdToSessionId[socket.id];
            console.log('socket ' + socket.id + 'disconnected');
            if(sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                let index = participants.indexOf(socket.id);
                if(index >= 0) {
                    participants.splice(index, 1);
                    if(participants.length == 0) {
                        console.log('last participant left. Storing in Redis.');
                        let key = sessionPath + '/' + sessionId;
                        let value = JSON.stringify(collaborations[sessionId]['cachedChangeEvents']);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }

                }
            }

        });
    });
};
