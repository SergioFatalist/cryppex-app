CREATE VIEW "users_info" AS
SELECT u.id                AS id,
       u.username          AS username,
       u.first_name        AS first_name,
       u.last_name         AS last_name,
       u.language_code     AS language_code,
       u.address           AS address,
       u.balance           AS balance,
       u.ref_id            AS ref_id,
       u.created           AS created,
       i.invests_count    AS invests_count,
       i.invests_amount   AS invests_amount,
       i.invests_interest AS invests_interest
FROM users AS u
         LEFT JOIN (SELECT i.user_id       AS user_id,
                           count(id)       AS invests_count,
                           sum(i.amount)   AS invests_amount,
                           sum(i.interest) AS invests_interest
                    FROM investments AS i
                    WHERE i.closed IS false
                    GROUP BY i.user_id) AS i ON i.user_id = u.id;

CREATE VIEW "refs_info" AS
SELECT u.id,
       u.username,
       u.first_name,
       u.last_name,
       u.language_code,
       u.balance,
       u.ref_id,
       u.created,
       p.amount AS pending,
       a.amount AS applied
FROM users u
         LEFT JOIN (SELECT ref_id, sum(bonuses.amount) AS amount FROM bonuses WHERE applied = false GROUP BY ref_id) p ON p.ref_id = u.id
         LEFT JOIN (SELECT ref_id, sum(bonuses.amount) AS amount FROM bonuses WHERE applied = true GROUP BY ref_id) a ON a.ref_id = u.id