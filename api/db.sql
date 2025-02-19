CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                       email VARCHAR(50) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                        image_url VARCHAR(255),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE connection_requests (
                                     id SERIAL PRIMARY KEY,
                                     sender_id INT REFERENCES users(id) ON DELETE CASCADE,
                                     receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
                                     status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
                                    message TEXT NOT NULL,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_connection ON connection_requests (
    LEAST(sender_id, receiver_id),
    GREATEST(sender_id, receiver_id)
    );


CREATE TABLE messages (
                          id SERIAL PRIMARY KEY,
                          sender_id INT REFERENCES users(id) ON DELETE CASCADE,
                          receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
                          message TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);