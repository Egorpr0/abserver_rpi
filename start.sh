while ! exec 6<>/dev/tcp/${MARIADB_ADDRESS}/3306; do
    echo "$(date) - still trying to connect to mariadb at ${MARIADB_ADDRESS}"
    sleep 1
done

while ! exec 6<>/dev/tcp/${REDIS_URL}/6379; do
    echo "$(date) - still trying to connect to redis at ${REDIS_URL}"
    sleep 1
done

rails db:create
rails db:migrate

rails s -b 0.0.0.0