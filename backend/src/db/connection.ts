import { Client } from 'cassandra-driver';

// export const cassandraClient = new Client({
//     contactPoints: ['172.17.0.2'],
//     localDataCenter: 'datacenter1',
//     keyspace: 'email_reminder',
//     socketOptions: {
//         connectTimeout: 60000, 
//         readTimeout: 60000     
//     }
// });

// cassandraClient.connect()
//     .then(() => console.log('Connected to Cassandra'))
//     .catch(err => console.error('Error connecting to Cassandra', err));

export const cassandraClient = new Client({
    contactPoints: ['127.0.0.1'], 
    localDataCenter: 'datacenter1',
    keyspace: 'email_reminder',
    socketOptions: {
        connectTimeout: 60000, 
        readTimeout: 60000      
    }
});

cassandraClient.connect()
    .then(() => console.log('Connected to Cassandra'))
    .catch(err => console.error('Error connecting to Cassandra', err));
