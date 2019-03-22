fuser -k 3000/tcp
service redis_6379 start

cd ./server
nodemon server.js &


cd ../executor
python3 executor_server.py &


echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

fuser -k 3000/tcp
service redis_6379 stop
