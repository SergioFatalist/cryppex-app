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
       ii.invests_count    AS invests_count,
       ii.invests_amount   AS invests_amount,
       ii.invests_interest AS invests_interest
FROM users AS u
         LEFT JOIN (SELECT i.user_id       AS user_id,
                           count(id)       AS invests_count,
                           sum(i.amount)   AS invests_amount,
                           sum(i.interest) AS invests_interest
                    FROM investments AS i
                    WHERE i.closed IS false
                    GROUP BY i.user_id) AS ii ON ii.user_id = u.id;